"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ListChecks,
  EyeOff,
  Target,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Timer,
  Flag,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { buildMockExam } from "@/lib/exam";
import { getAllQuestions } from "@/lib/questions";
import { saveSession } from "@/lib/storage";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import ExamOverview from "@/components/ExamOverview";

const FULL_QUESTIONS = 120;
const FULL_EXAM_SECONDS = 190 * 60;
const PREVIEW_QUESTIONS = 15;
const PREVIEW_EXAM_SECONDS = 25 * 60;
const WARNING_SECONDS = 30 * 60;
const CRITICAL_SECONDS = 10 * 60;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const TIMER_STYLES = {
  normal: "bg-gradient-to-br from-navy-900 to-brand-700 text-white",
  warning: "bg-amber-500 text-white",
  critical: "bg-red-600 text-white animate-pulse",
};

export default function MockExam({ hasAccess }) {
  const router = useRouter();
  const totalQuestions = hasAccess ? FULL_QUESTIONS : PREVIEW_QUESTIONS;
  const examSeconds = hasAccess ? FULL_EXAM_SECONDS : PREVIEW_EXAM_SECONDS;

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [showOverview, setShowOverview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(examSeconds);
  const submittedRef = useRef(false);

  const availableCount = getAllQuestions().length;

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, timeLeft]);

  function handleStart() {
    setQuestions(buildMockExam(totalQuestions));
    setStarted(true);
  }

  function handleSelect(choiceIndex) {
    setAnswers((prev) => ({ ...prev, [index]: choiceIndex }));
  }

  function toggleReview() {
    setMarkedForReview((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const answerList = questions.map((question, i) => {
      const selectedIndex = answers[i] ?? null;
      return {
        questionId: question.id,
        category: question.category,
        question: question.question,
        choices: question.choices,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        selectedIndex,
        correct: selectedIndex === question.correctIndex,
      };
    });

    const session = {
      id: `exam-${Date.now()}`,
      mode: "exam",
      category: null,
      preview: !hasAccess,
      timestamp: Date.now(),
      score: answerList.filter((a) => a.correct).length,
      total: answerList.length,
      answers: answerList,
    };
    saveSession(session);
    router.push("/results");
  }

  function confirmSubmit() {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      const ok = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      );
      if (!ok) return;
    }
    handleSubmit();
  }

  if (!started) {
    const facts = hasAccess
      ? [
          { icon: ListChecks, text: `${FULL_QUESTIONS} questions, weighted to match real exam category percentages` },
          { icon: Timer, text: "190-minute countdown timer" },
          { icon: EyeOff, text: "No feedback until you submit — just like the real exam" },
          { icon: Target, text: "75% correct is required to pass" },
        ]
      : [
          { icon: ListChecks, text: `${PREVIEW_QUESTIONS}-question free preview, weighted like the real exam` },
          { icon: Timer, text: "25-minute countdown timer" },
          { icon: EyeOff, text: "No feedback until you submit — just like the real exam" },
          { icon: Sparkles, text: "Subscribe to unlock the full 120-question, 190-minute exam" },
        ];
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-navy-100 bg-white p-7 text-center shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
          <Clock size={26} strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold text-navy-900">
            {hasAccess ? "Full Mock Exam" : "Mock Exam Preview"}
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            {hasAccess ? "Simulate real exam-day conditions" : "Try a sample of the real exam experience"}
          </p>
        </div>

        <ul className="flex w-full flex-col gap-3 text-left">
          {facts.map(({ icon: Icon, text }, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-navy-700">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon size={16} strokeWidth={2.25} />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {hasAccess && availableCount < totalQuestions && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Note: only {availableCount} placeholder questions exist right now, so some will
            repeat to fill all {totalQuestions} slots until you add more real questions.
          </p>
        )}
        <button
          type="button"
          onClick={handleStart}
          className="mt-1 w-full rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800"
        >
          {hasAccess ? "Begin Exam" : "Begin Preview"}
        </button>
      </div>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const isMarked = !!markedForReview[index];
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const urgency = timeLeft < CRITICAL_SECONDS ? "critical" : timeLeft < WARNING_SECONDS ? "warning" : "normal";

  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-2xl p-4 text-center shadow-sm transition-colors ${TIMER_STYLES[urgency]}`}>
        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-90">
          <Timer size={13} /> Time Remaining
        </p>
        <p className="mt-1 font-display text-4xl font-extrabold tabular-nums">{formatTime(timeLeft)}</p>
      </div>

      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_1px_2px_rgba(13,27,56,0.04)]">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-navy-700">
            Question {index + 1} of {questions.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleReview}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                isMarked
                  ? "bg-amber-100 text-amber-700"
                  : "bg-navy-50 text-navy-500 hover:bg-navy-100"
              }`}
            >
              <Flag size={13} fill={isMarked ? "currentColor" : "none"} />
              {isMarked ? "Flagged" : "Flag"}
            </button>
            <button
              type="button"
              onClick={() => setShowOverview(true)}
              className="flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600 hover:bg-navy-100"
            >
              <LayoutGrid size={13} />
              Overview
              {markedCount > 0 && (
                <span className="ml-0.5 rounded-full bg-amber-400 px-1.5 text-[10px] text-white">
                  {markedCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <ProgressBar value={((index + 1) / questions.length) * 100} />
      </div>

      <QuestionCard
        key={question.id + index}
        question={question}
        selectedIndex={answers[index] ?? null}
        onSelect={handleSelect}
        showFeedback={false}
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-xl border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 disabled:opacity-40"
        >
          <ArrowLeft size={15} /> Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={confirmSubmit}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Submit Exam <CheckCircle2 size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="flex items-center gap-1.5 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800"
          >
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={confirmSubmit}
        className="self-center text-sm font-medium text-navy-400 hover:text-red-600"
      >
        Submit exam now
      </button>

      {showOverview && (
        <ExamOverview
          total={questions.length}
          currentIndex={index}
          answers={answers}
          markedForReview={markedForReview}
          onJump={(i) => {
            setIndex(i);
            setShowOverview(false);
          }}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
  );
}
