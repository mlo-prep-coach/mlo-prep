"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, CheckCircle2, Loader2 } from "lucide-react";

const FEATURES = [
  "Full mock exams with a real 190-minute countdown",
  "All practice categories and flashcard decks",
  "Personalized study plan and daily missions",
  "Progress tracking, streaks, XP, and achievements",
];

const CALLBACK_ERRORS = {
  incomplete: "That checkout didn't complete. No charge was made — try again whenever you're ready.",
  missing_session: "Something went wrong starting checkout. Please try again.",
};

function CallbackErrorBanner() {
  const searchParams = useSearchParams();
  const callbackError = CALLBACK_ERRORS[searchParams.get("error")];
  if (!callbackError) return null;
  return (
    <p className="rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">
      {callbackError}
    </p>
  );
}

export default function UpgradePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [restoreError, setRestoreError] = useState("");

  async function handleRestore(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setRestoreError("");

    try {
      const res = await fetch("/api/restore-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setRestoreError(data.error || "Something went wrong.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setStatus("error");
      setRestoreError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-white shadow-lg">
          <GraduationCap size={26} strokeWidth={2.25} />
        </span>
        <h1 className="font-display text-2xl font-bold text-navy-900">Unlock MLO Prep</h1>
        <p className="text-sm text-navy-500">
          Get full access to every practice question, mock exam, and study tool.
        </p>
      </div>

      <Suspense fallback={null}>
        <CallbackErrorBanner />
      </Suspense>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative">
          <p className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-extrabold">$9.99</span>
            <span className="text-sm text-navy-200">/ month</span>
          </p>
          <p className="mt-1 text-sm text-navy-200">Cancel anytime</p>

          <ul className="mt-5 flex flex-col gap-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-navy-50">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                {f}
              </li>
            ))}
          </ul>

          <form action="/api/checkout" method="POST">
            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-navy-900 shadow-sm transition hover:bg-brand-50"
            >
              Subscribe Now
            </button>
          </form>
          <p className="mt-3 text-center text-xs text-navy-300">
            By subscribing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-navy-100">
              Terms of Service
            </Link>
            , including binding arbitration.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
        <p className="mb-3 text-center text-sm font-semibold text-navy-700">
          Already subscribed?
        </p>
        <form onSubmit={handleRestore} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm text-navy-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 rounded-xl border border-navy-200 px-4 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50 disabled:opacity-50"
          >
            {status === "loading" && <Loader2 size={15} className="animate-spin" />}
            Restore Access
          </button>
          {status === "error" && (
            <p className="text-center text-sm text-red-600">{restoreError}</p>
          )}
        </form>
      </div>
    </div>
  );
}
