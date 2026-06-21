import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, CheckSquare, CheckCircle, XCircle, Code } from "lucide-react";
import AvatarDisplay from "@/components/AvatarDisplay";

export const dynamic = "force-dynamic";

async function SubmissionsList() {
  const supabase = createAdminClient();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, questions(title), profiles!inner(username, avatar_url)")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false });

  const markSubmission = async (subId: string, status: string) => {
    "use server";
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") return;
    const supabase = createAdminClient();

    const { data: sub } = await supabase
      .from("submissions")
      .select("user_id, status, xp_awarded")
      .eq("id", subId)
      .single();
    if (!sub) return;

    const alreadyAwarded = sub.xp_awarded === true;
    const updateFields: Record<string, any> = { status, reviewed_at: new Date().toISOString() };
    if (status === "correct" && !alreadyAwarded) updateFields.xp_awarded = true;

    await supabase.from("submissions").update(updateFields).eq("id", subId);

    if (status === "correct" && !alreadyAwarded) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("xp, level")
        .eq("id", sub.user_id)
        .single();

      const bonusXp = 25;
      const newXp = (profile?.xp || 0) + bonusXp;
      const currentLevel = profile?.level || 1;
      if (newXp >= currentLevel * 100) {
        await supabase
          .from("profiles")
          .update({ xp: newXp, level: currentLevel + 1 })
          .eq("id", sub.user_id);
      } else {
        await supabase.from("profiles").update({ xp: newXp }).eq("id", sub.user_id);
      }
    }

    revalidatePath("/admin/submissions");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 mb-6 transition-colors"><ArrowLeft size={16} />Back to Admin</Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-3 text-white shadow-lg shadow-orange-500/20"><CheckSquare size={22} className="sm:w-6 sm:h-6" /></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Review Submissions ✅</h1>
          <p className="text-xs sm:text-sm text-gray-500">{submissions?.length || 0} pending</p>
        </div>
      </div>

      {submissions && submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map((sub: any) => (
            <div key={sub.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-hover">
              <SubmissionRow sub={sub} markSubmission={markSubmission} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-green-200 shadow-lg">
          <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">All Caught Up! 🎉</h3>
          <p className="text-gray-500 text-sm">No pending submissions to review.</p>
        </div>
      )}
    </div>
  );
}

async function SubmissionRow({ sub, markSubmission }: { sub: any; markSubmission: (id: string, status: string) => Promise<void> }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <AvatarDisplay url={sub.profiles?.avatar_url} username={sub.profiles?.username || "Unknown"} size={24} />
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {sub.profiles?.username || "Unknown"}
            </span>
            <span className="text-sm text-gray-300">&rarr;</span>
            <span className="text-sm font-semibold text-gray-700">{sub.questions?.title || "Unknown"}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Submitted {new Date(sub.submitted_at).toLocaleString()}
          </p>
        </div>

        <details className="group">
          <summary className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 cursor-pointer list-none transition-colors">
            <Code size={14} />
            View Code
          </summary>
          <div className="mt-3 bg-gray-900 rounded-xl overflow-hidden shadow-xl">
            <pre className="p-4 text-[13px] font-mono text-green-300 overflow-x-auto whitespace-pre-wrap max-h-[300px] overflow-y-auto leading-relaxed">
              {sub.code || "(no code)"}
            </pre>
            {sub.output && (
              <>
                <div className="border-t border-gray-700 px-4 py-1.5 bg-gradient-to-r from-emerald-900/30 to-transparent">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase">Output</span>
                </div>
                <pre className="px-4 pb-3 text-[13px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {sub.output}
                </pre>
              </>
            )}
          </div>
        </details>

        <div className="flex items-center gap-2 sm:ml-auto shrink-0 mt-2 sm:mt-0">
          <form action={markSubmission.bind(null, sub.id, "correct")}>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 text-sm font-bold rounded-full transition-all border border-emerald-200 hover:border-emerald-300 hover:shadow-lg active:scale-95 shadow-md">
              <CheckCircle size={16} /> Correct
            </button>
          </form>
          <form action={markSubmission.bind(null, sub.id, "incorrect")}>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-700 text-sm font-bold rounded-full transition-all border border-red-200 hover:border-red-300 hover:shadow-lg active:scale-95 shadow-md">
              <XCircle size={16} /> Incorrect
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default async function AdminSubmissions() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/");
  return <SubmissionsList />;
}
