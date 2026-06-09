"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  correct: "#10B981",
  incorrect: "#F43F5E",
  pending: "#FBBF24",
  not_attempted: "#E5E7EB",
};

interface Props {
  correct: number;
  incorrect: number;
  pending: number;
  notAttempted: number;
}

export function ProgressPieChart({ correct, incorrect, pending, notAttempted }: Props) {
  const data = [
    { name: "Correct", value: correct, color: COLORS.correct },
    { name: "Incorrect", value: incorrect, color: COLORS.incorrect },
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "Not Attempted", value: notAttempted, color: COLORS.not_attempted },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProgressBarChart({ correct, incorrect, pending }: Props) {
  const data = [
    { name: "Correct", count: correct, color: COLORS.correct },
    { name: "Incorrect", count: incorrect, color: COLORS.incorrect },
    { name: "Pending", count: pending, color: COLORS.pending },
  ].filter((d) => d.count > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
        <YAxis tick={{ fontSize: 13 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
