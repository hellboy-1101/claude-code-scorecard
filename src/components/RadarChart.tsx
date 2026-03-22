"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { CategoryScore } from "@/lib/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  categories: CategoryScore[];
}

export default function RadarChart({ categories }: RadarChartProps) {
  const data = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: "スコア",
        data: categories.map((c) => c.average),
        backgroundColor: "rgba(232, 121, 89, 0.2)",
        borderColor: "rgba(232, 121, 89, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(232, 121, 89, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: { size: 10 },
          backdropColor: "transparent",
          color: "#9ca3af",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
        angleLines: {
          color: "rgba(156, 163, 175, 0.2)",
        },
        pointLabels: {
          font: { size: 12, weight: 600 as const },
          color: "#d1d5db",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: { raw: unknown }) => `${context.raw}点`,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
