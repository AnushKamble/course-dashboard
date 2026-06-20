"use client";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at?: string;
}

export default function BadgeGrid({ earned, all }: { earned: Badge[]; all: Badge[] }) {
  const earnedIds = new Set(earned.map((b) => b.id));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {all.map((badge) => {
        const isEarned = earnedIds.has(badge.id);
        const earnedBadge = earned.find((b) => b.id === badge.id);
        return (
          <div
            key={badge.id}
            className={`relative rounded-2xl p-3 sm:p-4 text-center border-2 transition-all ${
              isEarned
                ? "bg-white border-amber-200 shadow-md hover:shadow-lg hover:-translate-y-1"
                : "bg-gray-50 border-gray-100 opacity-50"
            }`}
            title={badge.description}
          >
            <span className={`text-2xl sm:text-3xl block mb-1 ${isEarned ? "" : "grayscale"}`}>
              {badge.icon}
            </span>
            <p className={`text-xs font-bold ${isEarned ? "text-gray-800" : "text-gray-400"}`}>
              {badge.name}
            </p>
            {isEarned && earnedBadge?.earned_at && (
              <p className="text-[10px] text-amber-600 mt-0.5 font-semibold">
                {new Date(earnedBadge.earned_at).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
