import { hasActiveAccess } from "@/lib/paywall";
import MockExam from "@/components/MockExam";

export default async function ExamPage() {
  const access = await hasActiveAccess();
  return <MockExam hasAccess={access} />;
}
