"use client";

import { motion } from "framer-motion";
import type { DiagnosisType } from "@/lib/diagnosis-types";

interface TypeDescriptionProps {
  type: DiagnosisType;
}

export default function TypeDescription({ type }: TypeDescriptionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="py-8"
    >
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: type.color }}
      >
        あなたのタイプ: {type.name}（{type.nameJa}）
      </h2>

      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        {type.description}
      </p>

      {/* Strengths */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            style={{ backgroundColor: type.color }}
          >
            ✦
          </span>
          強み
        </h3>
        <ul className="space-y-2">
          {type.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span style={{ color: type.color }} className="mt-0.5">●</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Growth */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500 text-white text-sm">
            →
          </span>
          成長の方向性
        </h3>
        <ul className="space-y-2">
          {type.growth.map((g, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span className="text-emerald-500 mt-0.5">▸</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* First step */}
      <div
        className="p-5 rounded-xl border-2"
        style={{ borderColor: type.color, backgroundColor: `${type.colorLight}40` }}
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          推奨する最初の一手
        </h3>
        <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
          {type.firstStep}
        </p>
      </div>
    </motion.section>
  );
}
