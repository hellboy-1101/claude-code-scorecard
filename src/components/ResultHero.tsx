"use client";

import { motion } from "framer-motion";
import type { DiagnosisType } from "@/lib/diagnosis-types";
import type { DiagnosisResult } from "@/lib/quiz-data";
import type { TypeRelativeResult } from "@/lib/scorer";
import type { AlignmentPattern } from "@/lib/gap-analysis";
import { getTypeReference } from "@/lib/type-references";
import Avatar from "./Avatar";
import TypeRadarChart from "./TypeRadarChart";

interface ResultHeroProps {
  primaryType: DiagnosisType;
  secondaryType: DiagnosisType | null;
  diagnosisResult: DiagnosisResult;
  typeRelative?: TypeRelativeResult | null;
  alignmentPattern?: AlignmentPattern;
  alignmentMessage?: string;
}

export default function ResultHero({
  primaryType,
  secondaryType,
  diagnosisResult,
  typeRelative,
  alignmentPattern,
  alignmentMessage,
}: ResultHeroProps) {
  const ref = getTypeReference(primaryType.id);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center py-12"
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <Avatar type={primaryType.id} size="lg" />
      </motion.div>

      {/* Type name */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          あなたのタイプ
        </p>
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2"
          style={{ color: primaryType.color }}
        >
          {primaryType.name}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">
          {primaryType.nameJa}
        </p>
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
          {primaryType.subtitle}
        </p>

        {/* Type-relative score (when env data available) */}
        {typeRelative && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {primaryType.name} としての達成度:
            </span>
            <span
              className="text-3xl font-extrabold"
              style={{ color: primaryType.color }}
            >
              {typeRelative.score}
            </span>
            <span className="text-lg text-gray-400">/100</span>
            <span
              className="text-lg font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${primaryType.color}20`,
                color: primaryType.color,
              }}
            >
              {typeRelative.grade}
            </span>
          </motion.div>
        )}

        {/* Type ideal description */}
        {ref && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic max-w-lg mx-auto mb-4">
            このタイプの理想像: {ref.description}
          </p>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
          &ldquo;{primaryType.catchphrase}&rdquo;
        </p>

        {/* Alignment pattern banner */}
        {alignmentPattern && alignmentMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`inline-block px-5 py-2.5 rounded-xl text-sm font-medium mb-4 ${
              alignmentPattern === "aligned"
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                : alignmentPattern === "aspiring"
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            }`}
          >
            {alignmentMessage}
          </motion.div>
        )}

        {/* Sub type badge */}
        {secondaryType && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
            <span className="text-gray-500 dark:text-gray-400">副タイプ:</span>
            <span className="font-semibold" style={{ color: secondaryType.color }}>
              {secondaryType.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ({secondaryType.nameJa})
            </span>
          </div>
        )}
      </motion.div>

      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-10 max-w-md mx-auto"
      >
        <TypeRadarChart scores={diagnosisResult.scores} />
      </motion.div>
    </motion.section>
  );
}
