"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ParsedInput, ScorecardResult } from "@/lib/types";
import type { DiagnosisResult } from "@/lib/quiz-data";
import { getTypeById, DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";
import { calculateTypeRelativeScore, type TypeRelativeResult } from "@/lib/scorer";
import { getTypeReference } from "@/lib/type-references";
import { generateGapSuggestions } from "@/lib/gap-analysis";
import ResultHero from "@/components/ResultHero";
import TypeDescription from "@/components/TypeDescription";
import PromptGenerator from "@/components/PromptGenerator";
import ScoreCard from "@/components/ScoreCard";
import RadarChart from "@/components/RadarChart";
import GapSuggestions from "@/components/GapSuggestions";

interface StoredResult {
  diagnosis: DiagnosisResult;
  envInput: ParsedInput | null;
  scorecardResult: ScorecardResult | null;
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosisResult");
    if (!stored) {
      router.push("/diagnose");
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  const { diagnosis, envInput, scorecardResult } = data;
  const primaryType = getTypeById(diagnosis.primaryType);
  const secondaryType = getTypeById(diagnosis.secondaryType);

  if (!primaryType || !secondaryType) {
    router.push("/diagnose");
    return null;
  }

  // Calculate type-relative score
  let typeRelative: TypeRelativeResult | null = null;
  let itemRelevance: Record<string, string> | undefined;

  if (scorecardResult) {
    typeRelative = calculateTypeRelativeScore(
      scorecardResult.categories,
      diagnosis.primaryType,
    );
    const ref = getTypeReference(diagnosis.primaryType);
    if (ref) {
      itemRelevance = ref.items;
    }
  }

  // Generate gap suggestions
  const gapSuggestions = generateGapSuggestions(diagnosis, typeRelative);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-lg font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent cursor-pointer"
          >
            Claude Code Type
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const scoreText = typeRelative ? ` (${typeRelative.score}/100 ${typeRelative.grade}ランク)` : "";
                const text = `Claude Code Type 診断結果\n\n主タイプ: ${primaryType.name}（${primaryType.nameJa}）${scoreText}\n副タイプ: ${secondaryType.name}（${secondaryType.nameJa}）\n\n${primaryType.catchphrase}\n\nスコア分布:\n${DIAGNOSIS_TYPES.map((t) => `${t.name}: ${diagnosis.scores[t.id] || 0}pt`).join("\n")}`;
                navigator.clipboard.writeText(text);
              }}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              結果を共有
            </button>
            <button
              onClick={() => router.push("/diagnose")}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              もう一度診断
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Hero section */}
          <ResultHero
            primaryType={primaryType}
            secondaryType={secondaryType}
            diagnosisResult={diagnosis}
            typeRelative={typeRelative}
          />

          <hr className="border-gray-200 dark:border-gray-800 my-4" />

          {/* Type description */}
          <TypeDescription type={primaryType} />

          {/* Gap suggestions (always shown - works with or without env data) */}
          {gapSuggestions.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="py-8"
            >
              <hr className="border-gray-200 dark:border-gray-800 mb-8" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                改善提案
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {primaryType.name}の理想形に近づくための具体的なアクション
              </p>
              <GapSuggestions suggestions={gapSuggestions} />
            </motion.section>
          )}

          {/* Environment evaluation (only if env data provided) */}
          {scorecardResult && typeRelative && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="py-8"
            >
              <hr className="border-gray-200 dark:border-gray-800 mb-8" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                環境評価
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {primaryType.name}としての達成度:{" "}
                <span
                  className="font-bold"
                  style={{ color: primaryType.color }}
                >
                  {typeRelative.score}点
                </span>
                / 100点 — {typeRelative.grade}ランク
                <br />
                <span className="text-xs">
                  （必須項目{typeRelative.requiredItems.length}件 + 推奨項目{typeRelative.recommendedItems.length}件で評価、
                  不要項目{typeRelative.irrelevantItems.length}件は除外）
                </span>
              </p>

              <div className="mb-8">
                <RadarChart categories={scorecardResult.categories} />
              </div>

              <ScoreCard
                categories={scorecardResult.categories}
                itemRelevance={itemRelevance as Record<string, "required" | "recommended" | "irrelevant">}
              />
            </motion.section>
          )}

          {/* No env data hint */}
          {!scorecardResult && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="py-8"
            >
              <hr className="border-gray-200 dark:border-gray-800 mb-8" />
              <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  環境データを入力すると、{primaryType.name}としての達成度を採点できます
                </p>
                <button
                  onClick={() => router.push("/diagnose")}
                  className="px-6 py-2 rounded-lg bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors cursor-pointer"
                >
                  環境データを入力して再診断
                </button>
              </div>
            </motion.section>
          )}

          <hr className="border-gray-200 dark:border-gray-800 my-4" />

          {/* Prompt generator */}
          <PromptGenerator
            envInput={envInput}
            primaryType={diagnosis.primaryType}
            scorecardResult={scorecardResult}
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            このツールはAnthropicの公式ツールではありません
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Claude Code Type — すべての処理はブラウザ内で完結します
          </p>
        </div>
      </footer>
    </>
  );
}
