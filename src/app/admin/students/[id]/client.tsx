"use client";

import { CheckCircle, XCircle, Clock, Code, Sparkles } from "lucide-react";
import { ProgressPieChart, ProgressBarChart } from "@/components/StudentProgressChart";

interface Submission {
  id: string;
  question_id: string;
  code: string;
  output: string;
  status: "submitted" | "correct" | "incorrect";
  submitted_at: string;
  questions: {
    title: string;
    description: string;
    order_index: number;
  } | null;
}

interface Question {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

export function StudentDetailClient({
  submissions,
  allQuestions,
}: {
  submissions: Submission[];
  allQuestions: Question[];
}) {
  const attemptedIds = new Set(submissions.map((s) => s.question_id));
  const correct = submissions.filter((s) => s.status === "correct").length;
  const incorrect = submissions.filter((s) => s.status === "incorrect").length;
  const pending = submissions.filter((s) => s.status === "submitted").length;
  const notAttempted = allQuestions.length - attemptedIds.size;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Attempted" value={attemptedIds.size} sub={`of ${allQuestions.length}`} gradient="gradient-primary" />
        <StatCard label="Correct" value={correct} sub="" gradient="gradient-green" />
        <StatCard label="Incorrect" value={incorrect} sub="" gradient="gradient-secondary" />
        <StatCard label="Pending" value={pending} sub="" gradient="gradient-accent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-500" />
            Progress Overview
          </h3>
          <ProgressPieChart correct={correct} incorrect={incorrect} pending={pending} notAttempted={notAttempted} />
        </div>
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-500" />
            Results Breakdown
          </h3>
          <ProgressBarChart correct={correct} incorrect={incorrect} pending={pending} notAttempted={notAttempted} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-emerald-50/50">
          <h3 className="font-bold text-gray-800">All Questions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-50 to-emerald-50">
                <th className="text-left px-5 sm:px-6 py-3 text-sm font-extrabold text-gray-600">Question</th>
                <th className="text-center px-5 sm:px-6 py-3 text-sm font-extrabold text-gray-600">Status</th>
                <th className="text-left px-5 sm:px-6 py-3 text-sm font-extrabold text-gray-600">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {allQuestions.map((q: Question) => {
                const latestSub = submissions
                  .filter((s) => s.question_id === q.id)
                  .sort(
                    (a, b) =>
                      new Date(b.submitted_at).getTime() -
                      new Date(a.submitted_at).getTime()
                  )[0];

                return (
                  <tr
                    key={q.id}
                    className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-emerald-50/30 transition-all"
                  >
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Code size={14} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-800">
                          {q.order_index}. {q.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-center">
                      {!latestSub ? (
                        <span className="badge-not-attempted"><Clock size={12} /> Not Attempted</span>
                      ) : latestSub.status === "correct" ? (
                        <span className="badge-correct"><CheckCircle size={12} /> Correct</span>
                      ) : latestSub.status === "incorrect" ? (
                        <span className="badge-incorrect"><XCircle size={12} /> Incorrect</span>
                      ) : (
                        <span className="badge-pending"><Clock size={12} /> Pending</span>
                      )}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-sm text-gray-500">
                      {latestSub
                        ? new Date(latestSub.submitted_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, sub, gradient }: { label: string; value: number; sub: string; gradient: string }) {
  return (
    <div className={`${gradient} rounded-2xl p-4 sm:p-5 shadow-lg text-white`}>
      <span className="text-xs sm:text-sm font-bold text-white/80">{label}</span>
      <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-white/70 mt-0.5">{sub}</p>}
    </div>
  );
}

