import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, FileText, Code, BookOpen, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LecturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?redirect=/lectures/${id}`);

  const supabase = createAdminClient();
  const { data: lecture } = await supabase
    .from("lectures")
    .select("*")
    .eq("id", id)
    .single();

  if (!lecture) notFound();

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("lecture_id", id)
    .order("order_index", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Lectures
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
        <div className="gradient-primary h-3" />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Lecture {lecture.order_index}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">{lecture.title}</h1>
              {lecture.description && <p className="text-gray-600 mt-2 text-sm sm:text-base">{lecture.description}</p>}
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-3 sm:p-4 text-white shadow-lg shadow-purple-500/20 hidden sm:block">
              <BookOpen size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {lecture.pdf_url && (
              <a href={lecture.pdf_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 rounded-full font-bold text-sm transition-all border border-amber-200 hover:border-amber-300 hover:shadow-lg hover:scale-105 active:scale-95 shadow-md">
                <FileText size={18} />
                Download Notes (PDF) 📄
              </a>
            )}
            <Link href={`/practice/${lecture.id}`}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 gradient-primary text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 shadow-md">
              <Code size={18} />
              {questions && questions.length > 0 ? "Practice Questions" : "Start Practicing"}
            </Link>
          </div>
        </div>
      </div>

      {questions && questions.length > 0 && (
        <div className="mt-8 sm:mt-10">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-500" />
            Practice Questions
          </h2>
          <div className="grid gap-3">
            {questions.map((q: any) => (
              <Link key={q.id} href={`/practice/${lecture.id}/${q.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-md border border-gray-100 card-hover group">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-2 sm:p-2.5 text-white shadow-lg group-hover:scale-110 transition-transform shrink-0"><Code size={16} className="sm:w-[18px] sm:h-[18px]" /></div>
                <div className="min-w-0">
                  <span className="text-sm sm:text-base font-bold text-gray-800">{q.title}</span>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{q.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

