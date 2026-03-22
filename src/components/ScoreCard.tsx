"use client";

import { useState } from "react";
import type { CategoryScore, ItemScore } from "@/lib/types";

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500/10";
  if (score >= 60) return "bg-amber-500/10";
  return "bg-red-500/10";
}

function ItemRow({ item }: { item: ItemScore }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 cursor-pointer group"
      >
        <div className="flex-1 text-left">
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
            {item.name}
          </span>
        </div>
        <span className={`text-sm font-bold tabular-nums ${getScoreTextColor(item.score)}`}>
          {item.score}
        </span>
        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${getScoreColor(item.score)}`}
            style={{ width: `${item.score}%` }}
          />
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="mt-2 pl-2 space-y-1">
          {item.details.map((d, i) => (
            <div key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
              <span className="mt-0.5 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScoreCard({ categories }: { categories: CategoryScore[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {categories.map((cat, idx) => (
        <div
          key={cat.name}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                {cat.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(cat.average)} ${getScoreTextColor(cat.average)}`}>
                {cat.average}/100
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {openIndex === idx && (
            <div className="px-4 pb-4">
              {cat.items.map((item) => (
                <ItemRow key={item.name} item={item} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
