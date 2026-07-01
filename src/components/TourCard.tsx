"use client";

import { ChevronLeft, ChevronRight, CheckCircle, X, SkipForward } from "lucide-react";

interface TourCardProps {
  step: { title: string; explanation: string };
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
  completed: boolean;
  completing: boolean;
}

export default function TourCard({
  step, stepIndex, totalSteps, onPrev, onNext, onSkip, onComplete, completed, completing,
}: TourCardProps) {
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
          Step {stepIndex + 1}/{totalSteps}
        </span>
        <button onClick={onSkip} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors">
          <SkipForward size={12} /> Skip Tour
        </button>
      </div>

      <h3 className="text-sm font-extrabold text-gray-800 mb-2">{step.title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">{step.explanation}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button onClick={onPrev} disabled={stepIndex === 0}
            className="flex items-center gap-1 px-3 py-2 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all">
            <ChevronLeft size={13} /> Prev
          </button>
          {!isLast && (
            <button onClick={onNext}
              className="flex items-center gap-1 px-3 py-2 text-[11px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg rounded-xl transition-all">
              Next <ChevronRight size={13} />
            </button>
          )}
        </div>
        {isLast && (
          <button onClick={onComplete} disabled={completed || completing}
            className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all">
            {completing ? "Submitting..." : completed ? "Completed!" : "Mark Complete"}
            {completed ? <CheckCircle size={13} /> : null}
          </button>
        )}
      </div>
    </div>
  );
}
