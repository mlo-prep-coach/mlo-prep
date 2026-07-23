export const metadata = {
  title: "Terms of Service — MLO Prep",
  description: "Terms of Service for MLO Prep, including the binding arbitration agreement.",
};

const SECTION_CLASS = "flex flex-col gap-2";
const HEADING_CLASS = "font-display text-base font-bold text-navy-900";
const BODY_CLASS = "text-sm leading-relaxed text-navy-600";

export default function TermsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-navy-900">Terms of Service</h1>
        <p className="text-sm text-navy-400">Last updated: July 23, 2026</p>
      </div>

      <p className={BODY_CLASS}>
        These Terms of Service (&quot;Terms&quot;) govern your use of MLO Prep (the
        &quot;Service&quot;), including the website, mock exams, practice questions,
        flashcards, and any paid subscription. By creating a local study profile,
        using the free tier, or subscribing, you agree to these Terms. If you do not
        agree, do not use the Service.
      </p>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>1. The Service is a study aid, not a guarantee</h2>
        <p className={BODY_CLASS}>
          MLO Prep is an independent study tool and is not affiliated with, endorsed
          by, or sponsored by the Nationwide Multistate Licensing System (NMLS), the
          SAFE Mortgage Licensing Act, or any state regulatory agency. Practice
          questions, explanations, and flashcards are original study aids developed
          with the assistance of AI and reviewed against current regulatory sources.
          They are not official exam questions, are not guaranteed to appear on or
          match the actual NMLS SAFE exam, and use of the Service does not guarantee
          that you will pass any licensing exam.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>2. Subscriptions and billing</h2>
        <p className={BODY_CLASS}>
          Paid access is billed monthly through our payment processor, Stripe, and
          renews automatically until canceled. You can cancel at any time; access
          continues through the end of the current billing period. Fees are
          non-refundable except where required by law.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>3. No warranties</h2>
        <p className={BODY_CLASS}>
          The Service is provided &quot;as is&quot; and &quot;as available,&quot;
          without warranties of any kind, express or implied, including
          merchantability, fitness for a particular purpose, and non-infringement. We
          do not warrant that the Service will be uninterrupted, error-free, or
          completely accurate.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>4. Limitation of liability</h2>
        <p className={BODY_CLASS}>
          To the fullest extent permitted by law, MLO Prep and its owner will not be
          liable for any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits or revenues, arising from your use of the
          Service. Our total liability for any claim relating to the Service will not
          exceed the amount you paid us in the twelve months before the claim arose.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>5. Binding arbitration agreement</h2>
        <p className={BODY_CLASS}>
          Please read this section carefully. It affects your legal rights, including
          your right to file a lawsuit in court.
        </p>
        <p className={BODY_CLASS}>
          <strong className="text-navy-800">Agreement to arbitrate.</strong> You and
          MLO Prep agree that any dispute, claim, or controversy arising out of or
          relating to these Terms or your use of the Service will be resolved by
          binding, individual arbitration, rather than in court, except that either
          party may bring an individual action in small claims court if it qualifies.
        </p>
        <p className={BODY_CLASS}>
          <strong className="text-navy-800">Informal resolution first.</strong> Before
          filing an arbitration, you agree to first contact us at{" "}
          <a href="mailto:jaden.lz21a@gmail.com" className="text-brand-600 underline">
            jaden.lz21a@gmail.com
          </a>{" "}
          and describe the dispute so we can try to resolve it informally within 60
          days.
        </p>
        <p className={BODY_CLASS}>
          <strong className="text-navy-800">Arbitration procedure.</strong> Arbitration
          will be administered by the American Arbitration Association (AAA) under its
          Consumer Arbitration Rules. Arbitration will take place remotely (by
          document submission, phone, or video conference) unless you and MLO Prep
          agree otherwise, and each party will bear its own arbitration costs except as
          the AAA rules or applicable law otherwise provide.
        </p>
        <p className={BODY_CLASS}>
          <strong className="text-navy-800">Class action waiver.</strong>{" "}
          You and MLO
          Prep agree that any arbitration or proceeding will be conducted only on an
          individual basis and not as a class, consolidated, or representative action.
          The arbitrator may not consolidate more than one person&apos;s claims and may
          not otherwise preside over any form of a class or representative proceeding.
        </p>
        <p className={BODY_CLASS}>
          <strong className="text-navy-800">Your right to opt out.</strong> You may opt
          out of this arbitration agreement by emailing{" "}
          <a href="mailto:jaden.lz21a@gmail.com" className="text-brand-600 underline">
            jaden.lz21a@gmail.com
          </a>{" "}
          within 30 days of first agreeing to these Terms, stating your name and that
          you opt out of arbitration. If you opt out, neither you nor MLO Prep will be
          required to arbitrate disputes with the other.
        </p>
        <p className={BODY_CLASS}>
          <strong className="text-navy-800">Exceptions.</strong> Notwithstanding the
          above, either party may bring an individual claim in small claims court, and
          either party may seek injunctive or other equitable relief in court to
          protect intellectual property rights.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>6. Governing law</h2>
        <p className={BODY_CLASS}>
          These Terms are governed by the laws of the United States and the state in
          which MLO Prep operates, without regard to conflict-of-law principles,
          except where the Federal Arbitration Act governs the arbitration agreement
          in Section 5.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>7. Changes to these Terms</h2>
        <p className={BODY_CLASS}>
          We may update these Terms from time to time. If we make material changes,
          we will update the &quot;Last updated&quot; date above. Continued use of the
          Service after changes take effect constitutes acceptance of the updated
          Terms.
        </p>
      </div>

      <div className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>8. Contact</h2>
        <p className={BODY_CLASS}>
          Questions about these Terms, including the arbitration agreement, can be
          sent to{" "}
          <a href="mailto:jaden.lz21a@gmail.com" className="text-brand-600 underline">
            jaden.lz21a@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
