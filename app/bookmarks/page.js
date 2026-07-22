"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, PlayCircle } from "lucide-react";
import { getBookmarks } from "@/lib/storage";
import { getQuestionById } from "@/lib/questions";
import { getCategory } from "@/lib/categories";
import PracticeSession from "@/components/PracticeSession";

export default function BookmarksPage() {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(null);
  const [practicing, setPracticing] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    const questions = bookmarks
      .map((b) => getQuestionById(b.questionId))
      .filter(Boolean);
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookmarkedQuestions(questions);
  }, []);

  if (bookmarkedQuestions === null) return null;

  if (practicing) {
    return (
      <PracticeSession
        questions={bookmarkedQuestions}
        title="Bookmarked Questions"
        sessionCategory={null}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
          <Star size={20} strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold text-navy-900">Bookmarked Questions</h1>
          <p className="text-sm text-navy-500">Your saved questions for focused review</p>
        </div>
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <p className="text-navy-600">
          No bookmarked questions yet. Tap the star on any question during practice or in your
          results review to save it here for focused study.
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setPracticing(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800"
          >
            <PlayCircle size={17} />
            Practice {bookmarkedQuestions.length} Bookmarked Question
            {bookmarkedQuestions.length === 1 ? "" : "s"}
          </button>

          <div className="flex flex-col gap-2">
            {bookmarkedQuestions.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {getCategory(q.category)?.shortName}
                </p>
                <p className="mt-1 text-sm font-medium text-navy-900">{q.question}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <Link href="/" className="text-center text-sm font-medium text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
