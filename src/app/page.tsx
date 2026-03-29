"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";
import TypeCard from "@/components/TypeCard";
import SocialProof from "@/components/SocialProof";
import Avatar from "@/components/Avatar";

export default function Home() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
            Claude Code Type
          </h1>
          <button
            onClick={() => router.push("/diagnose")}
            className="px-4 py-2 bg-coral-500 text-white text-sm rounded-lg font-medium hover:bg-coral-600 transition-colors cursor-pointer"
          >
            診断を始める
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero — 2-column split */}
        <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: text + CTA */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
            >
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                あなたの
                <br />
                <span className="bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
                  Claude Code
                </span>
                <br />
                タイプは？
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                5問の診断クイズで、あなたに最適なClaude Codeの活用スタイルを見つけましょう
              </p>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => router.push("/diagnose")}
                className="px-10 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                無料で診断する
              </motion.button>
            </motion.div>

            {/* Right: 6 type icon cluster */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.8,
                delay: 0.2,
              }}
              className="hidden lg:grid grid-cols-3 gap-4 justify-items-center"
            >
              {DIAGNOSIS_TYPES.map((type, i) => (
                <motion.div
                  key={type.id}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}12` }}
                  >
                    <Avatar type={type.id} size="sm" />
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: type.color }}
                  >
                    {type.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Social Proof bar */}
        <SocialProof className="py-4 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50" />

        {/* 6 Type Cards — 3-col grid */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h3 className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-8">
            6つのタイプ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Full-width CTA banner */}
        <section className="bg-gradient-to-r from-coral-500 to-coral-600 py-12">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              自分のタイプを知ろう
            </h3>
            <p className="text-coral-100 mb-6 max-w-lg mx-auto">
              5問の質問に答えるだけ。あなたのClaude Code活用スタイルを診断し、次のステップを提案します。
            </p>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => router.push("/diagnose")}
              className="px-10 py-4 bg-white text-coral-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              診断を始める
            </motion.button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            このツールはAnthropicの公式ツールではありません
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
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
