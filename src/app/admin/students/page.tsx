import { createAdminClient } from "@/lib/supabase-admin";
import Link from "next/link";
import { ArrowLeft, Users, ChevronRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminStudents() {
  const supabase = createAdminClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  const studentStats = await Promise.all(
    (students || []).map(async (student: any) => {
      const { count: totalSubmissions } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", student.id);

      const { count: correct } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", student.id)
        .eq("status", "correct");

      return { ...student, totalSubmissions: totalSubmissions || 0, correct: correct || 0 };
    })
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 mb-6 transition-colors"><ArrowLeft size={16} />Back to Admin</Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="gradient-primary rounded-2xl p-3 text-white shadow-lg shadow-purple-500/20"><Users size={22} className="sm:w-6 sm:h-6" /></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Students 👨‍🎓</h1>
          <p className="text-xs sm:text-sm text-gray-500">{studentStats.length} enrolled students</p>
        </div>
      </div>

      {studentStats.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-emerald-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-sm font-extrabold text-gray-600">Username</th>
                  <th className="text-center px-5 py-3 text-sm font-extrabold text-gray-600">Submissions</th>
                  <th className="text-center px-5 py-3 text-sm font-extrabold text-gray-600">Correct</th>
                  <th className="text-center px-5 py-3 text-sm font-extrabold text-gray-600">Joined</th>
                  <th className="text-left px-5 py-3 text-sm font-extrabold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {studentStats.map((student: any, i: number) => (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-emerald-50/30 transition-all">
                    <td className="px-5 py-4 text-sm font-bold text-gray-800">{student.username || "Unnamed"}</td>
                    <td className="px-5 py-4 text-sm text-center text-gray-600">{student.totalSubmissions}</td>
                    <td className="px-5 py-4 text-sm text-center">
                      {student.totalSubmissions > 0
                        ? <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-extrabold">{Math.round((student.correct / student.totalSubmissions) * 100)}%</span>
                        : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-center text-gray-500">{new Date(student.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/students/${student.id}`} className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-bold transition-colors">
                        View <ChevronRight size={14} />
                      </Link>
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
