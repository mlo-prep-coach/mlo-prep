"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  ArrowRight,
  Layers,
  CalendarCheck,
  Bookmark,
  TrendingUp,
  Target,
  CheckCircle2,
  History,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { getHistory, getCategoryStats, getBookmarks, getProfile } from "@/lib/storage";
import { computeStreak, computeXP, computeLevel, getAchievements } from "@/lib/gamification";
import {
  getDailyMission,
  getWeakCategories,
  getRecentActivity,
  formatRelativeTime,
} from "@/lib/dashboard";
import { parseDateOnly } from "@/lib/studyPlan";
import CategoryCard from "@/components/CategoryCard";
import ScoreRing from "@/components/ScoreRing";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(undefined);
  const [data, setData] = useState(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace("/onboarding");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      return;
    }

    const history = getHistory();
    const bookmarks = getBookmarks();
    const stats = getCategoryStats();
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    setProfile(p);
    setData({
      stats,
      history,
      streak: computeStreak(history),
      xp: computeXP(history),
      achievements: getAchievements(history, bookmarks),
      totalAnswered: stats.reduce((sum, s) => sum + s.total, 0),
      totalCorrect: stats.reduce((sum, s) => sum + s.correct, 0),
    });
  }, [router]);

  if (!profile || !data) return null;

  const level = computeLevel(data.xp);
  const overallAccuracy =
    data.totalAnswered > 0 ? Math.round((data.totalCorrect / data.totalAnswered) * 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = parseDateOnly(profile.examDate);
  examDate.setHours(0, 0, 0, 0);
  const daysUntilExam = Math.max(0, Math.round((examDate - today) / 86400000));

  const mission = getDailyMission(data.stats, profile.studyHoursPerDay, data.history);
  const weakCategories = getWeakCategories(data.stats, 2);
  const recentActivity = getRecentActivity(data.history, 4);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      {/* Hero */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 p-6 text-white shadow-lg sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-400/10 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-medium text-brand-200">
            {getGreeting()}, {profile.firstName}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {daysUntilExam > 0 ? `${daysUntilExam} days until your exam` : "Exam day is here!"}
          </h1>
          <p className="mt-2 max-w-md text-sm text-navy-100">
            {daysUntilExam > 0
              ? "Keep your streak alive and chip away at your weak spots before test day."
              : "You've got this. Good luck out there!"}
          </p>

          <Link
            href="/exam"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-navy-900 shadow-sm transition hover:bg-brand-50"
          >
            Start Full Mock Exam
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </motion.section>

      {/* Progress rings */}
      <motion.section variants={item} className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
          <ScoreRing
            percent={overallAccuracy}
            size={72}
            strokeWidth={7}
            variant="light"
            color={data.totalAnswered === 0 ? "#b0c1e0" : undefined}
            label={data.totalAnswered === 0 ? "—" : undefined}
          />
          <p className="text-center text-xs font-semibold text-navy-500">Exam readiness</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
          <ScoreRing
            percent={(level.xpIntoLevel / level.xpForNextLevel) * 100}
            size={72}
            strokeWidth={7}
            variant="light"
            color="#3466f6"
            label={`L${level.level}`}
          />
          <p className="text-center text-xs font-semibold text-navy-500">{level.title}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-orange-50">
            <Flame size={30} className="text-orange-400" />
          </span>
          <p className="text-center text-xs font-semibold text-navy-500">
            {data.streak}-day streak
          </p>
        </div>
      </motion.section>

      {/* Daily mission */}
      <motion.section variants={item}>
        <Link
          href={`/practice/${mission.categoryId}`}
          className={`flex items-center gap-4 rounded-2xl border p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)] transition hover:-translate-y-0.5 ${
            mission.completed
              ? "border-emerald-200 bg-emerald-50"
              : "border-brand-200 bg-brand-50/60"
          }`}
        >
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${
              mission.completed ? "bg-emerald-500" : "bg-gradient-to-br from-navy-900 to-brand-600"
            }`}
          >
            {mission.completed ? <CheckCircle2 size={22} /> : <Target size={22} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
              {mission.completed ? "Mission complete" : "Today's mission"}
            </p>
            <p className="mt-0.5 truncate font-display font-semibold text-navy-900">
              Practice {mission.targetCount} questions in {mission.categoryName}
            </p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-navy-300" />
        </Link>
      </motion.section>

      {/* Weak topics */}
      {weakCategories.length > 0 && (
        <motion.section variants={item}>
          <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Recommended Focus</h2>
          <div className="flex flex-col gap-2.5">
            {weakCategories.map((c) => (
              <Link
                key={c.id}
                href={`/practice/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-white">
                    {c.icon && <c.icon size={16} strokeWidth={2.25} />}
                  </span>
                  <p className="font-semibold text-amber-900">{c.name}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-amber-700">{c.accuracy}%</span>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* Quick actions */}
      <motion.section variants={item} className="grid grid-cols-3 gap-3">
        <Link
          href="/flashcards"
          className="flex flex-col items-center gap-2 rounded-2xl border border-navy-100 bg-white p-4 text-center shadow-[0_1px_2px_rgba(13,27,56,0.04)] transition hover:-translate-y-0.5 hover:border-brand-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Layers size={18} strokeWidth={2.25} />
          </span>
          <p className="text-sm font-semibold text-navy-900">Flashcards</p>
        </Link>
        <Link
          href="/study-plan"
          className="flex flex-col items-center gap-2 rounded-2xl border border-navy-100 bg-white p-4 text-center shadow-[0_1px_2px_rgba(13,27,56,0.04)] transition hover:-translate-y-0.5 hover:border-brand-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <CalendarCheck size={18} strokeWidth={2.25} />
          </span>
          <p className="text-sm font-semibold text-navy-900">Study Plan</p>
        </Link>
        <Link
          href="/bookmarks"
          className="flex flex-col items-center gap-2 rounded-2xl border border-navy-100 bg-white p-4 text-center shadow-[0_1px_2px_rgba(13,27,56,0.04)] transition hover:-translate-y-0.5 hover:border-brand-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Bookmark size={18} strokeWidth={2.25} />
          </span>
          <p className="text-sm font-semibold text-navy-900">Bookmarks</p>
        </Link>
      </motion.section>

      {/* Categories */}
      <motion.section variants={item}>
        <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Practice by Category</h2>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              href={`/practice/${category.id}`}
              accuracy={data.stats.find((s) => s.id === category.id)?.accuracy}
            />
          ))}
        </div>
      </motion.section>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <motion.section variants={item}>
          <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Recent Activity</h2>
          <div className="flex flex-col gap-2">
            {recentActivity.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(13,27,56,0.04)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-500">
                    <History size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      {session.mode === "exam" ? "Full Mock Exam" : session.label || "Practice Session"}
                    </p>
                    <p className="text-xs text-navy-400">{formatRelativeTime(session.timestamp)}</p>
                  </div>
                </div>
                <p
                  className={`text-sm font-bold ${
                    session.percent >= 75 ? "text-emerald-600" : "text-navy-700"
                  }`}
                >
                  {session.percent}%
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Achievements preview */}
      <motion.section variants={item}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy-900">Achievements</h2>
          <Link
            href="/progress"
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {data.achievements.map((a) => (
            <div
              key={a.id}
              title={a.description}
              className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  a.unlocked
                    ? "bg-gradient-to-br from-navy-800 to-brand-600 text-white"
                    : "bg-navy-50 text-navy-300"
                }`}
              >
                <a.icon size={22} strokeWidth={2} />
              </span>
              <p
                className={`text-[11px] font-medium leading-tight ${
                  a.unlocked ? "text-navy-700" : "text-navy-300"
                }`}
              >
                {a.name}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={item} className="text-center">
        <Link
          href="/progress"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
        >
          <TrendingUp size={15} /> View my full progress
        </Link>
      </motion.section>
    </motion.div>
  );
}
