"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CATEGORIES, FREE_CATEGORY_ID, getCategory } from "@/lib/categories";
import CategoryCard from "@/components/CategoryCard";

const PRO_FEATURES = [
  "Full mock exams with a real 190-minute countdown",
  "All 5 practice categories and flashcard decks",
  "Personalized study plan and daily missions",
  "Progress tracking, streaks, XP, and achievements",
];

export default function FreeHome() {
  const freeCategory = getCategory(FREE_CATEGORY_ID);

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-200">Free preview</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Try {freeCategory?.name} free
          </h1>
          <p className="mt-2 max-w-md text-sm text-navy-100">
            10 new practice questions every day, with instant feedback and explanations — no
            signup required. Subscribe to unlock every category, full mock exams, and more.
          </p>
          <Link
            href={`/practice/${FREE_CATEGORY_ID}`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-navy-900 shadow-sm transition hover:bg-brand-50"
          >
            Start Free Practice
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Categories</h2>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              href={category.id === FREE_CATEGORY_ID ? `/practice/${category.id}` : "/upgrade"}
              locked={category.id !== FREE_CATEGORY_ID}
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative">
          <p className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-extrabold">$9.99</span>
            <span className="text-sm text-navy-200">/ month</span>
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-navy-50">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/upgrade"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-navy-900 shadow-sm transition hover:bg-brand-50"
          >
            Unlock Full Access
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
