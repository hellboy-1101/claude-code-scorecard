"use client";

import { useState } from "react";
import type { ParsedInput } from "@/lib/types";
import { parseBulkInput, createEmptyInput } from "@/lib/parser";
import { BULK_SCRIPT, INDIVIDUAL_COMMANDS } from "@/lib/bulk-script";
import CopyButton from "./CopyButton";

interface InputFormProps {
  onScore: (input: ParsedInput) => void;
}

type InputMode = "bulk" | "individual";

export default function InputForm({ onScore }: InputFormProps) {
  const [mode, setMode] = useState<InputMode>("bulk");
  const [bulkText, setBulkText] = useState("");
  const [individual, setIndividual] = useState<ParsedInput>(createEmptyInput());

  const handleSubmit = () => {
    const input = mode === "bulk" ? parseBulkInput(bulkText) : individual;
    onScore(input);
  };

  const updateField = (key: keyof ParsedInput, value: string) => {
    setIndividual((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* モード切替 */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setMode("bulk")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
            mode === "bulk"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          一括入力（推奨）
        </button>
        <button
          onClick={() => setMode("individual")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
            mode === "individual"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          個別入力
        </button>
      </div>

      {mode === "bulk" ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              以下のスクリプトをターミナルで実行し、出力をテキストエリアに貼り付けてください。
            </p>
            <div className="relative">
              <pre className="p-3 bg-gray-900 text-gray-300 rounded-md text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {BULK_SCRIPT}
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={BULK_SCRIPT} label="スクリプトをコピー" />
              </div>
            </div>
          </div>

          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="スクリプトの出力をここに貼り付けてください..."
            className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(INDIVIDUAL_COMMANDS).map(([key, { label, command }]) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <CopyButton text={command} label="取得コマンドをコピー" />
              </div>
              <textarea
                value={individual[key as keyof ParsedInput]}
                onChange={(e) => updateField(key as keyof ParsedInput, e.target.value)}
                placeholder={`$ ${command}`}
                rows={3}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-3 px-6 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-semibold rounded-lg shadow-lg shadow-coral-500/25 hover:shadow-coral-500/40 transition-all duration-200 cursor-pointer text-lg"
      >
        採点する
      </button>
    </div>
  );
}
