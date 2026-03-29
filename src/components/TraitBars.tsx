"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface TraitValue {
  label: string;
  value: number; // 0-100
}

/** Default 6-axis trait labels */
export const TRAIT_LABELS = [
  "自律性",
  "品質重視",
  "並列化",
  "設計志向",
  "自動化",
  "エコシステム",
] as const;

export type TraitLabel = (typeof TRAIT_LABELS)[number];

interface TraitBarsProps {
  traits: TraitValue[];
  /** Type color used for the filled portion */
  color: string;
  /** Show numeric values. Default: true */
  showValues?: boolean;
}

export default function TraitBars({
  traits,
  color,
  showValues = true,
}: TraitBarsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-4" role="list" aria-label="特性プロファイル">
      {traits.map((trait, index) => (
        <div key={trait.label} role="listitem" className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {trait.label}
            </span>
            {showValues && (
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color }}
              >
                {trait.value}%
              </span>
            )}
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{
                width: shouldReduceMotion ? `${trait.value}%` : "0%",
              }}
              animate={{ width: `${trait.value}%` }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: [0.25, 1, 0.5, 1],
                    }
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Derive 6-axis trait values from quiz diagnosis scores.
 * Maps the 6 type scores to abstract personality axes.
 */
export function deriveTraitsFromScores(
  scores: Record<string, number>,
): TraitValue[] {
  const max = Math.max(...Object.values(scores), 1);
  const norm = (key: string) =>
    Math.round(((scores[key] ?? 0) / max) * 100);

  return [
    { label: "自律性", value: norm("outcome") },
    { label: "品質重視", value: norm("academic") },
    { label: "並列化", value: norm("multiAgent") },
    { label: "設計志向", value: norm("specDriven") },
    { label: "自動化", value: norm("harness") },
    { label: "エコシステム", value: norm("basic") },
  ];
}

/**
 * Ideal trait profile for each diagnosis type.
 * Represents what a fully-realized version of this type looks like.
 */
const IDEAL_PROFILES: Record<string, TraitValue[]> = {
  basic: [
    { label: "自律性", value: 30 },
    { label: "品質重視", value: 30 },
    { label: "並列化", value: 10 },
    { label: "設計志向", value: 40 },
    { label: "自動化", value: 20 },
    { label: "エコシステム", value: 90 },
  ],
  specDriven: [
    { label: "自律性", value: 40 },
    { label: "品質重視", value: 80 },
    { label: "並列化", value: 20 },
    { label: "設計志向", value: 95 },
    { label: "自動化", value: 50 },
    { label: "エコシステム", value: 60 },
  ],
  harness: [
    { label: "自律性", value: 60 },
    { label: "品質重視", value: 90 },
    { label: "並列化", value: 40 },
    { label: "設計志向", value: 70 },
    { label: "自動化", value: 95 },
    { label: "エコシステム", value: 85 },
  ],
  multiAgent: [
    { label: "自律性", value: 70 },
    { label: "品質重視", value: 60 },
    { label: "並列化", value: 95 },
    { label: "設計志向", value: 50 },
    { label: "自動化", value: 70 },
    { label: "エコシステム", value: 60 },
  ],
  academic: [
    { label: "自律性", value: 50 },
    { label: "品質重視", value: 95 },
    { label: "並列化", value: 30 },
    { label: "設計志向", value: 80 },
    { label: "自動化", value: 40 },
    { label: "エコシステム", value: 50 },
  ],
  outcome: [
    { label: "自律性", value: 95 },
    { label: "品質重視", value: 70 },
    { label: "並列化", value: 80 },
    { label: "設計志向", value: 60 },
    { label: "自動化", value: 90 },
    { label: "エコシステム", value: 75 },
  ],
};

/** Get the ideal trait profile for a given type ID. */
export function getIdealTraits(typeId: string): TraitValue[] {
  return IDEAL_PROFILES[typeId] ?? IDEAL_PROFILES.basic;
}
