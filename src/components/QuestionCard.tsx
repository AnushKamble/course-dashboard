import Link from "next/link";
import { Code, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Question, Submission } from "@/types";

interface Props {
  question: Question;
  lectureId: string;
  submission?: Submission;
}

const qGradients = [
  "bg-gradient-to-br from-blue-500 to-cyan-500",
  "bg-gradient-to-br from-orange-500 to-amber-500",
  "bg-gradient-to-br from-emerald-500 to-green-500",
  "bg-gradient-to-br from-rose-500 to-pink-500",
  "bg-gradient-to-br from-purple-500 to-violet-500",
];

export default function QuestionCard({ question, lectureId, submission }: Props) {
  const g = qGradients[question.order_index % qGradients.length];

  const getStatusBadge = () => {
    if (!submission) return null;
    switch (submission.status) {
      case "correct":
        return <span className="badge-correct"><CheckCircle size={12} /> Done</span>;
      case "incorrect":
        return <span className="badge-incorrect"><XCircle size={12} /> Wrong</span>;
      default:
        return <span className="badge-pending"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <Link
      href={`/practice/${lectureId}/${question.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 card-hover overflow-hidden group"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`${g} rounded-xl p-2 sm:p-2.5 text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              <Code size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors truncate">
                {question.order_index}. {question.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                {question.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {getStatusBadge()}
            <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
