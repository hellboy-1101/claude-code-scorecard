"use client";

import type { Improvement } from "@/lib/types";

export default function Improvements({ improvements }: { improvements: Improvement[] }) {
  if (improvements.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-center">
        <p className="text-emerald-700 dark:text-emerald-400 font-medium">
          すべての項目が60点以上です。素晴らしい設定です！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {improvements.map((imp, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {imp.item}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {imp.problem}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {imp.estimatedTime}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-coral-500/10 text-coral-400">
                +{imp.impact}pt
              </span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
              {imp.action}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
