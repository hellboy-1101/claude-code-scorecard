"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { ParsedInput, ScorecardResult } from "@/lib/types";
import { calculateScore } from "@/lib/scorer";
import { calculateDiagnosis, type DiagnosisResult } from "@/lib/quiz-data";
import StepIndicator from "@/components/StepIndicator";
import DiagnosisQuiz from "@/components/DiagnosisQuiz";
import TypeSelector from "@/components/TypeSelector";
import InterestSelector from "@/components/InterestSelector";
import EnvInput from "@/components/EnvInput";

export default function DiagnosePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  const [showEnvInput, setShowEnvInput] = useState(false);

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
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <DiagnosisQuiz
                  onComplete={handleQuizComplete}
                  onBack={() => router.push("/")}
                />
              </motion.div>
            )}

            {step === 2 && diagnosis && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
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
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
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
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
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
