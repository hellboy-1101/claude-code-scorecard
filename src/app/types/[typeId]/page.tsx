"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getTypeById, DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";
import Avatar from "@/components/Avatar";

export default function TypeDetailPage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const { typeId } = use(params);
  const router = useRouter();
  const type = getTypeById(typeId);

  if (!type) {
    router.push("/");
    return null;
  }

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
          <button
            onClick={() => router.push("/diagnose")}
            className="px-4 py-2 bg-coral-500 text-white text-sm rounded-lg font-medium hover:bg-coral-600 transition-colors cursor-pointer"
          >
            診断を始める
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Avatar type={type.id} size="lg" className="mx-auto mb-6" />
            <h1
              className="text-4xl font-extrabold mb-2"
              style={{ color: type.color }}
            >
              {type.name}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">
              {type.nameJa}
            </p>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {type.subtitle}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              &ldquo;{type.catchphrase}&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                対象
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {type.target}
              </p>
            </div>

            <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                特徴
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {type.description}
              </p>
            </div>

            <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                キーワード
              </h2>
              <div className="flex flex-wrap gap-2">
                {type.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${type.color}15`,
                      color: type.color,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                  強み
                </h2>
                <ul className="space-y-2">
                  {type.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span style={{ color: type.color }}>●</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                  成長の方向性
                </h2>
                <ul className="space-y-2">
                  {type.growth.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-emerald-500">▸</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl border-2"
              style={{ borderColor: type.color, backgroundColor: `${type.colorLight}40` }}
            >
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                推奨する最初の一手
              </h2>
              <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                {type.firstStep}
              </p>
            </div>
          </motion.div>

          {/* Other types */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
              他のタイプ
            </h3>
            <div className="flex flex-wrap gap-3">
              {DIAGNOSIS_TYPES.filter((t) => t.id !== type.id).map((t) => (
                <button
                  key={t.id}
                  onClick={() => router.push(`/types/${t.id}`)}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all cursor-pointer"
                  style={{
                    color: t.color,
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
