"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Trophy, Pencil, ArrowRight } from "lucide-react";
import {
  getStudyPlanSettings,
  saveStudyPlanSettings,
  getCategoryStats,
  getProfile,
  saveProfile,
} from "@/lib/storage";
import { buildStudyPlan, parseDateOnly } from "@/lib/studyPlan";
import { getCategory } from "@/lib/categories";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function StudyPlanPage() {
  const [settings, setSettings] = useState(undefined);
  const [examDateInput, setExamDateInput] = useState("");
  const [daysPerWeekInput, setDaysPerWeekInput] = useState(5);

  useEffect(() => {
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    const existing = getStudyPlanSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(existing);
    const profileExamDate = getProfile()?.examDate;
    if (!existing && profileExamDate) {
      setExamDateInput(profileExamDate);
    }
  }, []);

  if (settings === undefined) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!examDateInput) return;
    const next = { examDate: examDateInput, daysPerWeek: Number(daysPerWeekInput) };
    saveStudyPlanSettings(next);
    setSettings(next);

    // Keep the profile's exam date (used for the dashboard countdown) in sync.
    const profile = getProfile();
    if (profile) saveProfile({ ...profile, examDate: examDateInput });
  }

  if (!settings) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
            <CalendarCheck size={20} strokeWidth={2.25} />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-navy-900">Build Your Study Plan</h1>
            <p className="text-sm text-navy-500">A schedule tailored to your exam date</p>
          </div>
        </div>

        <p className="text-sm text-navy-600">
          Tell us your exam date and how many days a week you can study. We&apos;ll build a plan
          weighted toward your weakest categories and the real exam percentages.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
        >
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy-700">
            Exam date
            <input
              type="date"
              required
              min={todayISO()}
              value={examDateInput}
              onChange={(e) => setExamDateInput(e.target.value)}
              className="rounded-xl border border-navy-200 px-3 py-2.5 text-navy-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-navy-700">
            Study days per week
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeekInput}
              onChange={(e) => setDaysPerWeekInput(e.target.value)}
              className="rounded-xl border border-navy-200 px-3 py-2.5 text-navy-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800"
          >
            Generate Plan <ArrowRight size={16} />
          </button>
        </form>

        <Link href="/" className="text-center text-sm font-medium text-brand-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const { weeks, daysUntilExam, truncated } = buildStudyPlan(settings, getCategoryStats());

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-200">Your Study Plan</p>
            <p className="mt-1 font-display text-2xl font-extrabold">
              {daysUntilExam > 0 ? `${daysUntilExam} days to go` : "Exam day is here!"}
            </p>
            <p className="mt-1 text-sm text-navy-200">
              Exam on {parseDateOnly(settings.examDate).toLocaleDateString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettings(null)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20"
          >
            <Pencil size={12} /> Edit
          </button>
        </div>
      </section>

      <div className="flex flex-col gap-6">
        {weeks.map((week) => (
          <div key={week.week}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">
              Week {week.week}
            </h2>
            <div className="relative flex flex-col gap-2.5 border-l-2 border-navy-100 pl-5">
              {week.sessions.map((session, i) => {
                if (session.type === "exam") {
                  return (
                    <Link
                      key={i}
                      href="/exam"
                      className="relative flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                    >
                      <span className="absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-[#f6f8fc]" />
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
                        <Trophy size={15} />
                      </span>
                      <span className="font-semibold text-emerald-800">Full Mock Exam</span>
                    </Link>
                  );
                }
                const Icon = getCategory(session.categoryId)?.icon;
                return (
                  <Link
                    key={i}
                    href={`/practice/${session.categoryId}`}
                    className="relative flex items-center gap-3 rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
                  >
                    <span className="absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 ring-4 ring-[#f6f8fc]" />
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      {Icon && <Icon size={15} strokeWidth={2.25} />}
                    </span>
                    <span className="font-semibold text-navy-800">
                      Practice — {session.categoryName}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {truncated && (
        <p className="text-center text-sm text-navy-400">
          Showing the first {weeks.length} weeks. Keep this same weekly rhythm going until your
          exam date.
        </p>
      )}

      <Link href="/" className="text-center text-sm font-medium text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
