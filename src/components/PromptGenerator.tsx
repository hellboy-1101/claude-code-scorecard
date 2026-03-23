"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ParsedInput, ScorecardResult } from "@/lib/types";
import { generateTuningPrompt } from "@/lib/prompt-generator";
import CopyButton from "./CopyButton";

interface PromptGeneratorProps {
  envInput: ParsedInput | null;
  primaryType: string;
  scorecardResult: ScorecardResult | null;
}

export default function PromptGenerator({
  envInput,
  primaryType,
  scorecardResult,
}: PromptGeneratorProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    const generated = generateTuningPrompt(envInput, primaryType, scorecardResult);
    setPrompt(generated);
    setIsGenerated(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="py-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Claude Codeを最適化する
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        あなたの環境データと診断タイプに基づいて、Claude Codeにそのまま貼り付けて実行できるプロンプトを生成します。
      </p>

      {!isGenerated ? (
        <button
          onClick={handleGenerate}
          className="w-full py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-xl font-bold text-lg hover:from-coral-600 hover:to-coral-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
        >
          チューニングプロンプトを生成
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative bg-gray-900 dark:bg-gray-800 rounded-xl p-5 overflow-hidden">
            <div className="absolute top-3 right-3 z-10">
              <CopyButton text={prompt} />
            </div>
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words pr-12 max-h-96 overflow-y-auto">
              {prompt}
            </pre>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
            このプロンプトをClaude Codeに貼り付けて実行してください
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
