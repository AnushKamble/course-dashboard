import Link from "next/link";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import type { Lecture } from "@/types";

const cardGradients = [
  "gradient-primary",
  "gradient-secondary",
  "gradient-accent",
  "gradient-green",
  "gradient-sky",
];

const lectureEmojis = ["🐍", "🎨", "🔢", "📦", "🔗", "🗂️", "⚡", "🎮", "🌐", "📊"];

const gradientTexts = [
  "from-emerald-600 to-emerald-500",
  "from-emerald-500 to-cyan-500",
  "from-yellow-500 to-orange-500",
  "from-emerald-500 to-cyan-500",
  "from-cyan-500 to-emerald-500",
];

export default function LectureCard({ lecture, index }: { lecture: Lecture; index: number }) {
  const gradient = cardGradients[index % cardGradients.length];
  const emoji = lectureEmojis[index % lectureEmojis.length];
  const textGrad = gradientTexts[index % gradientTexts.length];

  return (
    <div className="group bg-white rounded-2xl shadow-md border border-gray-100 card-hover overflow-hidden relative">
      {/* Animated shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 animate-float" />
      </div>

      <div className={`h-2 ${gradient}`} />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${gradient} rounded-xl p-2.5 sm:p-3 text-white shadow-lg ${gradient === "gradient-primary" ? "shadow-emerald-500/20" : gradient === "gradient-secondary" ? "shadow-emerald-500/20" : gradient === "gradient-accent" ? "shadow-yellow-500/20" : gradient === "gradient-green" ? "shadow-emerald-500/20" : "shadow-cyan-500/20"} group-hover:scale-110 transition-transform duration-200`}>
            <span className="text-lg sm:text-xl leading-none">{emoji}</span>
          </div>
          <span className={`text-xs sm:text-sm font-extrabold bg-gradient-to-r ${textGrad} bg-clip-text text-transparent px-3 py-1 rounded-full bg-white shadow-sm border border-gray-100`}>
            Lecture {lecture.order_index}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {lecture.title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mb-5 line-clamp-2">
          {lecture.description || "No description yet."}
        </p>

        <div className="flex items-center gap-2">
          {lecture.pdf_url && (
            <a
              href={lecture.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <FileText size={15} />
              Notes
            </a>
          )}
          <Link
            href={`/practice/${lecture.id}`}
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 ${gradient} text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95 shadow-md`}
          >
            Practice
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Fun decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-5">
          <Sparkles size={40} className="absolute -top-2 -right-2 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}
