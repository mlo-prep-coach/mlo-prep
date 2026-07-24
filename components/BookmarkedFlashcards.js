"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getBookmarks,
  getIsClientSnapshot,
  getIsClientServerSnapshot,
  subscribeToNothing,
} from "@/lib/storage";
import { getQuestionById } from "@/lib/questions";
import { pickDailySubset } from "@/lib/dailyLimit";
import FlashcardSession from "@/components/FlashcardSession";

export default function BookmarkedFlashcards({ dailyLimit }) {
  // Reads localStorage synchronously on the client's first render instead of
  // waiting for a post-mount effect to escape an initial null render.
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    getIsClientSnapshot,
    getIsClientServerSnapshot
  );
  const allQuestions = useMemo(() => {
    if (!isClient) return null;
    return getBookmarks().map((b) => getQuestionById(b.questionId)).filter(Boolean);
  }, [isClient]);

  const questions = useMemo(() => {
    if (!allQuestions) return null;
    return dailyLimit ? pickDailySubset(allQuestions, dailyLimit, "flashcards:bookmarked") : allQuestions;
  }, [allQuestions, dailyLimit]);

  if (questions === null) return null;

  if (questions.length === 0) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-navy-600">
          No bookmarked questions yet. Star a question during practice to add it here.
        </p>
        <Link href="/flashcards" className="text-brand-600 hover:underline">
          ← Back to flashcards
        </Link>
      </div>
    );
  }

  const isPreview = !!dailyLimit && allQuestions.length > dailyLimit;

  return (
    <FlashcardSession
      questions={questions}
      title="Bookmarked Questions"
      backHref="/flashcards"
      isPreview={isPreview}
      previewLimit={dailyLimit}
    />
  );
}
