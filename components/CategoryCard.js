"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";

export default function CategoryCard({ category, href, accuracy, locked }) {
  const Icon = category.icon;

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={`group flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,27,56,0.08)] ${
          locked ? "border-navy-100 hover:border-navy-200" : "border-navy-100 hover:border-brand-300"
        }`}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${
            locked ? "bg-navy-300" : "bg-gradient-to-br from-navy-800 to-brand-600"
          }`}
        >
          {locked ? <Lock size={18} strokeWidth={2.25} /> : Icon && <Icon size={20} strokeWidth={2.25} />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold text-navy-900">{category.name}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
              {category.weight}% of exam
            </span>
            {locked ? (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                Pro
              </span>
            ) : (
              accuracy !== undefined &&
              accuracy !== null && (
                <span
                  className={`text-xs font-semibold ${
                    accuracy >= 75 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {accuracy}% accuracy
                </span>
              )
            )}
          </div>
        </div>

        {locked ? (
          <Lock size={16} className="shrink-0 text-navy-300" />
        ) : (
          <ChevronRight
            size={18}
            className="shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
          />
        )}
      </Link>
    </motion.div>
  );
}
