import { NextResponse } from "next/server";

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

export function proxy(request) {
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
