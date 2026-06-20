"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

export default function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gamification/profile")
      .then((r) => r.json())
      .then((d) => setStreak(d.streak_count || 0))
      .catch(() => {});
  }, []);

  if (streak === null || streak === 0) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/20 text-orange-200 text-xs font-bold">
      <Flame size={12} />
      {streak}
    </div>
  );
}
