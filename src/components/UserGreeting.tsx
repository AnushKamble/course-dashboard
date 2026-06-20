"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trophy, Flame } from "lucide-react";
import AvatarDisplay from "./AvatarDisplay";
import Link from "next/link";

interface Props {
  username: string;
  avatarUrl?: string | null;
}

export default function UserGreeting({ username, avatarUrl }: Props) {
  const [gamification, setGamification] = useState<any>(null);

  useEffect(() => {
    fetch("/api/gamification/profile")
      .then((r) => r.json())
      .then((d) => setGamification(d))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
        <AvatarDisplay url={avatarUrl} username={username} size={44} />
        <div className="flex-1">
          <p className="text-sm text-gray-500">Welcome back 👋</p>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">{username}</h2>
        </div>
        {gamification && (
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
              <Trophy size={12} />
              Lvl {gamification.level} · {gamification.xp} XP
            </div>
            {gamification.streak_count > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                <Flame size={12} />
                {gamification.streak_count}d
              </div>
            )}
          </div>
        )}
        <Link href="/playground" className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold hover:shadow-lg transition-all active:scale-95 shadow-md">
          <Sparkles size={14} />
          Playground
        </Link>
      </div>
    </div>
  );
}
