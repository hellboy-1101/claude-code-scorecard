"use client";

import { useState, useEffect } from "react";
import { DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";

const STORAGE_KEY = "scorecard_social_proof";

interface SocialProofData {
  total: number;
  types: Record<string, number>;
}

function loadData(): SocialProofData {
  if (typeof window === "undefined") {
    return { total: 0, types: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SocialProofData;
  } catch {
    // corrupted data — reset
  }
  return { total: 0, types: {} };
}

/** Record a new diagnosis result into localStorage stats. */
export function recordDiagnosis(typeId: string): void {
  const data = loadData();
  data.total += 1;
  data.types[typeId] = (data.types[typeId] ?? 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface SocialProofProps {
  className?: string;
}

export default function SocialProof({ className }: SocialProofProps) {
  const [data, setData] = useState<SocialProofData | null>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data || data.total === 0) return null;

  const topTypes = DIAGNOSIS_TYPES.map((t) => ({
    ...t,
    count: data.types[t.id] ?? 0,
  }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400 ${className ?? ""}`}
    >
      <span className="font-medium">
        {data.total.toLocaleString()}回 診断済み
      </span>
      {topTypes.length > 0 && (
        <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
          |
        </span>
      )}
      <div className="flex items-center gap-3">
        {topTypes.slice(0, 4).map((t) => {
          const pct = Math.round((t.count / data.total) * 100);
          return (
            <div key={t.id} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-xs">
                {t.nameJa} {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
