import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getQuestionsByCategory } from "@/lib/questions";
import { hasActiveAccess } from "@/lib/paywall";
import { pickDailySubset } from "@/lib/dailyLimit";
import FlashcardSession from "@/components/FlashcardSession";

const FREE_DAILY_CARD_LIMIT = 3;

export default async function FlashcardsCategoryPage({ params }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  const access = await hasActiveAccess();
  const allQuestions = getQuestionsByCategory(category.id);
  const questions = access
    ? allQuestions
    : pickDailySubset(allQuestions, FREE_DAILY_CARD_LIMIT, `flashcards:${category.id}`);

  return (
    <FlashcardSession
      questions={questions}
      title={category.name}
      backHref="/flashcards"
      isPreview={!access}
      previewLimit={FREE_DAILY_CARD_LIMIT}
    />
  );
}
