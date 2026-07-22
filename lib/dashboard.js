import { CATEGORIES } from "@/lib/categories";

function isToday(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// Maps daily study time to a question-count target, so the mission scales
// with how much time the user told onboarding they have.
function targetCountForHours(hours) {
  return Math.min(25, Math.max(5, Math.round((hours ?? 1) * 8)));
}

// Recommends today's focus category (weakest practiced, or the
// highest-weighted category if nothing has been practiced yet) and whether
// today's mission has already been satisfied by a completed session.
export function getDailyMission(stats, studyHoursPerDay, history) {
  const practiced = stats.filter((s) => s.total > 0);
  const target =
    practiced.length > 0
      ? [...practiced].sort((a, b) => a.accuracy - b.accuracy)[0]
      : CATEGORIES[0];

  const targetCount = targetCountForHours(studyHoursPerDay);
  const completed = history.some(
    (s) =>
      isToday(s.timestamp) &&
      (s.mode === "exam" ||
        s.category === target.id ||
        s.answers.some((a) => a.category === target.id))
  );

  return { categoryId: target.id, categoryName: target.name, targetCount, completed };
}

// Up to two weakest practiced categories, for the "recommended focus" list.
export function getWeakCategories(stats, limit = 2) {
  return [...stats]
    .filter((s) => s.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export function formatRelativeTime(timestamp) {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function getRecentActivity(history, limit = 4) {
  return [...history]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map((session) => ({
      ...session,
      percent: session.total > 0 ? Math.round((session.score / session.total) * 100) : 0,
    }));
}
