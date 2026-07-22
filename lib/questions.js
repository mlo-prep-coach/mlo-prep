import mloActivities from "@/data/mlo-activities.json";
import federalLaw from "@/data/federal-law.json";
import generalKnowledge from "@/data/general-knowledge.json";
import ethics from "@/data/ethics.json";
import stateContent from "@/data/state-content.json";

const QUESTIONS_BY_CATEGORY = {
  "mlo-activities": mloActivities,
  "federal-law": federalLaw,
  "general-knowledge": generalKnowledge,
  ethics: ethics,
  "state-content": stateContent,
};

export function getQuestionsByCategory(categoryId) {
  return QUESTIONS_BY_CATEGORY[categoryId] ?? [];
}

export function getAllQuestions() {
  return Object.values(QUESTIONS_BY_CATEGORY).flat();
}

export function getQuestionById(id) {
  return getAllQuestions().find((q) => q.id === id) ?? null;
}
