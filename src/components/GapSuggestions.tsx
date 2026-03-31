"use client";

import { useState } from "react";
import type { GapSuggestion } from "@/lib/gap-analysis";
import CopyButton from "./CopyButton";

interface GapSuggestionsProps {
  suggestions: GapSuggestion[];
}

const TYPE_CONFIG: Record<string, { label: string; bgClass: string; borderClass: string; textClass: string; icon: string }> = {
  knowledge: {
    label: "知らなかった機能",
    bgClass: "bg-blue-50 dark:bg-blue-900/20",
    borderClass: "border-blue-200 dark:border-blue-800",
    textClass: "text-blue-700 dark:text-blue-300",
    icon: "💡",
  },
  interest: {
    label: "関心領域に基づく提案",
    bgClass: "bg-amber-50 dark:bg-amber-900/20",
    borderClass: "border-amber-200 dark:border-amber-800",
    textClass: "text-amber-700 dark:text-amber-300",
    icon: "🎯",
  },
  environment: {
    label: "環境の改善点",
    bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    textClass: "text-emerald-700 dark:text-emerald-300",
    icon: "🔧",
  },
};

export default function GapSuggestions({ suggestions }: GapSuggestionsProps) {
  const [expandedType, setExpandedType] = useState<string | null>("knowledge");

  const grouped: Record<string, GapSuggestion[]> = {
    knowledge: suggestions.filter((s) => s.type === "knowledge"),
    interest: suggestions.filter((s) => s.type === "interest"),
    environment: suggestions.filter((s) => s.type === "environment"),
  };

  if (suggestions.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-center">
        <p className="text-emerald-700 dark:text-emerald-400 font-medium">
          改善提案はありません。このタイプの理想形に近い環境です！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(["knowledge", "interest", "environment"] as const).map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;
        const config = TYPE_CONFIG[type];
        const isExpanded = expandedType === type;

        return (
          <div
            key={type}
            className={`rounded-xl border ${config.borderClass} ${config.bgClass} overflow-hidden`}
          >
            <button
              onClick={() => setExpandedType(isExpanded ? null : type)}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{config.icon}</span>
                <span className={`font-semibold ${config.textClass}`}>
                  {config.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({items.length}件)
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg relative">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed whitespace-pre-wrap pr-10">
                        {item.prompt}
                      </pre>
                      <div className="absolute top-2 right-2">
                        <CopyButton text={item.prompt} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
