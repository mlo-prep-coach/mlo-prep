"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, ArrowLeft, Clock3 } from "lucide-react";
import { saveProfile } from "@/lib/storage";

const STEPS = ["name", "examDate", "hours"];

const HOUR_OPTIONS = [
  { value: 0.5, label: "15–30 min", hint: "Light pace" },
  { value: 1, label: "About 1 hour", hint: "Steady pace" },
  { value: 2, label: "1–2 hours", hint: "Focused pace" },
  { value: 3, label: "3+ hours", hint: "Intensive pace" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(null);

  const canContinue =
    (step === 0 && firstName.trim().length > 0) ||
    (step === 1 && examDate.length > 0) ||
    (step === 2 && studyHoursPerDay !== null);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    saveProfile({
      firstName: firstName.trim(),
      examDate,
      studyHoursPerDay,
      onboardedAt: Date.now(),
    });
    router.replace("/");
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8">
      <motion.span
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-white shadow-lg"
      >
        <GraduationCap size={26} strokeWidth={2.25} />
      </motion.span>

      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 w-8 rounded-full transition-colors ${
              i <= step ? "bg-brand-600" : "bg-navy-100"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-sm overflow-hidden">
        <AnimatePresence custom={1}>
          {step === 0 && (
            <motion.div
              key="name"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 text-center"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-navy-900">
                  What should we call you?
                </h1>
                <p className="mt-1.5 text-sm text-navy-500">
                  We&apos;ll use this to personalize your study experience.
                </p>
              </div>
              <input
                type="text"
                autoFocus
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canContinue && handleNext()}
                className="rounded-xl border border-navy-200 px-4 py-3.5 text-center text-lg font-semibold text-navy-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="examDate"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 text-center"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-navy-900">
                  When&apos;s your exam, {firstName.trim()}?
                </h1>
                <p className="mt-1.5 text-sm text-navy-500">
                  We&apos;ll build your countdown and study plan around this date.
                </p>
              </div>
              <input
                type="date"
                autoFocus
                min={todayISO()}
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="rounded-xl border border-navy-200 px-4 py-3.5 text-center text-lg font-semibold text-navy-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="hours"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 text-center"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-navy-900">
                  How much time can you study each day?
                </h1>
                <p className="mt-1.5 text-sm text-navy-500">
                  This helps us size your daily study missions.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {HOUR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStudyHoursPerDay(opt.value)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                      studyHoursPerDay === opt.value
                        ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                        : "border-navy-200 bg-white hover:border-brand-300"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        studyHoursPerDay === opt.value
                          ? "bg-brand-600 text-white"
                          : "bg-navy-50 text-navy-500"
                      }`}
                    >
                      <Clock3 size={16} />
                    </span>
                    <span>
                      <span className="block font-semibold text-navy-900">{opt.label}</span>
                      <span className="block text-xs text-navy-400">{opt.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex w-full max-w-sm items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-4 py-3 text-sm font-semibold text-navy-700 hover:bg-navy-50"
          >
            <ArrowLeft size={15} />
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step === STEPS.length - 1 ? "Get Started" : "Continue"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
