import { notFound, redirect } from "next/navigation";
import { getCategory, FREE_CATEGORY_ID } from "@/lib/categories";
import { getQuestionsByCategory } from "@/lib/questions";
import { hasActiveAccess } from "@/lib/paywall";
import { pickDailySubset } from "@/lib/dailyLimit";
import PracticeSession from "@/components/PracticeSession";

const FREE_DAILY_QUESTION_LIMIT = 10;

export default async function PracticePage({ params }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  const access = await hasActiveAccess();

  if (categoryId !== FREE_CATEGORY_ID && !access) {
    redirect("/upgrade");
  }

  const allQuestions = getQuestionsByCategory(category.id);
  const questions = access
    ? allQuestions
    : pickDailySubset(allQuestions, FREE_DAILY_QUESTION_LIMIT, category.id);

  return (
    <PracticeSession
      questions={questions}
      title={category.name}
      sessionCategory={category.id}
      isDailyPreview={!access}
    />
  );
}
