"use client";

import { useState } from "react";
import { INTEREST_OPTIONS } from "@/lib/quiz-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDot, Circle } from "lucide-react";

interface InterestSelectorProps {
  onSelect: (interestId: string) => void;
  onBack: () => void;
}

export default function InterestSelector({
  onSelect,
  onBack,
}: InterestSelectorProps) {
  const [selected, setSelected] = useState<string>("");

  const handleKeyDown = (optionId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(optionId);
    }
  };

  return (
    <div className="space-y-6" role="radiogroup" aria-label="関心領域の選択">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          今最も改善したい・知りたい領域は？
        </h3>
        <p className="text-sm text-muted-foreground">
          回答に応じて、改善提案の優先順位が変わります
        </p>
      </div>

      <div className="space-y-2">
        {INTEREST_OPTIONS.map((option) => (
          <Card
            key={option.id}
            role="radio"
            aria-checked={selected === option.id}
            tabIndex={0}
            className={`cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
              selected === option.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-muted-foreground/30"
            }`}
            onClick={() => setSelected(option.id)}
            onKeyDown={(e) => handleKeyDown(option.id, e)}
          >
            <CardContent className="flex items-center gap-3 p-3 min-h-[44px]">
              {selected === option.id ? (
                <CircleDot className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              )}
              <span className="text-sm">{option.text}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onBack}>
          戻る
        </Button>
        <Button
          onClick={() => onSelect(selected || "general")}
          disabled={!selected}
        >
          次へ
        </Button>
      </div>
    </div>
  );
}
