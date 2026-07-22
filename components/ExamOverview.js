"use client";

import { X } from "lucide-react";

export default function ExamOverview({ total, currentIndex, answers, markedForReview, onJump, onClose }) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-navy-950/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy-900">Question Overview</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-navy-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-brand-600" /> Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded border border-navy-200 bg-white" /> Unanswered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-white ring-2 ring-navy-900" /> Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative h-3.5 w-3.5 rounded border border-navy-200 bg-white">
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400" />
            </span>
            Marked for review
          </span>
        </div>

        <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
          {Array.from({ length: total }).map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = !!markedForReview[i];
            const isCurrent = i === currentIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onJump(i)}
                className={`relative flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition ${
                  isAnswered
                    ? "bg-brand-600 text-white"
                    : "border border-navy-200 bg-white text-navy-600 hover:border-brand-300"
                } ${isCurrent ? "ring-2 ring-navy-900 ring-offset-1" : ""}`}
              >
                {i + 1}
                {isMarked && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
