import { createAdminClient } from "@/lib/supabase-admin";
import LectureCard from "@/components/LectureCard";
import { Sparkles, Code, Rocket, BookOpen, Star, Zap } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import UserGreeting from "@/components/UserGreeting";
import ProjectDiscoverModal from "@/components/ProjectDiscoverModal";

export const dynamic = "force-dynamic";

function buildProgressMap(submissions: any[]): Map<string, number> {
  const map = new Map<string, Set<string>>();
  for (const s of submissions) {
    const lid = (s as any).questions?.lecture_id;
    if (!lid) continue;
    if (!map.has(lid)) map.set(lid, new Set());
    map.get(lid)!.add(s.question_id);
  }
  const result = new Map<string, number>();
  for (const [lid, set] of map) result.set(lid, set.size);
  return result;
}

export default async function Home() {
  const supabase = createAdminClient();
  const user = await getSessionUser();
  let profile: { avatar_url?: string | null } | null = null;
  let progressMap = new Map<string, number>();
  let questionCounts = new Map<string, number>();

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;

    const { data: subs } = await supabase
      .from("submissions")
      .select("question_id, questions!inner(lecture_id)")
      .eq("user_id", user.id);

    progressMap = buildProgressMap(subs || []);
  }

  const { data: allQuestions } = await supabase
    .from("questions")
    .select("lecture_id");

  for (const q of allQuestions || []) {
    questionCounts.set(q.lecture_id, (questionCounts.get(q.lecture_id) || 0) + 1);
  }

  const { data: lectures } = await supabase
    .from("lectures")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-200 opacity-70" />

        {/* Floating decorative elements */}
        <div className="absolute top-16 left-8 sm:top-24 sm:left-16 text-4xl sm:text-5xl opacity-20 animate-float hidden sm:block">🐍</div>
        <div className="absolute top-32 right-12 sm:top-40 sm:right-20 text-3xl sm:text-4xl opacity-20 animate-float-slow hidden sm:block">✨</div>
        <div className="absolute bottom-20 left-1/4 text-2xl sm:text-3xl opacity-15 animate-bounce-soft hidden sm:block">💻</div>
        <div className="absolute bottom-32 right-1/4 text-3xl sm:text-4xl opacity-15 animate-sparkle hidden sm:block">🔥</div>
        <div className="absolute top-1/3 left-3/4 text-2xl opacity-10 animate-float hidden sm:block">🚀</div>
        <div className="absolute top-1/2 left-1/5 text-2xl opacity-10 animate-wiggle hidden sm:block">⭐</div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-lg shadow-purple-500/10 border border-purple-200 rounded-full px-4 py-1.5 mb-6 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Interactive Python Course
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-slide-up">
            Master{" "}
            <span className="text-rainbow">
              Python
            </span>{" "}
            <br className="hidden sm:block" />
            <span className="text-gray-800">Programming</span>
          </h1>

          <p className="text-lg sm:text-2xl text-gray-500 max-w-2xl mx-auto mb-8 animate-slide-up leading-relaxed font-bold">
            by <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">Anush</span>
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 text-sm text-gray-500 mb-10 animate-slide-up">
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              <Code size={16} className="text-blue-500" />
              <span className="hidden sm:inline">Interactive</span> Editor
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              <Rocket size={16} className="text-orange-500" />
              <span className="hidden sm:inline">Hands-on</span> Practice
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              <Star size={16} className="text-yellow-500" />
              <span className="hidden sm:inline">Fun</span> Lessons
            </span>
          </div>
        </div>
      </section>

      {user && profile && (
        <UserGreeting username={user.username} avatarUrl={profile?.avatar_url} />
      )}
      {user && <ProjectDiscoverModal />}

      {/* Lectures section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-2 text-white shadow-lg shadow-blue-500/20">
              <BookOpen size={18} className="sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">Course Lectures</h2>
          </div>
          {lectures && (
            <span className="text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <Zap size={14} className="text-purple-500" />
              {lectures.length} lectures
            </span>
          )}
        </div>

        {lectures && lectures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {lectures.map((lecture, idx) => {
              const total = questionCounts.get(lecture.id) || 0;
              const attempted = progressMap.get(lecture.id) || 0;
              return (
                <LectureCard key={lecture.id} lecture={lecture} index={idx} progress={{ attempted, total }} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-200 shadow-lg shadow-purple-500/5">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 inline-flex rounded-2xl p-4 text-white shadow-lg shadow-orange-500/20 mb-4">
              <BookOpen size={28} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No Lectures Yet</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Lectures will appear here once added by the instructor. 🎓
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
