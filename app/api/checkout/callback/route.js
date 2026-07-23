import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { signAccessToken, ACCESS_COOKIE_NAME } from "@/lib/paywall";

export async function GET(request) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const origin = request.nextUrl.origin;

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/upgrade?error=missing_session`, 303);
  }

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
}
