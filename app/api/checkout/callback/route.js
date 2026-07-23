import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { signAccessToken, ACCESS_COOKIE_NAME } from "@/lib/paywall";

// Basic shape check for a Stripe Checkout Session ID — not a security
// boundary by itself (Stripe is still the source of truth), just cheap
// input hygiene before we hand the value to the Stripe SDK.
const SESSION_ID_PATTERN = /^cs_[a-zA-Z0-9_]{10,255}$/;

export async function GET(request) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const origin = request.nextUrl.origin;

  if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) {
    return NextResponse.redirect(`${origin}/upgrade?error=missing_session`, 303);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== "complete" || !session.customer) {
      return NextResponse.redirect(`${origin}/upgrade?error=incomplete`, 303);
    }

    const response = NextResponse.redirect(`${origin}/`, 303);
    response.cookies.set(ACCESS_COOKIE_NAME, signAccessToken(session.customer), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("checkout callback failed:", err);
    return NextResponse.redirect(`${origin}/upgrade?error=incomplete`, 303);
  }
}
