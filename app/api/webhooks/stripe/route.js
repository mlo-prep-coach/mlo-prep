import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sendSecurityAlert } from "@/lib/alerts";

// Events worth an immediate email — signals of fraud or a payment dispute,
// not routine subscription lifecycle events.
const ALERT_EVENTS = new Set([
  "radar.early_fraud_warning.created",
  "charge.dispute.created",
]);

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe webhook received but STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (ALERT_EVENTS.has(event.type)) {
    const obj = event.data.object;
    await sendSecurityAlert(`Stripe flagged: ${event.type}`, [
      `Event: ${event.type}`,
      `Object ID: ${obj.id}`,
      obj.amount ? `Amount: ${(obj.amount / 100).toFixed(2)} ${obj.currency?.toUpperCase() ?? ""}` : "",
      obj.charge ? `Charge: ${obj.charge}` : "",
      `Time: ${new Date(event.created * 1000).toISOString()}`,
      "",
      "Check Stripe Dashboard > Radar or Disputes for details.",
    ].filter(Boolean));
  }

  return NextResponse.json({ received: true });
}
