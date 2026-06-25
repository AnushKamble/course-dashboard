import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, MessageCircle, CheckCircle, Clock, User, ChevronRight } from "lucide-react";
import AvatarDisplay from "@/components/AvatarDisplay";

export const dynamic = "force-dynamic";

async function AdminDoubts() {
  const supabase = createAdminClient();

  const { data: doubts } = await supabase
    .from("doubts")
    .select("*, questions(title, order_index), profiles(username, avatar_url)")
    .order("created_at", { ascending: false });

  const unresolved = doubts?.filter((d) => !d.resolved).length || 0;

  const markResolved = async (doubtId: string, resolved: boolean) => {
    "use server";
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") return;
    const supabase = createAdminClient();
    await supabase.from("doubts").update({ resolved }).eq("id", doubtId);
    revalidatePath("/admin/doubts");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Admin
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-3 text-white shadow-lg shadow-purple-500/20">
          <MessageCircle size={22} className="sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Student Doubts</h1>
          <p className="text-xs sm:text-sm text-gray-500">{unresolved} unresolved</p>
        </div>
      </div>

      {doubts && doubts.length > 0 ? (
        <div className="space-y-3">
          {doubts.map((d: any) => (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/doubts/${d.id}`} className="flex items-start gap-3 min-w-0 flex-1 group">
                    <div className="bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl p-2.5 text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <AvatarDisplay url={d.profiles?.avatar_url} username={d.profiles?.username || "U"} size={20} />
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{d.profiles?.username || "Unknown"}</span>
                        <span className="text-xs text-gray-300">&rarr;</span>
                        <span className="text-xs font-semibold text-gray-700">{d.questions?.title || "General"}</span>
                        {d.resolved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle size={9} /> Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock size={9} /> Open
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-1">{d.question_text}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{new Date(d.created_at).toLocaleString("en-IN")}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                  </Link>
                  <form action={markResolved.bind(null, d.id, !d.resolved)} className="shrink-0 mt-1">
                    <button type="submit" className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${d.resolved ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                      {d.resolved ? "Reopen" : "Resolve"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-200 shadow-lg">
          <MessageCircle size={48} className="mx-auto text-purple-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Doubts Yet</h3>
          <p className="text-gray-500 text-sm">Students haven&apos;t asked any doubts yet.</p>
        </div>
      )}
    </div>
  );
}

export default async function AdminDoubtsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/");
  return <AdminDoubts />;
}
