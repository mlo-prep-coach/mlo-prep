import Stripe from "stripe";

let stripeClient = null;

// Lazily initialized so builds don't fail if the env var isn't set yet
// (e.g. before you've added it in Vercel) — it's only required at request time.
export function getStripe() {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}
