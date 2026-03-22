"use client";

import { useState } from "react";
import type { ParsedInput, ScorecardResult } from "@/lib/types";
import { calculateScore } from "@/lib/scorer";
import InputForm from "@/components/InputForm";
import ResultView from "@/components/ResultView";

export default function Home() {
  const [result, setResult] = useState<ScorecardResult | null>(null);

  const handleScore = (input: ParsedInput) => {
    const scored = calculateScore(input);
    setResult(scored);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
            Claude Code Scorecard
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              設定情報はサーバーに送信されません
            </span>
            {result && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                やり直す
              </button>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {!result ? (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  あなたのClaude Code環境を採点
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  7カテゴリ・25項目で100点満点のスコアリング
                </p>
              </div>
              <InputForm onScore={handleScore} />
            </div>
          ) : (
            <ResultView result={result} />
          )}
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-gray-400 dark:text-gray-500">
          Claude Code Scorecard v2 — すべての処理はブラウザ内で完結します
        </div>
      </footer>
    </>
  );
}
