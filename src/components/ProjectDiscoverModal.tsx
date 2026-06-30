"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Code, Sparkles, X, ChevronRight, Star } from "lucide-react";

export default function ProjectDiscoverModal() {
  const [show, setShow] = useState(false);
  const [dontRemind, setDontRemind] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("projects_discover_dismissed");
    if (dismissed === "true") return;
    const seen = sessionStorage.getItem("projects_discover_seen");
    if (seen === "true") return;
    sessionStorage.setItem("projects_discover_seen", "true");
    setShow(true);
  }, []);

  const handleClose = () => {
    if (dontRemind) {
      localStorage.setItem("projects_discover_dismissed", "true");
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-t-3xl px-6 py-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-3">
            <Code size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold">New: Projects! 🚀</h2>
          <p className="text-sm text-white/80 mt-1">Build real Python programs step by step</p>
        </div>

        <div className="px-6 py-5 space-y-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              onClick={handleClose}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 transition-all group"
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-gray-800 group-hover:text-purple-700 transition-colors">{p.title}</p>
                <p className="text-[11px] text-gray-500 truncate">{p.hook}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.difficulty === "Easy" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {p.difficulty}
                </span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <div className="px-6 pb-4 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontRemind}
              onChange={(e) => setDontRemind(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-[11px] text-gray-500 font-medium">Don&apos;t remind again</span>
          </label>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
