"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Download, Sparkles, Trophy, Flame, BookOpen, CheckCircle, XCircle, Clock, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminStudentReportPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/auth/me");
      const { user: adminUser } = await meRes.json();
      if (!adminUser || adminUser.role !== "admin") { router.push("/login"); return; }

      const [qRes, sRes, pRes, lecRes, stuRes] = await Promise.all([
        fetch("/api/questions"),
        fetch(`/api/submissions?admin_user_id=${studentId}`),
        fetch(`/api/gamification/profile?user_id=${studentId}`),
        fetch("/api/lectures"),
        fetch(`/api/user-profile/${studentId}`),
      ]);

      const allQ = await qRes.json();
      const { submissions } = await sRes.json();
      const gami = await pRes.json();
      const lecData = await lecRes.json();
      const stuData = await stuRes.json();

      const lectures = lecData.lectures || [];
      const questions = allQ.questions || [];
      const subs = submissions || [];

      setData({
        studentUsername: stuData.username || "Unknown",
        gamification: gami,
        lectures,
        questions,
        submissions: subs,
        stats: {
          total: questions.length,
          attempted: subs.length,
          correct: subs.filter((s: any) => s.status === "correct").length,
          incorrect: subs.filter((s: any) => s.status === "incorrect").length,
          pending: subs.filter((s: any) => s.status === "submitted").length,
        },
      });

      setLoading(false);
    })();
  }, [studentId, router]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) { window.print(); return; }
    printWindow.document.write(`
      <html>
        <head>
          <title>Progress Report - ${data?.studentUsername || "Student"}</title>
          <style>
            body { font-family: 'Nunito', Arial, sans-serif; padding: 40px; color: #1F2937; max-width: 900px; margin: 0 auto; }
            h1 { font-size: 28px; margin-bottom: 4px; }
            h2 { font-size: 20px; color: #059669; border-bottom: 2px solid #059669; padding-bottom: 6px; margin-top: 30px; }
            h3 { font-size: 16px; color: #047857; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 12px 0; }
            th { text-align: left; padding: 8px 12px; background: #f0fdf4; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #4B5563; border-bottom: 2px solid #D1D5DB; }
            td { padding: 8px 12px; border-bottom: 1px solid #E5E7EB; font-size: 14px; }
            .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
            .stat-card { background: #f0fdf4; padding: 16px; border-radius: 12px; text-align: center; }
            .stat-card .value { font-size: 32px; font-weight: 800; }
            .stat-card .label { font-size: 12px; color: #6B7280; }
            .footer { margin-top: 30px; font-size: 11px; color: #9CA3AF; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 12px; }
          </style>
        </head>
        <body>
          ${document.getElementById("report-content")?.innerHTML || ""}
          <div class="footer">Generated on ${new Date().toLocaleDateString()} &middot; Python Course</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;
  if (!data) return null;

  const { studentUsername, gamification, lectures, questions, submissions, stats } = data;

  const questionsByLecture = new Map<string, any[]>();
  for (const q of questions) {
    const list = questionsByLecture.get(q.lecture_id) || [];
    list.push(q);
    questionsByLecture.set(q.lecture_id, list);
  }

  const getLatestSub = (qId: string) =>
    submissions
      .filter((s: any) => s.question_id === qId)
      .sort((a: any, b: any) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/admin/students/${studentId}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">
            <ArrowLeft size={16} /> Back to Student
          </Link>
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95">
            <Download size={16} />
            Save as PDF
          </button>
        </div>

        <div id="report-content" ref={printRef}>
          <div className="mb-8 pb-6 border-b-2 border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-2 text-white shadow-lg">
                <Shield size={20} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Student Report</h1>
                <p className="text-gray-500 mt-0.5">{studentUsername} &middot; {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {gamification && (
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white text-center shadow-lg">
                <p className="text-3xl font-extrabold">{gamification.xp ?? 0}</p>
                <p className="text-xs font-bold text-white/80 mt-1">Total XP</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white text-center shadow-lg">
                <p className="text-3xl font-extrabold">{gamification.level ?? 0}</p>
                <p className="text-xs font-bold text-white/80 mt-1">Level</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white text-center shadow-lg">
                <p className="text-3xl font-extrabold">{gamification.streak_count ?? 0}</p>
                <p className="text-xs font-bold text-white/80 mt-1">Day Streak</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl p-5 text-white text-center shadow-lg">
                <p className="text-3xl font-extrabold">{gamification.earned_badges?.length || 0}</p>
                <p className="text-xs font-bold text-white/80 mt-1">Badges</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
              <p className="text-3xl font-extrabold text-gray-800">{stats.total}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">Total Questions</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
              <p className="text-3xl font-extrabold text-blue-600">{stats.attempted}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">Attempted</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
              <p className="text-3xl font-extrabold text-emerald-600">{stats.correct}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">Correct</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
              <p className="text-3xl font-extrabold text-rose-600">{stats.incorrect}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">Incorrect</p>
            </div>
          </div>

          {gamification?.all_badges && (
            <div className="mb-8">
              <h2 className="text-lg font-extrabold text-gray-800 mb-3 flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                Badges ({gamification.earned_badges.length}/{gamification.all_badges.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {gamification.all_badges.map((b: any) => (
                  <span key={b.id} className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${gamification.earned_badges.some((e: any) => e.id === b.id) ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
                    {b.icon} {b.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center gap-2 break-inside-avoid">
            <BookOpen size={18} className="text-emerald-500" />
            Question-wise Breakdown
          </h2>

          {lectures.map((lecture: any) => {
            const lectureQuestions = questionsByLecture.get(lecture.id) || [];
            if (lectureQuestions.length === 0) return null;
            return (
              <div key={lecture.id} className="mb-6 break-inside-avoid">
                <h3 className="font-extrabold text-emerald-700 mb-2 text-sm">
                  Lecture {lecture.order_index}: {lecture.title}
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left px-3 py-2 bg-emerald-50 text-[10px] font-extrabold text-gray-500 uppercase">#</th>
                      <th className="text-left px-3 py-2 bg-emerald-50 text-[10px] font-extrabold text-gray-500 uppercase">Question</th>
                      <th className="text-center px-3 py-2 bg-emerald-50 text-[10px] font-extrabold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-3 py-2 bg-emerald-50 text-[10px] font-extrabold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectureQuestions.map((q: any) => {
                      const sub = getLatestSub(q.id);
                      return (
                        <tr key={q.id} className="border-b border-gray-100">
                          <td className="px-3 py-2.5 text-gray-400 font-bold">{q.order_index}</td>
                          <td className="px-3 py-2.5 font-semibold text-gray-800">{q.title}</td>
                          <td className="px-3 py-2.5 text-center">
                            {!sub ? (
                              <span className="text-gray-400 font-bold">Not Attempted</span>
                            ) : sub.status === "correct" ? (
                              <span className="text-emerald-600 font-bold flex items-center justify-center gap-1"><CheckCircle size={12} /> Correct</span>
                            ) : sub.status === "incorrect" ? (
                              <span className="text-rose-600 font-bold flex items-center justify-center gap-1"><XCircle size={12} /> Incorrect</span>
                            ) : (
                              <span className="text-orange-600 font-bold flex items-center justify-center gap-1"><Clock size={12} /> Pending</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-gray-500 text-xs">
                            {sub ? new Date(sub.submitted_at).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
