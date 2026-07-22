import { CATEGORIES } from "@/lib/categories";
import { getQuestionsByCategory } from "@/lib/questions";

export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Largest-remainder method so the per-category counts always add up to exactly `total`.
function weightedCounts(total) {
  const raw = CATEGORIES.map((c) => (total * c.weight) / 100);
  const base = raw.map(Math.floor);
  let remaining = total - base.reduce((sum, n) => sum + n, 0);

  const remainders = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < remaining; i++) {
    base[remainders[i % remainders.length].index] += 1;
  }

  return CATEGORIES.reduce((map, category, index) => {
    map[category.id] = base[index];
    return map;
  }, {});
}

// Picks `count` questions from `pool`, repeating (in shuffled batches) if the
// placeholder question bank is smaller than the category's exam quota.
function pickWithRepeats(pool, count) {
  if (pool.length === 0) return [];
  const picked = [];
  while (picked.length < count) {
    const remaining = count - picked.length;
    const batch = shuffle(pool).slice(0, Math.min(remaining, pool.length));
    picked.push(...batch);
  }
  return picked;
}

export function buildMockExam(total = 120) {
  const counts = weightedCounts(total);
  const questions = CATEGORIES.flatMap((category) =>
    pickWithRepeats(getQuestionsByCategory(category.id), counts[category.id])
  );
  return shuffle(questions);
}
