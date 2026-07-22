"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Zap, Trophy, Check, RotateCcw } from "lucide-react";
import { getCategoryStats, getHistory, getBookmarks, clearHistory } from "@/lib/storage";
import { computeStreak, computeXP, computeLevel, getAchievements } from "@/lib/gamification";
import ProgressBar from "@/components/ProgressBar";

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function loadProgressData() {
  const history = getHistory();
  const bookmarks = getBookmarks();
  return {
    stats: getCategoryStats(),
    history,
    streak: computeStreak(history),
    xp: computeXP(history),
    achievements: getAchievements(history, bookmarks),
  };
}

export default function ProgressPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadProgressData());
  }, []);

  function handleClear() {
    const ok = window.confirm("Clear all saved progress? This cannot be undone.");
    if (!ok) return;
    clearHistory();
    setData(loadProgressData());
  }

  if (!data) return null;

  const { stats, history, streak, xp, achievements } = data;
  const hasData = history.length > 0;
  const level = computeLevel(xp);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold text-navy-900">Your Progress</h1>

      {/* Level / streak hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-200">Level {level.level}</p>
            <p className="font-display text-xl font-extrabold">{level.title}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
            <Flame size={16} className="text-orange-300" />
            <span className="text-sm font-bold">{streak}</span>
          </div>
        </div>

        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-navy-200">
            <span className="flex items-center gap-1">
              <Zap size={12} className="text-amber-300" /> {xp} XP
            </span>
            <span>{level.xpIntoLevel} / {level.xpForNextLevel}</span>
          </div>
          <ProgressBar value={(level.xpIntoLevel / level.xpForNextLevel) * 100} />
        </div>
      </section>

      {!hasData ? (
        <p className="text-navy-600">
          No sessions yet. Complete a practice session or mock exam to start tracking your
          progress.
        </p>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-bold text-navy-900">Accuracy by Category</h2>
            {stats.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
                >
                  <div className="mb-2.5 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      {Icon && <Icon size={16} strokeWidth={2.25} />}
                    </span>
                    <p className="flex-1 truncate font-semibold text-navy-900">{category.name}</p>
                    <p className="shrink-0 text-sm font-bold text-navy-600">
                      {category.accuracy === null ? "—" : `${category.accuracy}%`}
                    </p>
                  </div>
                  <ProgressBar value={category.accuracy ?? 0} />
                  <p className="mt-1.5 text-xs text-navy-400">
                    {category.correct} / {category.total} answered correctly
                  </p>
                </div>
              );
            })}
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-lg font-bold text-navy-900">Achievements</h2>
              <span className="text-sm font-medium text-navy-400">
                {unlockedCount}/{achievements.length} unlocked
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                    a.unlocked
                      ? "border-brand-200 bg-brand-50/50"
                      : "border-navy-100 bg-white opacity-60"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      a.unlocked
                        ? "bg-gradient-to-br from-navy-800 to-brand-600 text-white"
                        : "bg-navy-50 text-navy-300"
                    }`}
                  >
                    {a.unlocked ? <Check size={18} /> : <a.icon size={18} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-900">{a.name}</p>
                    <p className="text-xs text-navy-400">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Session History</h2>
            <div className="flex flex-col gap-2">
              {[...history].reverse().map((session) => {
                const percent = Math.round((session.score / session.total) * 100);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-2xl border border-navy-100 bg-white px-4 py-3 text-sm shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
                  >
                    <div>
                      <p className="font-semibold text-navy-900">
                        {session.mode === "exam" ? "Full Mock Exam" : session.label || "Practice Session"}
                      </p>
                      <p className="text-navy-400">{formatDate(session.timestamp)}</p>
                    </div>
                    <p
                      className={`flex items-center gap-1 font-bold ${
                        percent >= 75 ? "text-emerald-600" : "text-navy-700"
                      }`}
                    >
                      {percent >= 75 && <Trophy size={14} />}
                      {session.score}/{session.total} ({percent}%)
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center gap-1.5 self-center text-sm font-medium text-navy-400 hover:text-red-600"
          >
            <RotateCcw size={14} /> Clear all progress
          </button>
        </>
      )}

      <Link href="/" className="text-center text-sm font-medium text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
