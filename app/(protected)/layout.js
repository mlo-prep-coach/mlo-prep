import { redirect } from "next/navigation";
import { hasActiveAccess } from "@/lib/paywall";

export default async function ProtectedLayout({ children }) {
  if (!(await hasActiveAccess())) {
    redirect("/upgrade");
  }
  return children;
}
