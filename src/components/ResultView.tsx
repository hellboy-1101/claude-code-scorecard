"use client";

import { useRef, useCallback } from "react";
import type { ScorecardResult } from "@/lib/types";
import RadarChart from "./RadarChart";
import ScoreCard from "./ScoreCard";
import Improvements from "./Improvements";
import CopyButton from "./CopyButton";

function getGradeColor(grade: string): string {
  switch (grade) {
    case "S": return "from-amber-400 to-yellow-300";
    case "A": return "from-emerald-400 to-green-300";
    case "B": return "from-blue-400 to-cyan-300";
    case "C": return "from-amber-500 to-orange-400";
    case "D": return "from-orange-500 to-red-400";
    default: return "from-red-500 to-red-400";
  }
}

function buildShareText(result: ScorecardResult): string {
  const lines = [
    "Claude Code Scorecard 結果",
    `総合: ${result.totalScore}/100（グレード: ${result.grade}）`,
    "━━━",
    ...result.categories.map((c) => `${c.name}: ${c.average}/100`),
    "━━━",
    `改善が必要な項目: ${result.improvements.length}件`,
  ];
  return lines.join("\n");
}

interface ResultViewProps {
  result: ScorecardResult;
}

export default function ResultView({ result }: ResultViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToResult = useCallback(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Call scrollToResult on mount effect
  if (typeof window !== "undefined") {
    setTimeout(scrollToResult, 100);
  }

  return (
    <div ref={ref} className="space-y-8">
      {/* 総合スコア */}
      <div className="text-center py-8">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="text-7xl sm:text-8xl font-black tabular-nums text-gray-900 dark:text-white">
            {result.totalScore}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 tracking-wider uppercase">
            / 100 点
          </div>
          <div
            className={`mt-2 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradeColor(result.grade)} shadow-lg`}
          >
            <span className="text-3xl font-black text-white drop-shadow">{result.grade}</span>
          </div>
        </div>
      </div>

      {/* レーダーチャート */}
      <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">カテゴリ別レーダー</h2>
        <RadarChart categories={result.categories} />
      </div>

      {/* カテゴリ別スコアカード */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">カテゴリ別詳細</h2>
        <ScoreCard categories={result.categories} />
      </div>

      {/* 改善提案 */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          改善提案
          {result.improvements.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              （{result.improvements.length}件）
            </span>
          )}
        </h2>
        <Improvements improvements={result.improvements} />
      </div>

      {/* 共有 */}
      <div className="flex justify-center">
        <CopyButton
          text={buildShareText(result)}
          label="結果をコピー"
          className="!px-6 !py-3 !text-base"
        />
      </div>
    </div>
  );
}
