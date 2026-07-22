"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, XCircle, Zap, ListFilter, Home, TrendingUp } from "lucide-react";
import { getLastSession } from "@/lib/storage";
import { getCategory, CATEGORIES } from "@/lib/categories";
import { computeXP } from "@/lib/gamification";
import QuestionCard from "@/components/QuestionCard";
import ScoreRing from "@/components/ScoreRing";
import ProgressBar from "@/components/ProgressBar";

const PASS_THRESHOLD = 75;

export default function ResultsPage() {
  const [session, setSession] = useState(undefined);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(getLastSession());
  }, []);

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return (
      <div className="text-center">
        <p className="text-navy-600">No recent session found.</p>
        <Link href="/" className="mt-3 inline-block text-brand-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const percent = session.total > 0 ? Math.round((session.score / session.total) * 100) : 0;
  const missed = session.answers.filter((a) => !a.correct);
  const visibleAnswers = filter === "missed" ? missed : session.answers;
  const category = session.category ? getCategory(session.category) : null;
  const isExam = session.mode === "exam";
  const passed = isExam && percent >= PASS_THRESHOLD;
  const xpEarned = computeXP([session]);

  const categoryBreakdown = CATEGORIES.map((cat) => {
    const catAnswers = session.answers.filter((a) => a.category === cat.id);
    const correct = catAnswers.filter((a) => a.correct).length;
    return {
      ...cat,
      correct,
      total: catAnswers.length,
      percent: catAnswers.length > 0 ? Math.round((correct / catAnswers.length) * 100) : null,
    };
  }).filter((c) => c.total > 0);
  const showBreakdown = categoryBreakdown.length > 1;

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 p-6 text-center text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-semibold text-brand-200">
            {isExam ? "Full Mock Exam" : session.label || category?.name || "Practice Session"}
          </p>

          <div className="mt-4 flex justify-center">
            <ScoreRing percent={percent} />
          </div>

          <p className="mt-3 text-sm text-navy-100">
            {session.score} of {session.total} correct
          </p>

          {isExam && (
            <p
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${
                passed ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/20 text-red-300"
              }`}
            >
              {passed ? <Trophy size={15} /> : <XCircle size={15} />}
              {passed ? "Pass" : "Fail"} — {PASS_THRESHOLD}% required
            </p>
          )}

          <div className="mx-auto mt-5 flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-brand-100">
            <Zap size={14} className="text-amber-300" />+{xpEarned} XP earned
          </div>
        </div>
      </section>

      {showBreakdown && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-navy-900">
            Breakdown by Category
          </h2>
          <div className="flex flex-col gap-3">
            {categoryBreakdown.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
                >
                  <div className="mb-2.5 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      {Icon && <Icon size={16} strokeWidth={2.25} />}
                    </span>
                    <p className="flex-1 truncate font-semibold text-navy-900">{cat.name}</p>
                    <p
                      className={`shrink-0 text-sm font-bold ${
                        cat.percent >= 75 ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {cat.correct}/{cat.total} ({cat.percent}%)
                    </p>
                  </div>
                  <ProgressBar value={cat.percent} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex items-center gap-2">
        <ListFilter size={16} className="text-navy-400" />
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            filter === "all"
              ? "bg-navy-900 text-white"
              : "border border-navy-200 text-navy-600 hover:bg-navy-50"
          }`}
        >
          All ({session.answers.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("missed")}
          disabled={missed.length === 0}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition disabled:opacity-40 ${
            filter === "missed"
              ? "bg-navy-900 text-white"
              : "border border-navy-200 text-navy-600 hover:bg-navy-50"
          }`}
        >
          Missed only ({missed.length})
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {visibleAnswers.map((answer, i) => (
          <QuestionCard
            key={`${answer.questionId}-${i}`}
            question={answer}
            selectedIndex={answer.selectedIndex}
            onSelect={() => {}}
            showFeedback
          />
        ))}
      </div>

      <div className="flex justify-center gap-6 text-sm font-semibold">
        <Link href="/" className="flex items-center gap-1.5 text-brand-600 hover:underline">
          <Home size={15} /> Home
        </Link>
        <Link href="/progress" className="flex items-center gap-1.5 text-brand-600 hover:underline">
          <TrendingUp size={15} /> View progress
        </Link>
      </div>
    </div>
  );
}
