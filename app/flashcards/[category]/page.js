import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getQuestionsByCategory } from "@/lib/questions";
import FlashcardSession from "@/components/FlashcardSession";

export default async function FlashcardsCategoryPage({ params }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <FlashcardSession
      questions={getQuestionsByCategory(category.id)}
      title={category.name}
      backHref="/flashcards"
    />
  );
}
