import { CATEGORIES } from "@/lib/categories";

const MS_PER_DAY = 86400000;
const MAX_WEEKS = 12;

// Parses a "YYYY-MM-DD" input value as a local calendar date, avoiding the
// off-by-one shift you get from `new Date("YYYY-MM-DD")` parsing it as UTC.
export function parseDateOnly(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Categories with no data yet or below-target accuracy get more sessions than
// their raw exam weight alone would suggest.
function priorityScore(category, stat) {
  const accuracy = stat?.accuracy;
  const weaknessMultiplier =
    accuracy === null || accuracy === undefined ? 1.3 : 1 + Math.max(0, 75 - accuracy) / 100;
  return category.weight * weaknessMultiplier;
}

// Distributes `total` sessions across categories proportional to score,
// using the largest-remainder method so counts always add up exactly.
function allocateSessions(scores, total) {
  const raw = scores.map((s) => (total * s) / scores.reduce((sum, v) => sum + v, 0));
  const base = raw.map(Math.floor);
  let remaining = total - base.reduce((sum, n) => sum + n, 0);

  const remainders = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < remaining; i++) {
    base[remainders[i % remainders.length].index] += 1;
  }
  return base;
}

// Interleaves category sessions round-robin (highest priority first each
// pass) so the plan doesn't cluster many sessions of the same category together.
function interleave(items) {
  const remaining = items.map((item) => item.count);
  const order = items
    .map((_, i) => i)
    .sort((a, b) => items[b].score - items[a].score);

  const queue = [];
  let total = remaining.reduce((sum, n) => sum + n, 0);
  while (total > 0) {
    for (const i of order) {
      if (remaining[i] > 0) {
        queue.push(items[i]);
        remaining[i]--;
        total--;
      }
    }
  }
  return queue;
}

export function buildStudyPlan({ examDate, daysPerWeek }, categoryStats) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = parseDateOnly(examDate);
  exam.setHours(0, 0, 0, 0);

  const daysUntilExam = Math.max(0, Math.round((exam - today) / MS_PER_DAY));
  const weeksNeeded = Math.max(1, Math.ceil(daysUntilExam / 7) || 1);
  const numWeeks = Math.min(MAX_WEEKS, weeksNeeded);
  const totalPracticeSessions = numWeeks * daysPerWeek;

  const items = CATEGORIES.map((category) => {
    const stat = categoryStats.find((s) => s.id === category.id);
    return { id: category.id, name: category.name, score: priorityScore(category, stat) };
  });
  const counts = allocateSessions(
    items.map((i) => i.score),
    totalPracticeSessions
  );
  const withCounts = items.map((item, i) => ({ ...item, count: counts[i] }));
  const queue = interleave(withCounts);

  const weeks = [];
  let cursor = 0;
  for (let w = 1; w <= numWeeks; w++) {
    const sessions = [];
    for (let d = 0; d < daysPerWeek; d++) {
      const item = queue[cursor++];
      sessions.push({ type: "practice", categoryId: item.id, categoryName: item.name });
    }
    sessions.push({ type: "exam" });
    weeks.push({ week: w, sessions });
  }

  return {
    weeks,
    daysUntilExam,
    truncated: weeksNeeded > numWeeks,
  };
}
