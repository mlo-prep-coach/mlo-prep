import { ClipboardList, Scale, BookOpen, ShieldCheck, Landmark } from "lucide-react";

export const CATEGORIES = [
  {
    id: "mlo-activities",
    name: "Mortgage Loan Origination Activities",
    shortName: "Origination Activities",
    weight: 27,
    icon: ClipboardList,
  },
  {
    id: "federal-law",
    name: "Federal Mortgage Related Laws",
    shortName: "Federal Law",
    weight: 24,
    icon: Scale,
  },
  {
    id: "general-knowledge",
    name: "General Mortgage Knowledge",
    shortName: "General Knowledge",
    weight: 20,
    icon: BookOpen,
  },
  {
    id: "ethics",
    name: "Ethics",
    shortName: "Ethics",
    weight: 18,
    icon: ShieldCheck,
  },
  {
    id: "state-content",
    name: "Uniform State Content",
    shortName: "State Content",
    weight: 11,
    icon: Landmark,
  },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}
