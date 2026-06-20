"use client";

import { useEffect, useState } from "react";
import { Flame, Zap } from "lucide-react";

export default function StreakIndicator({ streak, className = "" }: { streak: number; className?: string }) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(true);
    const t = setTimeout(() => setBounce(false), 500);
    return () => clearTimeout(t);
  }, [streak]);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Flame
        size={16}
        className={`${streak > 0 ? "text-orange-500" : "text-gray-400"} ${bounce ? "animate-bounce" : ""}`}
      />
      <span className={`text-xs font-bold ${streak > 0 ? "text-orange-600" : "text-gray-500"}`}>
        {streak > 0 ? `${streak} day streak` : "Start your streak!"}
      </span>
      {streak >= 7 && <Zap size={12} className="text-yellow-500" />}
    </div>
  );
}
