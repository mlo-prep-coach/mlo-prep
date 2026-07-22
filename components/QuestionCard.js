"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Star } from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/lib/storage";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({ question, selectedIndex, onSelect, showFeedback }) {
  const answered = selectedIndex !== null && selectedIndex !== undefined;
  const questionId = question.id ?? question.questionId;
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookmarked(isBookmarked(questionId));
  }, [questionId]);

  function handleToggleBookmark() {
    const nowBookmarked = toggleBookmark(questionId, question.category);
    setBookmarked(nowBookmarked);
  }

  function choiceState(index) {
    if (!showFeedback || !answered) {
      return selectedIndex === index ? "selected" : "default";
    }
    if (index === question.correctIndex) return "correct";
    if (index === selectedIndex) return "incorrect";
    return "faded";
  }

  const stateClasses = {
    default:
      "border-navy-100 bg-white hover:border-brand-300 hover:bg-brand-50/40",
    selected: "border-brand-500 bg-brand-50 ring-1 ring-brand-500",
    correct: "border-emerald-500 bg-emerald-50",
    incorrect: "border-red-500 bg-red-50",
    faded: "border-navy-100 bg-white opacity-50",
  };

  const badgeClasses = {
    default: "border-navy-200 text-navy-500",
    selected: "border-brand-500 bg-brand-500 text-white",
    correct: "border-emerald-500 bg-emerald-500 text-white",
    incorrect: "border-red-500 bg-red-500 text-white",
    faded: "border-navy-200 text-navy-400",
  };

  const isCorrectAnswer = answered && selectedIndex === question.correctIndex;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="font-display text-[15px] font-semibold leading-snug text-navy-900">
          {question.question}
        </p>
        <button
          type="button"
          onClick={handleToggleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this question"}
          title={bookmarked ? "Remove bookmark" : "Bookmark this question"}
          className={`shrink-0 rounded-lg p-1 transition ${
            bookmarked ? "text-amber-400" : "text-navy-200 hover:text-amber-400"
          }`}
        >
          <Star size={20} fill={bookmarked ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {question.choices.map((choice, index) => {
          const state = choiceState(index);
          return (
            <button
              key={index}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium text-navy-800 transition ${stateClasses[state]}`}
              onClick={() => onSelect(index)}
              disabled={showFeedback && answered}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${badgeClasses[state]}`}
              >
                {LETTERS[index]}
              </span>
              {choice}
            </button>
          );
        })}
      </div>

      {showFeedback && answered && (
        <div
          className={`mt-4 flex items-start gap-2.5 rounded-xl p-3.5 text-sm ${
            isCorrectAnswer ? "bg-emerald-50" : "bg-red-50"
          }`}
        >
          {isCorrectAnswer ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
          ) : (
            <XCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
          )}
          <div>
            <p className={`mb-1 font-semibold ${isCorrectAnswer ? "text-emerald-700" : "text-red-700"}`}>
              {isCorrectAnswer ? "Correct!" : "Incorrect"}
            </p>
            <p className="text-navy-700">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
