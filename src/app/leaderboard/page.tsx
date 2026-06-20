"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Medal, ArrowLeft, Loader2 } from "lucide-react";
import AvatarDisplay from "@/components/AvatarDisplay";

interface Leader {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak_count: number;
  avatar_url: string | null;
}

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [meRes, lbRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/gamification/leaderboard"),
      ]);
      const { user } = await meRes.json();
      const { leaders: data } = await lbRes.json();
      setCurrentUser(user?.id || null);
      setLeaders(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 mb-6 transition-colors">
        <ArrowLeft size={16} />Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-3 text-white shadow-lg shadow-amber-500/20"><Trophy size={22} className="sm:w-6 sm:h-6" /></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Leaderboard 🏆</h1>
          <p className="text-xs sm:text-sm text-gray-500">Top Pythonistas this week</p>
        </div>
      </div>

      {leaders.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {leaders.map((student, i) => {
            const isMe = student.id === currentUser;
            return (
              <div
                key={student.id}
                className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-50 last:border-0 transition-all ${
                  isMe ? "bg-gradient-to-r from-emerald-50/80 to-green-50/80 ring-2 ring-emerald-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-8 text-center shrink-0">
                  {i < 3 ? (
                    <span className="text-xl">{medals[i]}</span>
                  ) : (
                    <span className="text-sm font-extrabold text-gray-400">#{i + 1}</span>
                  )}
                </div>

                <AvatarDisplay url={student.avatar_url} username={student.username} size={36} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate flex items-center gap-2">
                    {student.username}
                    {isMe && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-xs text-gray-400">Level {student.level}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-gray-800">{student.xp} XP</p>
                  <p className="text-xs text-gray-400">🔥 {student.streak_count}d</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-amber-200 shadow-lg">
          <Trophy size={48} className="mx-auto text-amber-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No rankings yet</h3>
          <p className="text-gray-500 text-sm">Start practicing to appear on the leaderboard! 🚀</p>
        </div>
      )}
    </div>
  );
}
