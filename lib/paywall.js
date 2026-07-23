import crypto from "crypto";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";

export const ACCESS_COOKIE_NAME = "mlo_access";

// Subscription statuses that should be treated as "has access." Trialing
// counts if you set up a trial period on the Stripe Price; incomplete/past_due
// do not, since payment hasn't actually succeeded yet.
const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function getSecret() {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) throw new Error("COOKIE_SECRET is not set");
  return secret;
}

// Signs { customerId } into a compact, tamper-proof token. This is not
// encryption — the payload is just base64, not secret — it's a signature so
// the server can trust a customerId claim came from us and wasn't forged by
// editing the cookie in dev tools. The real access decision always comes from
// a live Stripe lookup, never from trusting this token's contents alone.
export function signAccessToken(customerId) {
  const payload = base64url(JSON.stringify({ customerId, issuedAt: Date.now() }));
  const signature = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAccessToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

// Always hits Stripe live — this app has no database, so Stripe's own
// subscription status is the only source of truth. This is what makes
// cancellations take effect immediately instead of waiting for a stale cookie
// to expire.
export async function customerHasActiveSubscription(customerId) {
  const stripe = getStripe();
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });
    return subscriptions.data.some((sub) => ACTIVE_STATUSES.has(sub.status));
  } catch (err) {
    // If Stripe is slow, down, or errors, fail closed (no access) rather than
    // hanging the page or crashing the render.
    console.error("customerHasActiveSubscription failed:", err);
    return false;
  }
}

// Shared by the protected-route layout and by individual free-tier pages that
// need to know access status without necessarily redirecting (e.g. to decide
// which of two components to render).
export async function hasActiveAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const claim = token ? verifyAccessToken(token) : null;
  if (!claim) return false;
  return customerHasActiveSubscription(claim.customerId);
}
