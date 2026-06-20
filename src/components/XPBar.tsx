import { Trophy, Flame, Star, Zap } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
  xpToNextLevel: number;
  streakCount: number;
}

export default function XPBar({ xp, level, xpToNextLevel, streakCount }: XPBarProps) {
  const progress = Math.min((xp / xpToNextLevel) * 100, 100);
  const xpInLevel = xp;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-2 text-white shadow-lg">
            <Trophy size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Level</span>
            <p className="text-lg font-extrabold text-gray-800 -mt-0.5">{level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-gray-700">{streakCount} day{streakCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-semibold">{xpInLevel} / {xpToNextLevel} XP</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {streakCount >= 3 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full w-fit">
          <Star size={12} />
          {streakCount >= 30 ? "Legendary" : streakCount >= 7 ? "On Fire!" : "Getting Started"} streak!
        </div>
      )}
    </div>
  );
}
