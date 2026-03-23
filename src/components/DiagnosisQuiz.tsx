"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";

interface DiagnosisQuizProps {
  onComplete: (answers: Record<number, number>) => void;
  onBack: () => void;
}

export default function DiagnosisQuiz({ onComplete, onBack }: DiagnosisQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState(1);

  const question = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelect = (choiceIndex: number) => {
    const newAnswers = { ...answers, [question.id]: choiceIndex };
    setAnswers(newAnswers);

    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 400);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePrev}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            ← 戻る
          </button>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-coral-500 to-coral-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -50 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Q{question.id}. {question.question}
          </h2>

          <div className="space-y-3">
            {question.choices.map((choice, i) => {
              const isSelected = answers[question.id] === i;

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-coral-500 bg-coral-50 dark:bg-coral-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-coral-300 dark:hover:border-coral-500/50 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isSelected
                          ? "bg-coral-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {String.fromCharCode(97 + i)}
                    </div>
                    <span
                      className={`text-sm sm:text-base ${
                        isSelected
                          ? "text-coral-700 dark:text-coral-300 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {choice.text}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
