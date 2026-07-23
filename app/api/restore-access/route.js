import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { signAccessToken, customerHasActiveSubscription, ACCESS_COOKIE_NAME } from "@/lib/paywall";

const GENERIC_ERROR = "We couldn't find an active subscription for that email.";

export async function POST(request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const stripe = getStripe();
  const customers = await stripe.customers.list({ email: email.trim(), limit: 5 });

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
}
