import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";

const ERRORS = {
  portal: "Couldn't open the billing portal right now. Please try again in a moment.",
};

export default async function AccountPage({ searchParams }) {
  const { error } = await searchParams;
  const errorMessage = ERRORS[error];

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-white shadow-lg">
          <CreditCard size={26} strokeWidth={2.25} />
        </span>
        <h1 className="font-display text-2xl font-bold text-navy-900">Your Subscription</h1>
        <p className="text-sm text-navy-500">Manage your plan, payment method, or cancel anytime.</p>
      </div>

      {errorMessage && (
        <p className="rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">
          {errorMessage}
        </p>
      )}

      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
        <p className="text-sm text-navy-600">
          You&apos;re on the <span className="font-semibold text-navy-900">$9.99/month</span> plan.
          To cancel, update your payment method, or view past invoices, use Stripe&apos;s secure
          billing portal below. Canceling stops future billing — you&apos;ll keep access through
          the end of your current billing period.
        </p>

        <form action="/api/billing-portal" method="POST">
          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800"
          >
            Manage or Cancel Subscription <ArrowRight size={16} />
          </button>
        </form>
      </div>

      <Link href="/" className="text-center text-sm font-medium text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
