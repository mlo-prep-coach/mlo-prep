import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getQuestionsByCategory } from "@/lib/questions";
import { hasActiveAccess } from "@/lib/paywall";
import FlashcardSession from "@/components/FlashcardSession";

const PREVIEW_LIMIT = 3;

export default async function FlashcardsCategoryPage({ params }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  const access = await hasActiveAccess();

  return (
    <FlashcardSession
      questions={getQuestionsByCategory(category.id)}
      title={category.name}
      backHref="/flashcards"
      limit={access ? undefined : PREVIEW_LIMIT}
    />
  );
}
