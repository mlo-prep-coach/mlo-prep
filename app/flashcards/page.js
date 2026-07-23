import { hasActiveAccess } from "@/lib/paywall";
import FlashcardsIndex from "@/components/FlashcardsIndex";

export default async function FlashcardsPage() {
  const access = await hasActiveAccess();
  return <FlashcardsIndex hasAccess={access} />;
}
