"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = "コピー", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label="クリップボードにコピー"
      className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 cursor-pointer
        ${copied
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/10 hover:border-white/20"
        } ${className}`}
    >
      {copied ? "コピーしました" : label}
    </button>
  );
}
