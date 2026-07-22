import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getQuestionsByCategory } from "@/lib/questions";
import PracticeSession from "@/components/PracticeSession";

export default async function PracticePage({ params }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <PracticeSession
      questions={getQuestionsByCategory(category.id)}
      title={category.name}
      sessionCategory={category.id}
    />
  );
}
