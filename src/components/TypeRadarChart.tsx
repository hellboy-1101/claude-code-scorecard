"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { DIAGNOSIS_TYPES } from "@/lib/diagnosis-types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface TypeRadarChartProps {
  scores: Record<string, number>;
}

export default function TypeRadarChart({ scores }: TypeRadarChartProps) {
  const labels = DIAGNOSIS_TYPES.map((t) => t.name);
  const values = DIAGNOSIS_TYPES.map((t) => scores[t.id] || 0);
  const maxVal = Math.max(...values, 1);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "rgba(218, 91, 56, 0.15)",
        borderColor: "rgba(218, 91, 56, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: DIAGNOSIS_TYPES.map((t) => t.color),
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: maxVal + 2,
        ticks: {
          display: false,
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
        angleLines: {
          color: "rgba(156, 163, 175, 0.2)",
        },
        pointLabels: {
          color: "rgb(156, 163, 175)",
          font: { size: 13, weight: 600 as const },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => `${ctx.raw}pt`,
        },
      },
      legend: { display: false },
    },
  };

  return <Radar data={data} options={options} />;
}
