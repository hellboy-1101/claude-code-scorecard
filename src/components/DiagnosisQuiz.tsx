"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS, type QuizChoice } from "@/lib/quiz-data";
import { DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";

/** Get the dominant type color from a single-select choice's points */
function getChoiceColor(choice: QuizChoice): string {
  const topTypeId = Object.entries(choice.points).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0];
  const typeInfo = DIAGNOSIS_TYPES.find((t) => t.id === topTypeId);
  return typeInfo?.color ?? "#da5b38"; // fallback to coral
}

interface DiagnosisQuizProps {
  onComplete: (answers: Record<number, number>, multiAnswers: Record<number, number[]>) => void;
  onBack: () => void;
  onIndexChange?: (index: number) => void;
}

export default function DiagnosisQuiz({ onComplete, onBack, onIndexChange }: DiagnosisQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<number, number[]>>({});
  const [direction, setDirection] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const handleSingleSelect = (choiceIndex: number) => {
    const choice = question.choices[choiceIndex] as QuizChoice;
    const color = getChoiceColor(choice);
    setSelectedColor(color);

    const newAnswers = { ...answers, [question.id]: choiceIndex };
    setAnswers(newAnswers);

    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setTimeout(() => {
        setSelectedColor(null);
        setCurrentIndex((prev) => prev + 1);
      }, 350);
    } else {
      setTimeout(() => onComplete(newAnswers, multiAnswers), 400);
    }
  };

  const handleMultiToggle = (choiceIndex: number) => {
    const current = multiAnswers[question.id] || [];
    const updated = current.includes(choiceIndex)
      ? current.filter((i) => i !== choiceIndex)
      : [...current, choiceIndex];
    setMultiAnswers({ ...multiAnswers, [question.id]: updated });
  };

  const handleMultiConfirm = () => {
    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
    } else {
      setTimeout(() => onComplete(answers, multiAnswers), 400);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setSelectedColor(null);
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const isMulti = question.type === "multi";
  const multiSelected = multiAnswers[question.id] || [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back + counter */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handlePrev}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          ← 戻る
        </button>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
          Q{currentIndex + 1} / {totalQuestions}
        </span>
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Q{question.id}. {question.question}
          </h2>
          {isMulti && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              複数選択可能です
            </p>
          )}
          {!isMulti && <div className="mb-8" />}

          <div className="space-y-3">
            {question.choices.map((choice, i) => {
              if (isMulti) {
                const isSelected = multiSelected.includes(i);
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMultiToggle(i)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-coral-500 bg-coral-50 dark:bg-coral-500/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-coral-300 dark:hover:border-coral-500/50 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 ${
                          isSelected
                            ? "bg-coral-500 border-coral-500 text-white"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
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
              }

              // Single select with type-color feedback
              const isSelected = answers[question.id] === i;
              const choiceColor =
                isSelected && selectedColor ? selectedColor : undefined;

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSingleSelect(i)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? ""
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                  }`}
                  style={
                    isSelected && choiceColor
                      ? {
                          borderColor: choiceColor,
                          backgroundColor: `${choiceColor}10`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                        isSelected
                          ? "text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}
                      style={
                        isSelected && choiceColor
                          ? { backgroundColor: choiceColor }
                          : undefined
                      }
                    >
                      {String.fromCharCode(97 + i)}
                    </div>
                    <span
                      className={`text-sm sm:text-base transition-colors ${
                        isSelected
                          ? "font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                      style={
                        isSelected && choiceColor
                          ? { color: choiceColor }
                          : undefined
                      }
                    >
                      {choice.text}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Multi-select confirm button */}
          {isMulti && (
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMultiConfirm}
                className="px-8 py-3 rounded-xl bg-coral-500 text-white font-semibold hover:bg-coral-600 transition-colors cursor-pointer"
              >
                {multiSelected.length === 0 ? "スキップして次へ" : `${multiSelected.length}件選択して次へ`}
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
