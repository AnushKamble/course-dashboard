"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Code, CheckCircle, XCircle, Clock, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { ProgressPieChart, ProgressBarChart } from "@/components/StudentProgressChart";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/auth/me");
      const { user } = await meRes.json();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const questionsRes = await fetch("/api/questions");
      const allQ = await questionsRes.json();

      const subsRes = await fetch("/api/submissions");
      const { submissions } = await subsRes.json();

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
      <div className="flex items-center gap-3 mb-8">
        <div className="gradient-primary rounded-2xl p-3 text-white shadow-lg shadow-emerald-500/20"><LayoutDashboard size={22} className="sm:w-6 sm:h-6" /></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Dashboard 📊</h1>
          <p className="text-xs sm:text-sm text-gray-500">{user?.username} &middot; Track your progress</p>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard
              icon={<Code size={18} />}
              gradient="gradient-primary"
              label="Total"
              value={stats.total_questions}
              sub="Questions"
            />
            <StatCard
              icon={<Clock size={18} />}
              gradient="gradient-accent"
              label="Attempted"
              value={stats.attempted}
              sub={`Of ${stats.total_questions}`}
            />
            <StatCard
              icon={<CheckCircle size={18} />}
              gradient="gradient-green"
              label="Correct"
              value={stats.correct}
              sub={stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) + "% rate" : "No attempts"}
            />
            <StatCard
              icon={<XCircle size={18} />}
              gradient="gradient-secondary"
              label="Incorrect"
              value={stats.incorrect}
              sub="Need review"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 animate-slide-up">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-500" />
                Progress Overview
              </h3>
              <ProgressPieChart correct={stats.correct} incorrect={stats.incorrect} pending={stats.attempted - stats.correct - stats.incorrect} notAttempted={stats.not_attempted} />
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 animate-slide-up">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-500" />
                Results Breakdown
              </h3>
              <ProgressBarChart correct={stats.correct} incorrect={stats.incorrect} pending={stats.attempted - stats.correct - stats.incorrect} notAttempted={stats.not_attempted} />
            </div>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 gradient-primary text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95 shadow-md">
            Continue Learning <ArrowRight size={18} />
          </Link>
        </>
      )}

      {stats && stats.total_questions === 0 && (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-emerald-200 shadow-lg">
          <div className="gradient-primary inline-flex rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/20 mb-4"><LayoutDashboard size={28} className="sm:w-8 sm:h-8" /></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Yet</h3>
          <p className="text-gray-500 text-sm">Questions will appear here once the instructor adds them. 🎓</p>
        </div>
      )}
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
