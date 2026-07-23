import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request) {
  const origin = request.nextUrl.origin;

  if (!process.env.STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "Pricing is not configured yet." }, { status: 500 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/api/checkout/callback?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/upgrade`,
    allow_promotion_codes: true,
    managed_payments: { enabled: false },
  });

  return NextResponse.redirect(session.url, 303);
}
