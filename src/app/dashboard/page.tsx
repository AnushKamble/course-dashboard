"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Code, CheckCircle, XCircle, Clock,
  Loader2, ArrowRight, Sparkles, Trophy, Gamepad2, Flame,
} from "lucide-react";
import { ProgressPieChart, ProgressBarChart } from "@/components/StudentProgressChart";
import ProfilePhoto from "@/components/ProfilePhoto";
import XPBar from "@/components/XPBar";
import BadgeGrid from "@/components/BadgeGrid";
import ConfettiOverlay from "@/components/ConfettiOverlay";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [gamification, setGamification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState<"levelup" | "badge" | "correct">("correct");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/auth/me");
      const { user: userData } = await meRes.json();
      if (!userData) { router.push("/login"); return; }
      setUser(userData);
      setAvatarUrl(userData.avatar_url || null);

      // Record daily visit
      fetch("/api/gamification/record-daily", { method: "POST" }).catch(() => {});

      const [questionsRes, subsRes, gamiRes] = await Promise.all([
        fetch("/api/questions"),
        fetch("/api/submissions"),
        fetch("/api/gamification/profile"),
      ]);

      const allQ = await questionsRes.json();
      const { submissions } = await subsRes.json();
      const gami = await gamiRes.json();

      setGamification(gami);

      const questions = allQ.questions || [];
      const attempted = submissions?.length || 0;
      const correct = submissions?.filter((s: any) => s.status === "correct").length || 0;
      const incorrect = submissions?.filter((s: any) => s.status === "incorrect").length || 0;
      const pending = submissions?.filter((s: any) => s.status === "submitted").length || 0;
      const notAttempted = questions.length - attempted;

      setStats({
        total_questions: questions.length,
        attempted,
        correct,
        incorrect,
        not_attempted: Math.max(0, notAttempted),
      });

      setLoading(false);
    })();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-4 mb-8">
        <ProfilePhoto avatarUrl={avatarUrl} username={user?.username || ""} size={52} onUpdate={setAvatarUrl} />
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Dashboard 📊</h1>
          <p className="text-xs sm:text-sm text-gray-500">{user?.username} &middot; Track your progress</p>
        </div>
        <Link href="/leaderboard" className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold hover:shadow-lg transition-all active:scale-95 shadow-md">
          <Trophy size={14} />
          Leaderboard
        </Link>
      </div>

      {/* XP + Streak + Level section */}
      {gamification && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="sm:col-span-2">
            <XPBar
              xp={gamification.xp}
              level={gamification.level}
              xpToNextLevel={gamification.xp_to_next_level}
              streakCount={gamification.streak_count}
            />
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm">
              <Gamepad2 size={16} className="text-purple-500" />
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link href="/playground" className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-purple-50 rounded-xl text-sm font-semibold text-gray-700 hover:text-purple-700 transition-all">
                <Sparkles size={15} className="text-purple-500" />
                Playground
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-amber-50 rounded-xl text-sm font-semibold text-gray-700 hover:text-amber-700 transition-all sm:hidden">
                <Trophy size={15} className="text-amber-500" />
                Leaderboard
              </Link>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700">
                <Flame size={15} className="text-orange-500" />
                <span>{gamification.streak_count > 0 ? `${gamification.streak_count}-day streak` : "No streak yet"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badges section */}
      {gamification?.all_badges && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            Badges ({gamification.earned_badges.length}/{gamification.all_badges.length})
          </h3>
          <BadgeGrid earned={gamification.earned_badges} all={gamification.all_badges} />
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard icon={<Code size={18} />} gradient="bg-gradient-to-br from-blue-500 to-cyan-500" label="Total" value={stats.total_questions} sub="Questions" />
            <StatCard icon={<Clock size={18} />} gradient="bg-gradient-to-br from-orange-500 to-amber-500" label="Attempted" value={stats.attempted} sub={`Of ${stats.total_questions}`} />
            <StatCard icon={<CheckCircle size={18} />} gradient="bg-gradient-to-br from-emerald-500 to-green-500" label="Correct" value={stats.correct} sub={stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) + "% rate" : "No attempts"} />
            <StatCard icon={<XCircle size={18} />} gradient="bg-gradient-to-br from-rose-500 to-pink-500" label="Incorrect" value={stats.incorrect} sub="Need review" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 animate-slide-up">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={16} className="text-blue-500" />Progress Overview</h3>
              <ProgressPieChart correct={stats.correct} incorrect={stats.incorrect} pending={stats.attempted - stats.correct - stats.incorrect} notAttempted={stats.not_attempted} />
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 animate-slide-up">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={16} className="text-purple-500" />Results Breakdown</h3>
              <ProgressBarChart correct={stats.correct} incorrect={stats.incorrect} pending={stats.attempted - stats.correct - stats.incorrect} notAttempted={stats.not_attempted} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-95 shadow-md">
              Continue Learning <ArrowRight size={18} />
            </Link>
            <Link href="/playground" className="inline-flex items-center gap-2 bg-white border-2 border-purple-200 text-purple-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base hover:shadow-lg hover:border-purple-300 transition-all active:scale-95 shadow-md">
              <Sparkles size={18} /> Playground
            </Link>
          </div>
        </>
      )}

      {stats && stats.total_questions === 0 && (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-blue-200 shadow-lg">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 inline-flex rounded-2xl p-4 text-white shadow-lg shadow-blue-500/20 mb-4"><LayoutDashboard size={28} className="sm:w-8 sm:h-8" /></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Yet</h3>
          <p className="text-gray-500 text-sm">Questions will appear here once the instructor adds them. 🎓</p>
        </div>
      )}

      {showConfetti && <ConfettiOverlay fire={showConfetti} type={confettiType} />}
    </div>
  );
}

function StatCard({ icon, gradient, label, value, sub }: any) {
  return (
    <div className={`${gradient} rounded-2xl p-4 sm:p-5 shadow-lg text-white card-hover`}>
      <div className="flex items-center gap-2 text-white/80 mb-2">
        <span className="bg-white/20 rounded-lg p-1.5">{icon}</span>
        <span className="text-xs sm:text-sm font-bold">{label}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-white/70 mt-0.5">{sub}</p>
    </div>
  );
}
