"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { DiagnosisType } from "@/lib/diagnosis-types";
import Avatar from "./Avatar";

interface TypeCardProps {
  type: DiagnosisType;
  index: number;
  onClick: () => void;
}

export default function TypeCard({ type, index, onClick }: TypeCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -8, boxShadow: `0 20px 40px ${type.color}20` }
      }
      onClick={onClick}
      className="group text-left rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-colors hover:border-transparent cursor-pointer"
    >
      {/* Gradient header */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${type.color}, ${type.colorLight})`,
        }}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Avatar type={type.id} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-lg font-bold"
                style={{ color: type.color }}
              >
                {type.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {type.nameJa}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
              {type.subtitle}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic line-clamp-1">
              {type.catchphrase}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
