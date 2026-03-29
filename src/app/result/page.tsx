"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ParsedInput, ScorecardResult } from "@/lib/types";
import type { DiagnosisResult } from "@/lib/quiz-data";
import { getTypeById, DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";
import { calculateTypeRelativeScore, type TypeRelativeResult } from "@/lib/scorer";
import { getTypeReference } from "@/lib/type-references";
import {
  inferActualType,
  compareTypes,
  generateGapSuggestions,
  type AlignmentPattern,
} from "@/lib/gap-analysis";
import ResultHero from "@/components/ResultHero";
import TypeDescription from "@/components/TypeDescription";
import ScoreCard from "@/components/ScoreCard";
import RadarChart from "@/components/RadarChart";
import GapSuggestions from "@/components/GapSuggestions";
import TabContent, { type TabItem } from "@/components/TabContent";
import Avatar from "@/components/Avatar";
import { recordDiagnosis } from "@/components/SocialProof";

interface StoredResult {
  diagnosis: DiagnosisResult;
  selectedInterest: string;
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
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.diagnosis || !("selectedInterest" in parsed) || parsed.formatVersion !== 2) {
        sessionStorage.removeItem("diagnosisResult");
        router.push("/diagnose");
        return;
      }
      setData(parsed);
      // Record for SocialProof stats
      const typeId = parsed.diagnosis.selectedType || parsed.diagnosis.primaryType;
      recordDiagnosis(typeId);
    } catch {
      router.push("/diagnose");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  const { diagnosis, selectedInterest, envInput, scorecardResult } = data;
  const evaluatedTypeId = diagnosis.selectedType || diagnosis.primaryType;
  const primaryType = getTypeById(evaluatedTypeId);

  if (!primaryType) {
    router.push("/diagnose");
    return null;
  }

  // Secondary type from scores
  const sortedScores = Object.entries(diagnosis.scores).sort(([, a], [, b]) => b - a);
  const secondaryType =
    sortedScores.length > 1 ? getTypeById(sortedScores[1][0]) : null;

  // 3-stage algorithm
  let alignmentPattern: AlignmentPattern | undefined;
  let alignmentMessage: string | undefined;
  let evaluationType = evaluatedTypeId;
  let typeRelative: TypeRelativeResult | null = null;
  let itemRelevance: Record<string, string> | undefined;
  let actualTypeId: string | undefined;

  if (envInput && scorecardResult) {
    const inferred = inferActualType(envInput);
    actualTypeId = inferred.actualType;
    const comparison = compareTypes(evaluatedTypeId, inferred.actualType, inferred.confidence);
    alignmentPattern = comparison.pattern;
    alignmentMessage = comparison.message;
    evaluationType = comparison.evaluationType;
    typeRelative = calculateTypeRelativeScore(
      scorecardResult.categories,
      evaluationType,
    );
    const ref = getTypeReference(evaluationType);
    if (ref) {
      itemRelevance = ref.items;
    }
  }

  // Generate gap suggestions
  const gapSuggestions = generateGapSuggestions(
    diagnosis,
    typeRelative,
    selectedInterest,
    evaluationType,
  );

  // Build tabs
  const tabs: TabItem[] = [
    {
      value: "description",
      label: "タイプ解説",
      content: <TypeDescription type={primaryType} />,
    },
    {
      value: "suggestions",
      label: "改善提案",
      content:
        gapSuggestions.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {alignmentPattern === "aspiring"
                ? "ステップアップロードマップ"
                : alignmentPattern === "underutilized"
                  ? "活用提案"
                  : "改善提案"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {alignmentPattern === "aspiring"
                ? `${getTypeById(actualTypeId!)?.name || ""} → ${primaryType.name} に到達するために必要なアクション`
                : alignmentPattern === "underutilized"
                  ? "既にある機能をもっと活かすための提案"
                  : `${primaryType.name}の理想形に近づくための具体的なアクション`}
            </p>
            <GapSuggestions suggestions={gapSuggestions} />
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-center">
            <p className="text-emerald-700 dark:text-emerald-400 font-medium">
              改善提案はありません。このタイプの理想形に近い状態です！
            </p>
          </div>
        ),
    },
  ];

  // Environment evaluation tab (only with env data)
  if (scorecardResult && typeRelative) {
    tabs.push({
      value: "environment",
      label: "環境評価",
      content: (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            環境評価
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {primaryType.name}としての達成度:{" "}
            <span className="font-bold" style={{ color: primaryType.color }}>
              {typeRelative.score}点
            </span>
            / 100点 — {typeRelative.grade}ランク
            <br />
            <span className="text-xs">
              （必須項目{typeRelative.requiredItems.length}件 + 推奨項目
              {typeRelative.recommendedItems.length}件で評価、 不要項目
              {typeRelative.irrelevantItems.length}件は除外）
            </span>
          </p>
          <div className="mb-8">
            <RadarChart categories={scorecardResult.categories} />
          </div>
          <ScoreCard
            categories={scorecardResult.categories}
            itemRelevance={
              itemRelevance as Record<
                string,
                "required" | "recommended" | "irrelevant"
              >
            }
          />
        </div>
      ),
    });
  }

  // Detailed data tab (score breakdown, always available)
  tabs.push({
    value: "data",
    label: "詳細データ",
    content: (
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          スコア分布
        </h2>
        <div className="space-y-3">
          {DIAGNOSIS_TYPES.map((t) => {
            const score = diagnosis.scores[t.id] ?? 0;
            const maxScore = Math.max(
              ...Object.values(diagnosis.scores),
              1,
            );
            const pct = Math.round((score / maxScore) * 100);
            return (
              <div key={t.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.name}（{t.nameJa}）
                  </span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: t.color }}
                  >
                    {score}pt
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full animate-grow"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: t.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Knowledge gap */}
        {diagnosis.unknownFeatures.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              未知の機能
            </h3>
            <div className="flex flex-wrap gap-2">
              {diagnosis.unknownFeatures.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* No env data hint */}
        {!scorecardResult && (
          <div className="mt-8 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              環境データを入力すると、{primaryType.name}
              としての達成度を採点できます
            </p>
            <button
              onClick={() => router.push("/diagnose")}
              className="px-6 py-2 rounded-lg bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors cursor-pointer"
            >
              環境データを入力して再診断
            </button>
          </div>
        )}
      </div>
    ),
  });

  // Related types (all except primary)
  const relatedTypes = DIAGNOSIS_TYPES.filter((t) => t.id !== primaryType.id);

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
                const scoreText = typeRelative
                  ? ` (${typeRelative.score}/100 ${typeRelative.grade}ランク)`
                  : "";
                const text = `Claude Code Type 診断結果\n\n主タイプ: ${primaryType.name}（${primaryType.nameJa}）${scoreText}\n\n${primaryType.catchphrase}\n\nスコア分布:\n${DIAGNOSIS_TYPES.map((t) => `${t.name}: ${diagnosis.scores[t.id] || 0}pt`).join("\n")}`;
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
            secondaryType={secondaryType ?? null}
            diagnosisResult={diagnosis}
            typeRelative={typeRelative}
            alignmentPattern={alignmentPattern}
            alignmentMessage={alignmentMessage}
          />

          {/* Tab layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-10"
          >
            <TabContent
              tabs={tabs}
              defaultValue="description"
              color={primaryType.color}
            />
          </motion.div>

          {/* Related type navigation cards — horizontal scroll */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
              関連タイプ
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {relatedTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => router.push(`/types/${t.id}`)}
                  className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-transparent transition-all cursor-pointer"
                  style={
                    {
                      "--hover-shadow": `0 8px 24px ${t.color}20`,
                    } as React.CSSProperties
                  }
                >
                  <Avatar type={t.id} size="sm" />
                  <div className="text-left">
                    <span
                      className="block text-sm font-bold"
                      style={{ color: t.color }}
                    >
                      {t.name}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {t.nameJa}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.section>
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
