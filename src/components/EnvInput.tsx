"use client";

import { useState } from "react";
import type { ParsedInput } from "@/lib/types";
import { parseBulkInput } from "@/lib/parser";
import { BULK_SCRIPT } from "@/lib/bulk-script";
import CopyButton from "./CopyButton";

interface EnvInputProps {
  onNext: (input: ParsedInput | null) => void;
}

export default function EnvInput({ onNext }: EnvInputProps) {
  const [rawText, setRawText] = useState("");

  const handleNext = () => {
    if (rawText.trim()) {
      const parsed = parseBulkInput(rawText);
      onNext(parsed);
    } else {
      onNext(null);
    }
  };

  const handleSkip = () => {
    onNext(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
          環境データを取得
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          ターミナルで以下のスクリプトを実行し、結果を貼り付けてください。
          <br />
          環境データがあると、より正確な診断ができます。
        </p>
      </div>

      {/* Script copy section */}
      <div className="mb-6 bg-gray-900 dark:bg-gray-800 rounded-xl p-4 relative">
        <div className="absolute top-3 right-3">
          <CopyButton text={BULK_SCRIPT} />
        </div>
        <pre className="text-xs text-green-400 overflow-x-auto pr-12 font-mono whitespace-pre-wrap break-all">
          {BULK_SCRIPT}
        </pre>
      </div>

      {/* Paste area */}
      <label htmlFor="env-textarea" className="sr-only">環境データの貼り付け</label>
      <textarea
        id="env-textarea"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="スクリプトの実行結果をここに貼り付け..."
        className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono resize-none focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
      />

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleSkip}
          className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          スキップして診断へ →
        </button>
        <button
          onClick={handleNext}
          disabled={!rawText.trim()}
          className="px-8 py-3 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          次へ
        </button>
      </div>

      <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        設定情報はサーバーに送信されません。すべてブラウザ内で処理されます。
      </p>
    </div>
  );
}
