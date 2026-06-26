import { createAdminClient } from "@/lib/supabase-admin";
import Link from "next/link";
import { ArrowLeft, Users, ChevronRight, CheckCircle, XCircle, Clock, BookOpen, Activity, FileText } from "lucide-react";
import ResetPasswordButton from "@/components/ResetPasswordButton";
import AvatarDisplay from "@/components/AvatarDisplay";

export const dynamic = "force-dynamic";

export default async function AdminStudents() {
  const supabase = createAdminClient();

  const { data: allQuestions } = await supabase.from("questions").select("id, lecture_id");
  const totalQuestions = allQuestions?.length || 0;

  const { data: students } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  const studentIds = (students || []).map((s) => s.id);

  const { data: subs } = studentIds.length > 0
    ? await supabase
        .from("submissions")
        .select("user_id, question_id, status, submitted_at")
        .in("user_id", studentIds)
    : { data: [] };

  const subsByUser = new Map<string, any[]>();
  for (const s of subs || []) {
    const list = subsByUser.get(s.user_id) || [];
    list.push(s);
    subsByUser.set(s.user_id, list);
  }

  const studentStats = (students || []).map((student: any) => {
    const userSubs = subsByUser.get(student.id) || [];
    const attempted = new Set(userSubs.map((s: any) => s.question_id));
    const correct = new Set(userSubs.filter((s: any) => s.status === "correct").map((s: any) => s.question_id));
    const incorrect = new Set(userSubs.filter((s: any) => s.status === "incorrect").map((s: any) => s.question_id));
    const pending = new Set(userSubs.filter((s: any) => s.status === "submitted").map((s: any) => s.question_id));
    const notAttempted = totalQuestions - attempted.size;
    const lastActive = userSubs.length > 0
      ? userSubs.reduce((latest: Date, s: any) => {
          const d = new Date(s.submitted_at);
          return d > latest ? d : latest;
        }, new Date(0))
      : null;

    return {
      ...student,
      attempted: attempted.size,
      correct: correct.size,
      incorrect: incorrect.size,
      pending: pending.size,
      notAttempted: Math.max(0, notAttempted),
      lastActive,
      pct: totalQuestions > 0 ? Math.round((attempted.size / totalQuestions) * 100) : 0,
    };
  });

  studentStats.sort((a: any, b: any) => {
    if (a.lastActive && b.lastActive) return b.lastActive.getTime() - a.lastActive.getTime();
    if (a.lastActive) return -1;
    if (b.lastActive) return 1;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 mb-6 transition-colors"><ArrowLeft size={16} />Back to Admin</Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-3 text-white shadow-lg shadow-blue-500/20"><Activity size={22} className="sm:w-6 sm:h-6" /></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Student Monitor 📊</h1>
          <p className="text-xs sm:text-sm text-gray-500">{studentStats.length} enrolled &middot; {totalQuestions} total questions</p>
        </div>
      </div>

      {studentStats.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-emerald-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">Progress</th>
                  <th className="text-center px-4 py-3 text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">Breakdown</th>
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">Not Attempted</th>
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">Last Active</th>
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {studentStats.map((student: any) => (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-emerald-50/30 transition-all">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <AvatarDisplay url={student.avatar_url} username={student.username} size={32} />
                        <div>
                          <span className="text-sm font-bold text-gray-800">{student.username || "Unnamed"}</span>
                          <p className="text-[10px] text-gray-400">Joined {new Date(student.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 min-w-[180px]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-gray-400">{student.attempted}/{totalQuestions}</span>
                            <span className={`text-[10px] font-extrabold ${student.pct === 100 ? "text-emerald-600" : "text-blue-600"}`}>{student.pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                student.pct === 100 ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"
                              }`}
                              style={{ width: `${student.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle size={10} />{student.correct}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-full"><XCircle size={10} />{student.incorrect}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-full"><Clock size={10} />{student.pending}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-bold text-gray-400">{student.notAttempted}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-500">
                        {student.lastActive
                          ? (() => {
                              const diff = Math.floor((Date.now() - student.lastActive.getTime()) / 86400000);
                              return diff === 0 ? "Today" : diff === 1 ? "Yesterday" : `${diff}d ago`;
                            })()
                          : "Never"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/students/${student.id}`} className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-xs font-bold transition-colors">
                          View <ChevronRight size={12} />
                        </Link>
                        <Link href={`/admin/students/${student.id}/report`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                          <FileText size={11} />Report
                        </Link>
                        <ResetPasswordButton username={student.username} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-200 shadow-lg">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Students Yet</h3>
          <p className="text-gray-500 text-sm">Students will appear once they sign up. 🎓</p>
        </div>
      )}
    </div>
  );
}
