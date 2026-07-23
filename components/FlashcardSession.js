"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCw, ThumbsDown, ThumbsUp, PartyPopper, ArrowRight, Sparkles } from "lucide-react";
import { shuffle } from "@/lib/exam";
import { recordFlashcardResult } from "@/lib/storage";
import ProgressBar from "@/components/ProgressBar";

export default function FlashcardSession({ questions: inputQuestions, title, backHref, limit }) {
  const [questions] = useState(() => {
    const shuffled = shuffle(inputQuestions);
    return limit ? shuffled.slice(0, limit) : shuffled;
  });
  const isPreview = !!limit && inputQuestions.length > limit;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState([]);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-navy-600">No cards available for this deck.</p>
        <Link href={backHref} className="text-brand-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  const isComplete = index >= questions.length;

  if (isComplete) {
    const knownCount = results.filter((r) => r.known).length;
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-navy-100 bg-white p-7 text-center shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
          <PartyPopper size={26} />
        </span>
        <h1 className="font-display text-xl font-bold text-navy-900">Deck Complete</h1>
        <p className="text-navy-600">
          You reviewed {results.length} card{results.length === 1 ? "" : "s"} —{" "}
          <span className="font-semibold text-emerald-600">{knownCount} known</span>,{" "}
          <span className="font-semibold text-amber-600">
            {results.length - knownCount} still learning
          </span>
          .
        </p>

        {isPreview && (
          <Link
            href="/upgrade"
            className="flex w-full items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
              <Sparkles size={18} strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-navy-900">
                That&apos;s just a {limit}-card taste of this deck
              </p>
              <p className="text-sm text-navy-500">Subscribe to unlock every flashcard deck</p>
            </div>
            <ArrowRight size={18} className="shrink-0 text-brand-600" />
          </Link>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setResults([]);
              setFlipped(false);
            }}
            className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
          >
            Review Again
          </button>
          <Link
            href={backHref}
            className="rounded-xl border border-navy-200 px-5 py-2.5 text-sm font-bold text-navy-700 hover:bg-navy-50"
          >
            Done
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[index];

  function handleResult(known) {
    recordFlashcardResult(question.id, known);
    setResults((prev) => [...prev, { questionId: question.id, known }]);
    setIndex((i) => i + 1);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-navy-900">{title}</h1>
          <p className="text-sm font-medium text-navy-500">
            {index + 1} / {questions.length}
          </p>
        </div>
        <ProgressBar value={(index / questions.length) * 100} />
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="group [perspective:1200px]"
        style={{ minHeight: 240 }}
      >
        <div
          className="relative h-full min-h-[240px] w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-navy-100 bg-white p-6 text-left shadow-[0_1px_2px_rgba(13,27,56,0.04)] [backface-visibility:hidden]"
          >
            <p className="font-display text-base font-semibold leading-snug text-navy-900">
              {question.question}
            </p>
            <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-navy-400">
              <RotateCw size={14} /> Tap to reveal answer
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-left shadow-[0_1px_2px_rgba(13,27,56,0.04)] [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="font-display font-bold text-emerald-700">
              {question.choices[question.correctIndex]}
            </p>
            <p className="text-sm text-navy-700">{question.explanation}</p>
          </div>
        </div>
      </button>

      {flipped && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleResult(false)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100"
          >
            <ThumbsDown size={15} /> Still Learning
          </button>
          <button
            type="button"
            onClick={() => handleResult(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-400 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
          >
            <ThumbsUp size={15} /> Got It
          </button>
        </div>
      )}
    </div>
  );
}
