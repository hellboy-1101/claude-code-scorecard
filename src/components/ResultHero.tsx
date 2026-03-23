"use client";

import { motion } from "framer-motion";
import type { DiagnosisType } from "@/lib/diagnosis-types";
import type { DiagnosisResult } from "@/lib/quiz-data";
import Avatar from "./Avatar";
import TypeRadarChart from "./TypeRadarChart";

interface ResultHeroProps {
  primaryType: DiagnosisType;
  secondaryType: DiagnosisType;
  diagnosisResult: DiagnosisResult;
}

export default function ResultHero({
  primaryType,
  secondaryType,
  diagnosisResult,
}: ResultHeroProps) {
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
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
          &ldquo;{primaryType.catchphrase}&rdquo;
        </p>

        {/* Sub type badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
          <span className="text-gray-500 dark:text-gray-400">副タイプ:</span>
          <span className="font-semibold" style={{ color: secondaryType.color }}>
            {secondaryType.name}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            ({secondaryType.nameJa})
          </span>
        </div>
      </motion.div>

      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10 max-w-md mx-auto"
      >
        <TypeRadarChart scores={diagnosisResult.scores} />
      </motion.div>
    </motion.section>
  );
}
