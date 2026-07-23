import { hasActiveAccess } from "@/lib/paywall";
import BookmarkedFlashcards from "@/components/BookmarkedFlashcards";

const PREVIEW_LIMIT = 3;

export default async function BookmarkedFlashcardsPage() {
  const access = await hasActiveAccess();
  return <BookmarkedFlashcards limit={access ? undefined : PREVIEW_LIMIT} />;
}
