import { CATEGORIES } from "@/lib/categories";

const HISTORY_KEY = "mloprep-history";
const LAST_SESSION_KEY = "mloprep-last-session";
const BOOKMARKS_KEY = "mloprep-bookmarks";
const STUDY_PLAN_KEY = "mloprep-study-plan-settings";
const FLASHCARD_PROGRESS_KEY = "mloprep-flashcard-progress";
const PROFILE_KEY = "mloprep-profile";
const MAX_HISTORY = 50;

function isBrowser() {
  return typeof window !== "undefined";
}

function readJSON(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// session: { id, mode, category, timestamp, score, total, answers: [...] }
export function saveSession(session) {
  writeJSON(LAST_SESSION_KEY, session);

  const history = readJSON(HISTORY_KEY, []);
  history.push(session);
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
  writeJSON(HISTORY_KEY, history);
}

export function getLastSession() {
  return readJSON(LAST_SESSION_KEY, null);
}

export function getHistory() {
  return readJSON(HISTORY_KEY, []);
}

export function clearHistory() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(HISTORY_KEY);
  window.localStorage.removeItem(LAST_SESSION_KEY);
}

// Aggregates every answer across every stored session into per-category accuracy.
export function getCategoryStats() {
  const history = getHistory();
  const totals = Object.fromEntries(CATEGORIES.map((c) => [c.id, { correct: 0, total: 0 }]));

  for (const session of history) {
    for (const answer of session.answers) {
      if (!totals[answer.category]) continue;
      totals[answer.category].total += 1;
      if (answer.correct) totals[answer.category].correct += 1;
    }
  }

  return CATEGORIES.map((category) => {
    const { correct, total } = totals[category.id];
    return {
      ...category,
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
    };
  });
}

// --- Bookmarks: questions the user flags as difficult, for later focused review ---

export function getBookmarks() {
  return readJSON(BOOKMARKS_KEY, []);
}

export function isBookmarked(questionId) {
  return getBookmarks().some((b) => b.questionId === questionId);
}

export function toggleBookmark(questionId, category) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((b) => b.questionId === questionId);
  const next = exists
    ? bookmarks.filter((b) => b.questionId !== questionId)
    : [...bookmarks, { questionId, category, timestamp: Date.now() }];
  writeJSON(BOOKMARKS_KEY, next);
  return !exists;
}

// --- Study plan settings: target exam date + preferred study days per week ---

export function getStudyPlanSettings() {
  return readJSON(STUDY_PLAN_KEY, null);
}

export function saveStudyPlanSettings(settings) {
  writeJSON(STUDY_PLAN_KEY, settings);
}

export function clearStudyPlanSettings() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STUDY_PLAN_KEY);
}

// --- Flashcard self-assessment: tracks which cards the user says they still need to learn ---

export function getFlashcardProgress() {
  return readJSON(FLASHCARD_PROGRESS_KEY, {});
}

export function recordFlashcardResult(questionId, known) {
  const progress = getFlashcardProgress();
  progress[questionId] = { known, lastReviewed: Date.now() };
  writeJSON(FLASHCARD_PROGRESS_KEY, progress);
}

// --- Profile: local-only onboarding data (no accounts/auth yet). These are the
// only functions that touch PROFILE_KEY, so swapping localStorage for a real
// backend later only means changing the bodies of these three functions. ---

export function getProfile() {
  return readJSON(PROFILE_KEY, null);
}

export function saveProfile(profile) {
  writeJSON(PROFILE_KEY, profile);
}

export function clearProfile() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PROFILE_KEY);
}
