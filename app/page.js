import { hasActiveAccess } from "@/lib/paywall";
import Dashboard from "@/components/Dashboard";
import FreeHome from "@/components/FreeHome";

export default async function HomePage() {
  const access = await hasActiveAccess();
  return access ? <Dashboard /> : <FreeHome />;
}
