"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { shuffle } from "@/lib/exam";
import { saveSession } from "@/lib/storage";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";

export default function PracticeSession({
  questions: inputQuestions,
  title,
  sessionCategory,
  isDailyPreview,
}) {
  const router = useRouter();
  const [questions] = useState(() => shuffle(inputQuestions));

  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);

  if (questions.length === 0) {
    return <p className="text-navy-600">No questions available for this session.</p>;
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCount = index + (selectedIndex !== null ? 1 : 0);

  function handleSelect(choiceIndex) {
    if (selectedIndex !== null) return;
    setSelectedIndex(choiceIndex);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        category: question.category,
        question: question.question,
        choices: question.choices,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        selectedIndex: choiceIndex,
        correct: choiceIndex === question.correctIndex,
      },
    ]);
  }

  function handleNext() {
    if (isLast) {
      const score = answers.filter((a) => a.correct).length;
      const session = {
        id: `practice-${Date.now()}`,
        mode: "practice",
        category: sessionCategory,
        label: title,
        timestamp: Date.now(),
        score,
        total: answers.length,
        answers,
        preview: !!isDailyPreview,
      };
      saveSession(session);
      router.push("/results");
      return;
    }
    setIndex((i) => i + 1);
    setSelectedIndex(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {isDailyPreview && (
        <Link
          href="/upgrade"
          className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-3.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
            <Sparkles size={16} strokeWidth={2.25} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-900">
              Free daily practice — 10 new questions today
            </p>
            <p className="text-xs text-navy-500">
              A fresh set unlocks tomorrow. Subscribe for unlimited questions, every category.
            </p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-brand-600" />
        </Link>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-navy-900">{title}</h1>
          <p className="text-sm font-medium text-navy-500">
            {index + 1} / {questions.length}
          </p>
        </div>
        <ProgressBar value={(answeredCount / questions.length) * 100} />
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        showFeedback
      />

      {selectedIndex !== null && (
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center justify-center gap-2 self-end rounded-xl bg-navy-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800"
        >
          {isLast ? (
            <>
              Finish <CheckCircle2 size={16} />
            </>
          ) : (
            <>
              Next <ArrowRight size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
