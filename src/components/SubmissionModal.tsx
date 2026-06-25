"use client";

import { X, Lightbulb, CheckCircle, XCircle, Clock, BrainCircuit, Code } from "lucide-react";

interface Submission {
  id: string;
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

export default function SubmissionModal({
  submission,
  onClose,
}: {
  submission: Submission;
  onClose: () => void;
}) {
  const q = submission.questions;
  const isDryRun = q?.description?.includes("[DRY RUN]") || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-emerald-50/50 shrink-0">
          <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Q{q?.order_index}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-gray-800 truncate">
            {q?.title || "Unknown Question"}
          </h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            submission.status === "correct"
              ? "bg-green-100 text-green-700"
              : submission.status === "incorrect"
              ? "bg-red-100 text-red-700"
              : "bg-orange-100 text-orange-700"
          }`}>
            {submission.status === "correct" ? "Correct" : submission.status === "incorrect" ? "Incorrect" : "Pending"}
          </span>
          <button onClick={onClose} className="ml-auto p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Left: Question Description */}
          <div className="lg:w-[35%] overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-100 bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-amber-500 shrink-0" />
              <span className="font-semibold text-gray-700 text-sm">Instructions</span>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
              {q?.description || "No description"}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                <Clock size={12} />
                Submitted
              </div>
              <p className="text-xs text-gray-800 font-medium">
                {new Date(submission.submitted_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right: Code + Output */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
            <div className="flex items-center px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code size={12} />
                {isDryRun ? "Predicted Output" : "Code"}
              </span>
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                submission.status === "correct"
                  ? "bg-green-900/50 text-green-300"
                  : submission.status === "incorrect"
                  ? "bg-red-900/50 text-red-300"
                  : "bg-orange-900/50 text-orange-300"
              }`}>
                {submission.status === "correct" ? <CheckCircle size={10} /> : submission.status === "incorrect" ? <XCircle size={10} /> : <Clock size={10} />}
                {submission.status}
              </span>
            </div>
            <pre className="flex-1 overflow-auto p-4 sm:p-6 text-[13px] font-mono text-gray-200 leading-relaxed whitespace-pre-wrap">
              <code>{submission.code || "(no code)"}</code>
            </pre>

            {/* Output section */}
            <div className="shrink-0 border-t border-[#3c3c3c] bg-[#252526]">
              <div className="px-4 py-2 bg-[#252526] border-b border-[#3c3c3c]">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BrainCircuit size={12} />
                  {isDryRun ? "Actual Output" : "Output"}
                </span>
              </div>
              <div className="max-h-[200px] overflow-auto">
                {submission.output ? (
                  <pre className="p-4 text-[13px] font-mono text-gray-200 leading-relaxed whitespace-pre-wrap">
                    <code>{submission.output}</code>
                  </pre>
                ) : (
                  <p className="p-4 text-[13px] text-gray-500 italic">No output</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
