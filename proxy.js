import { NextResponse } from "next/server";
import { sendSecurityAlert } from "@/lib/alerts";

// Best-effort, per-instance rate limiting for the API routes that touch
// Stripe or grant access. This is an in-memory sliding window, so it resets
// whenever the serverless/edge instance recycles — it raises the bar against
// casual scripted abuse, but it is not a durable guarantee across a fleet of
// instances. Pair this with Vercel's Firewall (Project Settings > Firewall)
// for real distributed rate limiting.
const WINDOW_MS = 60 * 1000;
const LIMITS = {
  "/api/restore-access": 8,
  "/api/checkout": 20,
  "/api/checkout/callback": 30,
  "/api/billing-portal": 20,
};

const hits = new Map();
const MAX_TRACKED_KEYS = 5000;

// Tracks how many times each IP gets rate-limited (429'd), across any
// endpoint, to spot scripted abuse and email an alert — separate from the
// rate limiter itself, which just blocks requests. Alerts are throttled per
// IP so a sustained attack sends one email, not hundreds.
const ABUSE_ALERT_THRESHOLD = 3;
const ABUSE_WINDOW_MS = 10 * 60 * 1000;
const ALERT_COOLDOWN_MS = 60 * 60 * 1000;
const abuseTracker = new Map();

function trackAbuseAndMaybeAlert(ip, path) {
  const now = Date.now();
  const entry = abuseTracker.get(ip);

  if (!entry || now - entry.windowStart > ABUSE_WINDOW_MS) {
    abuseTracker.set(ip, { windowStart: now, count: 1, lastAlertAt: entry?.lastAlertAt ?? 0 });
    return undefined;
  }

  entry.count += 1;
  if (entry.count >= ABUSE_ALERT_THRESHOLD && now - entry.lastAlertAt > ALERT_COOLDOWN_MS) {
    entry.lastAlertAt = now;
    return sendSecurityAlert("Repeated rate-limit hits", [
      `IP ${ip} has been rate-limited ${entry.count} times in the last ${ABUSE_WINDOW_MS / 60000} minutes.`,
      `Most recent blocked path: ${path}`,
      `Time: ${new Date(now).toISOString()}`,
      "",
      "This usually means a bot or script is hammering an API endpoint. The rate limiter is already blocking the requests — this is just a heads-up.",
    ]);
  }
  return undefined;
}

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function pruneStaleEntries(now) {
  for (const [key, entry] of hits) {
    if (now - entry.start > WINDOW_MS) hits.delete(key);
  }
}

export function proxy(request, event) {
  const path = request.nextUrl.pathname;
  const limit = LIMITS[path];
  if (!limit) return NextResponse.next();

  const ip = getClientIp(request);
  const key = `${path}:${ip}`;
  const now = Date.now();
  const entry = hits.get(key);

  if (hits.size > MAX_TRACKED_KEYS) pruneStaleEntries(now);

  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(key, { start: now, count: 1 });
    return NextResponse.next();
  }

  entry.count += 1;
  if (entry.count > limit) {
    event?.waitUntil?.(Promise.resolve(trackAbuseAndMaybeAlert(ip, path)));
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/checkout", "/api/checkout/callback", "/api/restore-access", "/api/billing-portal"],
};
