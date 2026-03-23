"use client";

import { motion } from "framer-motion";
import type { DiagnosisType } from "@/lib/diagnosis-types";
import Avatar from "./Avatar";

interface TypeCardProps {
  type: DiagnosisType;
  index: number;
  onClick: () => void;
}

export default function TypeCard({ type, index, onClick }: TypeCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6, boxShadow: `0 12px 40px ${type.color}25` }}
      onClick={onClick}
      className="group text-left p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors hover:border-transparent cursor-pointer"
      style={{ "--type-color": type.color } as React.CSSProperties}
    >
      <div className="flex items-start gap-4">
        <Avatar type={type.id} size="sm" />
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
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {type.subtitle}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            {type.catchphrase}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
