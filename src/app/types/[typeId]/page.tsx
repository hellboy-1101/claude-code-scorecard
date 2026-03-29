"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getTypeById, DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";
import Avatar from "@/components/Avatar";
import TraitBars, { getIdealTraits } from "@/components/TraitBars";
import TabContent, { type TabItem } from "@/components/TabContent";

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

  const idealTraits = getIdealTraits(type.id);
  const relatedTypes = DIAGNOSIS_TYPES.filter((t) => t.id !== type.id);

  const tabs: TabItem[] = [
    {
      value: "overview",
      label: "概要",
      content: (
        <div>
          <div className="mb-6 p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              対象
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {type.target}
            </p>
          </div>

          <div className="mb-6 p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              特徴
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {type.description}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              キーワード
            </h3>
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
        </div>
      ),
    },
    {
      value: "strengths",
      label: "強み・成長",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              強み
            </h3>
            <ul className="space-y-2">
              {type.strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span style={{ color: type.color }}>●</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              成長の方向性
            </h3>
            <ul className="space-y-2">
              {type.growth.map((g, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="text-emerald-500">▸</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      value: "setup",
      label: "推奨設定",
      content: (
        <div>
          <div
            className="p-5 rounded-xl border-2 mb-6"
            style={{
              borderColor: type.color,
              backgroundColor: `${type.colorLight}40`,
            }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              推奨する最初の一手
            </h3>
            <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
              {type.firstStep}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              理想プロファイル
            </h3>
            <TraitBars traits={idealTraits} color={type.color} />
          </div>
        </div>
      ),
    },
    {
      value: "related",
      label: "関連タイプ",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {relatedTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => router.push(`/types/${t.id}`)}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-transparent transition-all text-left cursor-pointer"
              style={
                {
                  "--hover-shadow": `0 8px 24px ${t.color}20`,
                } as React.CSSProperties
              }
            >
              <Avatar type={t.id} size="sm" />
              <div>
                <span
                  className="block text-base font-bold"
                  style={{ color: t.color }}
                >
                  {t.name}
                </span>
                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {t.nameJa} — {t.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      ),
    },
  ];

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
        {/* Dark Hero — type color gradient background */}
        <section
          className="relative"
          style={{
            background: `linear-gradient(135deg, ${type.color}, ${type.colorDark})`,
          }}
        >
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-white/20 p-3">
                  <Avatar type={type.id} size="lg" className="mx-auto" />
                </div>
              </div>
              <h1 className="text-4xl font-extrabold mb-2 text-white">
                {type.name}
              </h1>
              <p className="text-lg text-white/80 mb-1">{type.nameJa}</p>
              <p className="text-xl font-medium text-white/90 mb-3">
                {type.subtitle}
              </p>
              <p className="text-sm text-white/60 italic">
                &ldquo;{type.catchphrase}&rdquo;
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* TraitBars — ideal profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 max-w-md mx-auto"
          >
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 text-center">
              理想プロファイル
            </h3>
            <TraitBars traits={idealTraits} color={type.color} />
          </motion.div>

          {/* Tab layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TabContent
              tabs={tabs}
              defaultValue="overview"
              color={type.color}
            />
          </motion.div>
        </div>
      </main>
    </>
  );
}
