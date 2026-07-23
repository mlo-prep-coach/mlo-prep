export const metadata = {
  title: "Privacy Policy — MLO Prep",
  description: "Privacy nutrition label and full privacy policy for MLO Prep.",
};

const SECTION_CLASS = "flex flex-col gap-2";
const HEADING_CLASS = "font-display text-base font-bold text-navy-900";
const BODY_CLASS = "text-sm leading-relaxed text-navy-600";

const LABEL_ROWS = [
  {
    category: "Study profile",
    examples: "First name, exam date, study hours per day",
    stored: "Your browser only (localStorage)",
    linked: "Not linked",
    sharedWith: "No one — never leaves your device",
  },
  {
    category: "Practice & exam activity",
    examples: "Answers, scores, bookmarks, streaks, XP",
    stored: "Your browser only (localStorage)",
    linked: "Not linked",
    sharedWith: "No one — never leaves your device",
  },
  {
    category: "Email address",
    examples: "Entered on the “Restore Access” form",
    stored: "Not stored by us — we have no database",
    linked: "Linked to you",
    sharedWith: "Stripe, to look up your subscription",
  },
  {
    category: "Payment & billing info",
    examples: "Card number, billing address",
    stored: "Never touches our servers",
    linked: "Linked to you, by Stripe",
    sharedWith: "Stripe (our payment processor) only",
  },
  {
    category: "Subscription status token",
    examples: "A signed cookie referencing your Stripe customer ID",
    stored: "Your browser cookie only",
    linked: "Linked to you",
    sharedWith: "Checked against Stripe on each visit",
  },
  {
    category: "Basic hosting logs",
    examples: "IP address, browser type, request timestamps",
    stored: "Vercel (our hosting provider), briefly",
    linked: "Not linked by us",
    sharedWith: "Vercel, for security and uptime only",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-navy-900">Privacy Policy</h1>
        <p className="text-sm text-navy-400">Last updated: July 23, 2026</p>
      </div>

      {/* Privacy nutrition label */}
      <div className="overflow-hidden rounded-2xl border-2 border-navy-900">
        <div className="border-b-2 border-navy-900 bg-navy-900 px-5 py-4">
          <p className="font-display text-lg font-extrabold text-white">Privacy Nutrition Label</p>
          <p className="mt-0.5 text-xs text-navy-200">
            A quick, plain-language summary of what MLO Prep collects. Full details below.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-navy-100">
          <div className="grid grid-cols-4 gap-2 bg-navy-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-navy-400">
            <span>Data</span>
            <span>Where it&apos;s stored</span>
            <span>Linked to you?</span>
            <span>Shared with</span>
          </div>
          {LABEL_ROWS.map((row) => (
            <div key={row.category} className="grid grid-cols-4 gap-2 px-4 py-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-navy-900">{row.category}</span>
                <span className="text-navy-400">{row.examples}</span>
              </div>
              <span className="self-start text-navy-600">{row.stored}</span>
              <span className="self-start text-navy-600">{row.linked}</span>
              <span className="self-start text-navy-600">{row.sharedWith}</span>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-navy-900 bg-navy-50 px-5 py-4">
          <ul className="flex flex-col gap-1 text-xs font-semibold text-navy-700">
            <li>✓ No advertising or cross-site tracking cookies</li>
            <li>✓ No analytics or behavioral tracking scripts</li>
            <li>✓ We never see or store your full card number</li>
            <li>✓ We have no database — most of your data never leaves your device</li>
            <li>✓ We never sell your data</li>
          </ul>
        </div>
      </div>

      <p className={BODY_CLASS}>
        MLO Prep is intentionally built without a database. Your study profile and practice
        activity live in your browser&apos;s local storage and are never transmitted to us. The
        only information we ever receive is your email address (if you use Restore Access) and
        what Stripe tells us about your subscription status — we never receive or store your
        payment card details, which go directly to Stripe.
      </p>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>1. Information stored only on your device</h2>
        <p className={BODY_CLASS}>
          Your first name, exam date, study hours per day, practice and exam answers, scores,
          bookmarks, streaks, and XP are all saved using your browser&apos;s local storage. This
          data is never sent to our servers, is not visible to us, and is deleted if you clear
          your browser&apos;s site data.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>2. Information we do receive</h2>
        <p className={BODY_CLASS}>
          When you subscribe, Stripe handles checkout on its own hosted page and shares with us
          only your Stripe customer ID and subscription status — never your full card number. If
          you use the &quot;Restore Access&quot; form, we send the email address you enter to
          Stripe to look up your subscription; we do not store that email ourselves, since we do
          not operate a database.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>3. Cookies</h2>
        <p className={BODY_CLASS}>
          After a successful subscription or restore, we set one functional cookie
          (&quot;mlo_access&quot;) containing a signed reference to your Stripe customer ID. It is
          used solely to verify your subscription status with Stripe on each visit to a paid
          feature. We do not use advertising, analytics, or cross-site tracking cookies.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>4. Third parties we use</h2>
        <p className={BODY_CLASS}>
          <strong className="text-navy-800">Stripe</strong>{" "}
          processes all payments and subscription
          management; see Stripe&apos;s own privacy policy for how it handles your payment data.{" "}
          <strong className="text-navy-800">Vercel</strong>{" "}
          hosts this website and may briefly log
          basic technical information, like IP address and browser type, for security and
          reliability purposes. We do not share your information with any other third party, and
          we never sell your data.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>5. Your choices</h2>
        <p className={BODY_CLASS}>
          You can clear all locally stored study data at any time by clearing your browser&apos;s
          site data for this site. You can cancel your subscription at any time, which stops
          future billing; Stripe retains standard payment records as required for its own
          compliance obligations. To ask a question about your data, email{" "}
          <a href="mailto:jaden.lz21a@gmail.com" className="text-brand-600 underline">
            jaden.lz21a@gmail.com
          </a>
          .
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>6. Children&apos;s privacy</h2>
        <p className={BODY_CLASS}>
          MLO Prep is intended for adults studying for a professional licensing exam and is not
          directed at children under 13.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>7. Changes to this policy</h2>
        <p className={BODY_CLASS}>
          If we make material changes to this policy, we will update the &quot;Last updated&quot;
          date above.
        </p>
      </div>
    </div>
  );
}
