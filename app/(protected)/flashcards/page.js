"use client";

import Link from "next/link";
import { Star, ArrowRight, Layers } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import CategoryCard from "@/components/CategoryCard";

export default function FlashcardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
          <Layers size={20} strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold text-navy-900">Flashcards</h1>
          <p className="text-sm text-navy-500">
            Quick flip-card review, by category or bookmarks
          </p>
        </div>
      </div>

      <Link
        href="/flashcards/bookmarked"
        className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-white">
          <Star size={18} fill="currentColor" strokeWidth={1.5} />
        </span>
        <p className="flex-1 font-display font-semibold text-amber-800">
          Review Bookmarked Questions
        </p>
        <ArrowRight size={18} className="shrink-0 text-amber-700" />
      </Link>

      <div className="flex flex-col gap-3">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} href={`/flashcards/${category.id}`} />
        ))}
      </div>

      <Link href="/" className="text-center text-sm font-medium text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
