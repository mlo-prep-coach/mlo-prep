"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookmarks } from "@/lib/storage";
import { getQuestionById } from "@/lib/questions";
import FlashcardSession from "@/components/FlashcardSession";

export default function BookmarkedFlashcardsPage() {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const bookmarks = getBookmarks();
    const resolved = bookmarks.map((b) => getQuestionById(b.questionId)).filter(Boolean);
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestions(resolved);
  }, []);

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

  return (
    <FlashcardSession questions={questions} title="Bookmarked Questions" backHref="/flashcards" />
  );
}
