import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { signAccessToken, customerHasActiveSubscription, ACCESS_COOKIE_NAME } from "@/lib/paywall";

const GENERIC_ERROR = "We couldn't find an active subscription for that email.";
// Deliberately generic — never confirm or deny whether an email has an
// account, so this endpoint can't be used to enumerate customers.
const BAD_REQUEST_ERROR = "Enter a valid email address.";

// Simple, permissive email shape check — not full RFC 5322 validation, just
// enough to reject obvious garbage before it reaches the Stripe API.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: BAD_REQUEST_ERROR }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: BAD_REQUEST_ERROR }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const customers = await stripe.customers.list({ email, limit: 5 });

    for (const customer of customers.data) {
      if (await customerHasActiveSubscription(customer.id)) {
        const response = NextResponse.json({ success: true });
        response.cookies.set(ACCESS_COOKIE_NAME, signAccessToken(customer.id), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
        return response;
      }
    }

    return NextResponse.json({ error: GENERIC_ERROR }, { status: 404 });
  } catch (err) {
    console.error("restore-access lookup failed:", err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 404 });
  }
}
