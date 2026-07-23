import Stripe from "stripe";

let stripeClient = null;

// Lazily initialized so builds don't fail if the env var isn't set yet
// (e.g. before you've added it in Vercel) — it's only required at request time.
export function getStripe() {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Force Stripe's own Node HTTP client instead of letting it pick up the
      // global `fetch`, which Next.js instruments for its own caching/dynamic
      // tracking — that instrumentation can hang requests made from inside a
      // Suspense-wrapped Server Component. Also cap request time so a slow or
      // unreachable Stripe never hangs a page load indefinitely.
      httpClient: Stripe.createNodeHttpClient(),
      timeout: 8000,
    });
  }
  return stripeClient;
}
