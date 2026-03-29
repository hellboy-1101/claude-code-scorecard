"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { DiagnosisType } from "@/lib/diagnosis-types";
import type { DiagnosisResult } from "@/lib/quiz-data";
import type { TypeRelativeResult } from "@/lib/scorer";
import type { AlignmentPattern } from "@/lib/gap-analysis";
import { getTypeReference } from "@/lib/type-references";
import Avatar from "./Avatar";
import TraitBars, { deriveTraitsFromScores } from "./TraitBars";

interface ResultHeroProps {
  primaryType: DiagnosisType;
  secondaryType: DiagnosisType | null;
  diagnosisResult: DiagnosisResult;
  typeRelative?: TypeRelativeResult | null;
  alignmentPattern?: AlignmentPattern;
  alignmentMessage?: string;
}

export default function ResultHero({
  primaryType,
  secondaryType,
  diagnosisResult,
  typeRelative,
  alignmentPattern,
  alignmentMessage,
}: ResultHeroProps) {
  const ref = getTypeReference(primaryType.id);
  const shouldReduceMotion = useReducedMotion();
  const traits = deriveTraitsFromScores(diagnosisResult.scores);

  return (
    <div>
      {/* Gradient hero section */}
      <motion.section
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
        className="relative -mx-4 px-4 py-12 sm:py-16 text-center overflow-hidden rounded-b-3xl"
        style={{
          background: `linear-gradient(135deg, ${primaryType.color}, ${primaryType.colorDark})`,
        }}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="rounded-full bg-white/20 p-3">
            <Avatar type={primaryType.id} size="lg" />
          </div>
        </motion.div>

        {/* Type name — white text on gradient */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-white/70 mb-1">あなたのタイプ</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-white">
            {primaryType.name}
          </h1>
          <p className="text-lg text-white/80 mb-1">{primaryType.nameJa}</p>
          <p className="text-xl font-medium text-white/90 mb-3">
            {primaryType.subtitle}
          </p>

          {/* Type-relative score badge */}
          {typeRelative && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/15 backdrop-blur-sm mb-4"
            >
              <span className="text-sm text-white/70">
                {primaryType.name} としての達成度:
              </span>
              <AnimatedScore
                target={typeRelative.score}
                reduceMotion={!!shouldReduceMotion}
              />
              <span className="text-lg text-white/50">/100</span>
              <span className="text-lg font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                {typeRelative.grade}
              </span>
            </motion.div>
          )}

          {/* Type ideal description */}
          {ref && (
            <p className="text-sm text-white/60 italic max-w-lg mx-auto mb-3">
              このタイプの理想像: {ref.description}
            </p>
          )}

          <p className="text-sm text-white/60 italic">
            &ldquo;{primaryType.catchphrase}&rdquo;
          </p>

          {/* Alignment pattern banner */}
          {alignmentPattern && alignmentMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-5 py-2.5 rounded-xl text-sm font-medium mt-4 bg-white/15 backdrop-blur-sm text-white"
            >
              {alignmentMessage}
            </motion.div>
          )}

          {/* Sub type badge */}
          {secondaryType && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-sm text-white">
              <span className="text-white/70">副タイプ:</span>
              <span className="font-semibold">{secondaryType.name}</span>
              <span className="text-white/70">
                ({secondaryType.nameJa})
              </span>
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* TraitBars — main visualization below hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 max-w-md mx-auto"
      >
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 text-center">
          特性プロファイル
        </h3>
        <TraitBars traits={traits} color={primaryType.color} />
      </motion.div>
    </div>
  );
}

function AnimatedScore({
  target,
  reduceMotion,
}: {
  target: number;
  reduceMotion: boolean;
}) {
  const [display, setDisplay] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(target);
      return;
    }
    let frame: number;
    const duration = 800;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, reduceMotion]);

  return (
    <span className="text-3xl font-extrabold tabular-nums text-white">
      {display}
    </span>
  );
}
