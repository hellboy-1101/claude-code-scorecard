"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ParsedInput, ScorecardResult } from "@/lib/types";
import { calculateScore } from "@/lib/scorer";
import { calculateDiagnosis, QUIZ_QUESTIONS, type DiagnosisResult } from "@/lib/quiz-data";
import ProgressBar from "@/components/ProgressBar";
import DiagnosisQuiz from "@/components/DiagnosisQuiz";
import TypeSelector from "@/components/TypeSelector";
import InterestSelector from "@/components/InterestSelector";
import EnvInput from "@/components/EnvInput";

const TOTAL_STEPS = QUIZ_QUESTIONS.length + 3; // quiz questions + type + interest + env

export default function DiagnosePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [quizIndex, setQuizIndex] = useState(0);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  const [showEnvInput, setShowEnvInput] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const slideTransition = shouldReduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
      };

  // Calculate overall progress: quiz question index (0-4) maps to steps 1-5,
  // then step 2 = 6, step 3 (interest) = 7, step 3 (env) = 8
  function getProgressStep(): number {
    if (step === 1) return quizIndex + 1;
    if (step === 2) return QUIZ_QUESTIONS.length + 1;
    if (step === 3 && !showEnvInput) return QUIZ_QUESTIONS.length + 2;
    return TOTAL_STEPS;
  }

  // Step 1: Quiz complete
  const handleQuizComplete = (
    answers: Record<number, number>,
    multiAnswers: Record<number, number[]>,
  ) => {
    const result = calculateDiagnosis(answers, multiAnswers);
    setDiagnosis(result);
    setStep(2);
  };

  // Step 2: Type selected
  const handleTypeSelect = (typeId: string) => {
    if (diagnosis) {
      setDiagnosis({ ...diagnosis, selectedType: typeId });
    }
    setStep(3);
  };

  // Step 3: Interest selected → show env input or go to result
  const handleInterestSelect = (interestId: string) => {
    setSelectedInterest(interestId);
    setShowEnvInput(true);
  };

  // Step 3-B: Env input complete → navigate to result
  const handleEnvComplete = (input: ParsedInput | null) => {
    if (!diagnosis) return;

    let scorecardResult: ScorecardResult | null = null;
    if (input) {
      scorecardResult = calculateScore(input);
    }

    sessionStorage.setItem(
      "diagnosisResult",
      JSON.stringify({
        formatVersion: 2,
        diagnosis,
        selectedInterest,
        envInput: input,
        scorecardResult,
      }),
    );

    router.push("/result");
  };

  return (
    <>
      {/* Fixed progress bar at top */}
      <ProgressBar current={getProgressStep()} total={TOTAL_STEPS} />

      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-lg font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent cursor-pointer"
          >
            Claude Code Type
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {getProgressStep()} / {TOTAL_STEPS}
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="quiz"
                {...slideTransition}
              >
                <DiagnosisQuiz
                  onComplete={handleQuizComplete}
                  onBack={() => router.push("/")}
                  onIndexChange={setQuizIndex}
                />
              </motion.div>
            )}

            {step === 2 && diagnosis && (
              <motion.div
                key="type"
                {...slideTransition}
              >
                <TypeSelector
                  inferredType={diagnosis.primaryType}
                  scores={diagnosis.scores}
                  onSelect={handleTypeSelect}
                  onBack={() => setStep(1)}
                />
              </motion.div>
            )}

            {step === 3 && diagnosis && !showEnvInput && (
              <motion.div
                key="interest"
                {...slideTransition}
              >
                <InterestSelector
                  onSelect={handleInterestSelect}
                  onBack={() => setStep(2)}
                />
              </motion.div>
            )}

            {step === 3 && showEnvInput && (
              <motion.div
                key="env"
                {...slideTransition}
              >
                <EnvInput onNext={handleEnvComplete} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
