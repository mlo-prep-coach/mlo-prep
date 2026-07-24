import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { verifyAccessToken, ACCESS_COOKIE_NAME } from "@/lib/paywall";

export async function POST(request) {
  const origin = request.nextUrl.origin;
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const claim = token ? verifyAccessToken(token) : null;

  if (!claim) {
    return NextResponse.redirect(`${origin}/upgrade`, 303);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: claim.customerId,
      return_url: `${origin}/account`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("billing portal session creation failed:", err);
    return NextResponse.redirect(`${origin}/account?error=portal`, 303);
  }
}
