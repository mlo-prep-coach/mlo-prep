import { hasActiveAccess } from "@/lib/paywall";
import BookmarkedFlashcards from "@/components/BookmarkedFlashcards";

const FREE_DAILY_CARD_LIMIT = 3;

export default async function BookmarkedFlashcardsPage() {
  const access = await hasActiveAccess();
  return <BookmarkedFlashcards dailyLimit={access ? undefined : FREE_DAILY_CARD_LIMIT} />;
}
