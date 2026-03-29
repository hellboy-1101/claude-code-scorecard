"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ProgressBarProps {
  /** Current step (1-based) */
  current: number;
  /** Total number of steps */
  total: number;
  /** Optional type color for the bar fill */
  color?: string;
}

export default function ProgressBar({
  current,
  total,
  color,
}: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-1"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`ステップ ${current} / ${total}`}
    >
      <motion.div
        className={`h-full rounded-r-full ${
          color ? "" : "bg-gradient-to-r from-coral-500 to-coral-400"
        }`}
        style={
          color
            ? { background: `linear-gradient(90deg, ${color}, ${color}cc)` }
            : undefined
        }
        initial={{ width: shouldReduceMotion ? `${percentage}%` : "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
        }
      />
    </div>
  );
}
