"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { ParsedInput, ScorecardResult } from "@/lib/types";
import { calculateScore } from "@/lib/scorer";
import { calculateDiagnosis } from "@/lib/quiz-data";
import StepIndicator from "@/components/StepIndicator";
import EnvInput from "@/components/EnvInput";
import DiagnosisQuiz from "@/components/DiagnosisQuiz";

export default function DiagnosePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [envInput, setEnvInput] = useState<ParsedInput | null>(null);

  const handleEnvComplete = (input: ParsedInput | null) => {
    setEnvInput(input);
    setStep(2);
  };

  const handleQuizComplete = (
    answers: Record<number, number>,
    multiAnswers: Record<number, number[]>,
  ) => {
    const diagnosis = calculateDiagnosis(answers, multiAnswers);
    let scorecardResult: ScorecardResult | null = null;

    if (envInput) {
      scorecardResult = calculateScore(envInput);
    }

    sessionStorage.setItem(
      "diagnosisResult",
      JSON.stringify({
        diagnosis,
        envInput,
        scorecardResult,
      }),
    );

    router.push("/result");
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-lg font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent cursor-pointer"
          >
            Claude Code Type
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <StepIndicator currentStep={step} totalSteps={3} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="env"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <EnvInput onNext={handleEnvComplete} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <DiagnosisQuiz
                  onComplete={handleQuizComplete}
                  onBack={() => setStep(1)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
