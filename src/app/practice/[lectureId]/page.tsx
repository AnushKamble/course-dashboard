import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, FileText } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";

export const dynamic = "force-dynamic";

export default async function PracticeListPage({
  params,
}: {
  params: Promise<{ lectureId: string }>;
}) {
  const { lectureId } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?redirect=/practice/${lectureId}`);

  const supabase = createAdminClient();
  const { data: lecture } = await supabase
    .from("lectures")
    .select("*")
    .eq("id", lectureId)
    .single();

  if (!lecture) notFound();

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("lecture_id", lectureId)
    .order("order_index", { ascending: true });

  let submissions: Record<string, any> = {};
  if (questions) {
    const { data: subs } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", user.id)
      .in("question_id", questions.map((q: any) => q.id));

    if (subs) {
      for (const sub of subs) {
        if (!submissions[sub.question_id] || new Date(sub.submitted_at) > new Date(submissions[sub.question_id].submitted_at)) {
          submissions[sub.question_id] = sub;
        }
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href={`/lectures/${lectureId}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Lecture
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8 animate-slide-up">
        <div className="gradient-secondary h-3" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="gradient-secondary rounded-xl p-2 sm:p-2.5 text-white shadow-lg shadow-emerald-500/20"><BookOpen size={18} className="sm:w-5 sm:h-5" /></div>
            <span className="text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-orange-500 bg-clip-text text-transparent">Lecture {lecture.order_index}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Practice: {lecture.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Solve these coding exercises to test your understanding. 💪</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {lecture.pdf_url && (
              <a href={lecture.pdf_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 rounded-full font-bold text-xs sm:text-sm transition-all border border-amber-200 hover:border-amber-300 hover:shadow-lg active:scale-95 shadow-md">
                <FileText size={16} />
                Download Notes 📄
              </a>
            )}
          </div>
        </div>
      </div>

      {questions && questions.length > 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {questions.map((q: any) => (
            <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${(q.order_index || 0) * 0.08}s` } as React.CSSProperties}>
              <QuestionCard question={q} lectureId={lectureId} submission={submissions[q.id]} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-emerald-200 shadow-lg">
          <div className="gradient-secondary inline-flex rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/20 mb-4"><BookOpen size={28} className="sm:w-8 sm:h-8" /></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Yet</h3>
          <p className="text-gray-500 text-sm">Practice questions will be added soon by the instructor. 🎓</p>
        </div>
      )}
    </div>
  );
}

