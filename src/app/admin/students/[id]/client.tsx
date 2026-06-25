"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Code, Sparkles, BookOpen } from "lucide-react";
import { ProgressPieChart, ProgressBarChart } from "@/components/StudentProgressChart";
import SubmissionModal from "@/components/SubmissionModal";

interface Submission {
  id: string;
  question_id: string;
  code: string;
  output: string;
  status: "submitted" | "correct" | "incorrect";
  submitted_at: string;
  questions: {
    id: string;
    title: string;
    description: string;
    order_index: number;
    lecture_id: string;
  } | null;
}

interface Question {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lecture_id: string;
}

interface Lecture {
  id: string;
  title: string;
  order_index: number;
}

export function StudentDetailClient({
  submissions,
  allQuestions,
  lectures,
}: {
  submissions: Submission[];
  allQuestions: Question[];
  lectures: Lecture[];
}) {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const attemptedIds = new Set(submissions.map((s) => s.question_id));
  const correct = submissions.filter((s) => s.status === "correct").length;
  const incorrect = submissions.filter((s) => s.status === "incorrect").length;
  const pending = submissions.filter((s) => s.status === "submitted").length;
  const notAttempted = allQuestions.length - attemptedIds.size;

  const questionsByLecture = new Map<string, Question[]>();
  for (const q of allQuestions) {
    const list = questionsByLecture.get(q.lecture_id) || [];
    list.push(q);
    questionsByLecture.set(q.lecture_id, list);
  }

  const getLatestSub = (qId: string) =>
    submissions
      .filter((s) => s.question_id === qId)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Attempted" value={attemptedIds.size} sub={`of ${allQuestions.length}`} gradient="bg-gradient-to-br from-blue-500 to-cyan-500" />
        <StatCard label="Correct" value={correct} sub="" gradient="bg-gradient-to-br from-emerald-500 to-green-500" />
        <StatCard label="Incorrect" value={incorrect} sub="" gradient="bg-gradient-to-br from-rose-500 to-pink-500" />
        <StatCard label="Pending" value={pending} sub="" gradient="bg-gradient-to-br from-orange-500 to-amber-500" />
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
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <BookOpen size={16} className="text-emerald-500" />
            Submission History
          </h3>
        </div>
        {lectures.map((lecture) => {
          const lectureQuestions = questionsByLecture.get(lecture.id) || [];
          const attemptedHere = lectureQuestions.filter((q) => attemptedIds.has(q.id));
          if (lectureQuestions.length === 0) return null;
          return (
            <div key={lecture.id} className="border-b border-gray-100 last:border-b-0">
              <div className="px-5 sm:px-6 py-3 bg-gradient-to-r from-emerald-50/30 to-emerald-50/30">
                <h4 className="text-sm font-extrabold text-emerald-700 flex items-center gap-2">
                  <BookOpen size={14} className="text-emerald-500" />
                  Lecture {lecture.order_index}: {lecture.title}
                  <span className="text-[10px] font-medium text-gray-400 ml-auto">
                    {attemptedHere.length}/{lectureQuestions.length} &middot; {lectureQuestions.length} question{lectureQuestions.length !== 1 ? "s" : ""}
                  </span>
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-5 sm:px-6 py-2 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Question</th>
                      <th className="text-center px-5 sm:px-6 py-2 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 sm:px-6 py-2 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectureQuestions.map((q) => {
                      const latestSub = getLatestSub(q.id);
                      return (
                        <tr
                          key={q.id}
                          onClick={() => latestSub && setSelectedSub(latestSub)}
                          className={`border-b border-gray-50 transition-all ${
                            latestSub
                              ? "cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-emerald-50/30"
                              : ""
                          }`}
                        >
                          <td className="px-5 sm:px-6 py-3">
                            <div className="flex items-center gap-2">
                              <Code size={13} className="text-gray-400" />
                              <span className="text-sm font-bold text-gray-800">
                                {q.order_index}. {q.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 sm:px-6 py-3 text-center">
                            {!latestSub ? (
                              <span className="text-[10px] font-bold text-gray-300 bg-gray-100 px-2 py-1 rounded-full">Not Attempted</span>
                            ) : latestSub.status === "correct" ? (
                              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full inline-flex items-center gap-1"><CheckCircle size={10} /> Correct</span>
                            ) : latestSub.status === "incorrect" ? (
                              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full inline-flex items-center gap-1"><XCircle size={10} /> Incorrect</span>
                            ) : (
                              <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full inline-flex items-center gap-1"><Clock size={10} /> Pending</span>
                            )}
                          </td>
                          <td className="px-5 sm:px-6 py-3 text-xs text-gray-500">
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
          );
        })}
      </div>

      {selectedSub && (
        <SubmissionModal submission={selectedSub} onClose={() => setSelectedSub(null)} />
      )}
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

