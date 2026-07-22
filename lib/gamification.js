import { Footprints, Sparkles, Trophy, Flame, Award, Layers, Bookmark } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const XP_PER_LEVEL = 500;
const PASS_THRESHOLD = 0.75;

function dayKey(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Consecutive-day streak derived from session timestamps already in history —
// no separate streak tracking is stored. A streak stays "alive" through the
// end of today even if today hasn't been studied yet, as long as yesterday was.
export function computeStreak(history) {
  if (history.length === 0) return 0;
  const days = new Set(history.map((s) => dayKey(s.timestamp)));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function keyForOffset(offsetDays) {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }

  let startOffset;
  if (days.has(keyForOffset(0))) startOffset = 0;
  else if (days.has(keyForOffset(1))) startOffset = 1;
  else return 0;

  let streak = 0;
  let offset = startOffset;
  while (days.has(keyForOffset(offset))) {
    streak++;
    offset++;
  }
  return streak;
}

// XP derived from existing session results: 10 per correct answer, a 25 XP
// completion bonus per session, and a 150 XP bonus for full mock exams.
export function computeXP(history) {
  let xp = 0;
  for (const session of history) {
    const correct = session.answers.filter((a) => a.correct).length;
    xp += correct * 10 + 25;
    if (session.mode === "exam") xp += 150;
  }
  return xp;
}

const LEVEL_TITLES = [
  { min: 1, title: "New Originator" },
  { min: 3, title: "Rising Originator" },
  { min: 6, title: "Seasoned Originator" },
  { min: 10, title: "Licensing Pro" },
  { min: 15, title: "SAFE Act Master" },
];

export function computeLevel(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const title = [...LEVEL_TITLES].reverse().find((t) => level >= t.min)?.title ?? "New Originator";
  return { level, xpIntoLevel, xpForNextLevel: XP_PER_LEVEL, title };
}

export const ACHIEVEMENTS = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first practice session",
    icon: Footprints,
    check: (ctx) => ctx.history.length >= 1,
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Get 100% on any session",
    icon: Sparkles,
    check: (ctx) => ctx.hasPerfectSession,
  },
  {
    id: "century-club",
    name: "Century Club",
    description: "Answer 100 questions total",
    icon: Trophy,
    check: (ctx) => ctx.totalAnswered >= 100,
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Reach a 7-day study streak",
    icon: Flame,
    check: (ctx) => ctx.streak >= 7,
  },
  {
    id: "exam-ready",
    name: "Exam Ready",
    description: "Pass a full mock exam",
    icon: Award,
    check: (ctx) => ctx.hasPassedExam,
  },
  {
    id: "well-rounded",
    name: "Well Rounded",
    description: "Practice all 5 categories",
    icon: Layers,
    check: (ctx) => ctx.categoriesPracticed >= CATEGORIES.length,
  },
  {
    id: "curator",
    name: "Curator",
    description: "Bookmark 5 tricky questions",
    icon: Bookmark,
    check: (ctx) => ctx.bookmarkCount >= 5,
  },
];

export function getAchievements(history, bookmarks) {
  const totalAnswered = history.reduce((sum, s) => sum + s.total, 0);
  const hasPerfectSession = history.some((s) => s.total > 0 && s.score === s.total);
  const hasPassedExam = history.some(
    (s) => s.mode === "exam" && s.total > 0 && s.score / s.total >= PASS_THRESHOLD
  );
  const categoriesPracticed = new Set(
    history.flatMap((s) => s.answers.map((a) => a.category))
  ).size;

  const ctx = {
    history,
    totalAnswered,
    hasPerfectSession,
    hasPassedExam,
    categoriesPracticed,
    streak: computeStreak(history),
    bookmarkCount: bookmarks.length,
  };

  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(ctx) }));
}
