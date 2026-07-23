import { notFound, redirect } from "next/navigation";
import { getCategory, FREE_CATEGORY_ID } from "@/lib/categories";
import { getQuestionsByCategory } from "@/lib/questions";
import { hasActiveAccess } from "@/lib/paywall";
import PracticeSession from "@/components/PracticeSession";

export default async function PracticePage({ params }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  if (categoryId !== FREE_CATEGORY_ID && !(await hasActiveAccess())) {
    redirect("/upgrade");
  }

  return (
    <PracticeSession
      questions={getQuestionsByCategory(category.id)}
      title={category.name}
      sessionCategory={category.id}
    />
  );
}
