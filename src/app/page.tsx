"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";
import TypeCard from "@/components/TypeCard";

export default function Home() {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
            Claude Code Type
          </h1>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            あなたに最適なClaude Codeの使い方を診断
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Claude Code Type
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
              10問の診断クイズで、あなたに最適なClaude Codeの活用スタイルを見つけましょう
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/diagnose")}
              className="px-10 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              診断を始める
            </motion.button>
          </motion.div>
        </section>

        {/* 6 Type Cards */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h3 className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-8">
            6つのタイプ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIAGNOSIS_TYPES.map((type, i) => (
              <TypeCard
                key={type.id}
                type={type}
                index={i}
                onClick={() => router.push(`/types/${type.id}`)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            このツールはAnthropicの公式ツールではありません
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            設定情報はサーバーに送信されません
          </p>
          <a
            href="https://github.com/satoshiamenomori/claude-code-scorecard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
