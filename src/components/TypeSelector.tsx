"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DIAGNOSIS_TYPES, type DiagnosisType } from "@/lib/diagnosis-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Avatar from "./Avatar";
import TypeRadarChart from "./TypeRadarChart";

interface TypeSelectorProps {
  inferredType: string;
  scores: Record<string, number>;
  onSelect: (typeId: string) => void;
  onBack: () => void;
}

export default function TypeSelector({
  inferredType,
  scores,
  onSelect,
  onBack,
}: TypeSelectorProps) {
  const [selectedId, setSelectedId] = useState(inferredType);
  const selectedType = DIAGNOSIS_TYPES.find((t) => t.id === selectedId);
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-8">
      {/* Hero: selected type */}
      {selectedType && (
        <motion.div
          key={selectedId}
          {...motionProps}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <Avatar type={selectedId} size="md" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            {selectedId === inferredType
              ? "あなたの志向タイプ"
              : "選択したタイプ"}
          </p>
          <h2
            className="text-3xl font-extrabold tracking-tight mb-1"
            style={{ color: selectedType.color }}
          >
            {selectedType.name}
          </h2>
          <p className="text-lg text-muted-foreground mb-1">
            {selectedType.nameJa}
          </p>
          <p className="text-sm text-muted-foreground italic mb-4">
            &ldquo;{selectedType.catchphrase}&rdquo;
          </p>

          {/* Radar chart */}
          <div className="max-w-xs mx-auto mb-6">
            <TypeRadarChart scores={scores} />
          </div>
        </motion.div>
      )}

      {/* 6 type cards */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
          タイプを変更する場合はタップ
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="タイプ選択">
          {DIAGNOSIS_TYPES.map((type) => (
            <TypeCard
              key={type.id}
              type={type}
              isSelected={type.id === selectedId}
              isInferred={type.id === inferredType}
              onSelect={() => setSelectedId(type.id)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onBack}>
          戻る
        </Button>
        <Button
          onClick={() => onSelect(selectedId)}
          style={{
            backgroundColor: selectedType?.color,
            borderColor: selectedType?.color,
          }}
          className="text-white hover:opacity-90"
        >
          このタイプで診断する
        </Button>
      </div>
    </div>
  );
}

function TypeCard({
  type,
  isSelected,
  isInferred,
  onSelect,
}: {
  type: DiagnosisType;
  isSelected: boolean;
  isInferred: boolean;
  onSelect: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <Card
      role="radio"
      aria-checked={isSelected}
      aria-label={`${type.name}（${type.nameJa}）`}
      tabIndex={0}
      className={`cursor-pointer transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
        isSelected
          ? "ring-2 shadow-md"
          : "hover:border-muted-foreground/30"
      }`}
      style={isSelected ? { borderColor: type.color, boxShadow: `0 0 0 2px ${type.color}` } : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="flex items-start gap-3 p-4 min-h-[44px]">
        <Avatar type={type.id} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="font-bold text-sm"
              style={{ color: type.color }}
            >
              {type.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {type.nameJa}
            </span>
            {isInferred && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                推定
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {type.subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
