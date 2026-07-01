"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles, ChevronRight, Eye } from "lucide-react";
import { showcaseProjects } from "@/data/showcase";

export default function ShowcasePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      });
    fetch("/api/projects/submissions")
      .then((r) => r.json())
      .then((data) => setSubmissions(data.submissions || []));
  }, []);

  const isComplete = (id: string) =>
    submissions.some((s: any) => s.project_id === id && s.status === "approved");

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-3 text-white shadow-lg shadow-orange-500/20">
          <Sparkles size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Interactive Showcase 🎮</h1>
          <p className="text-xs sm:text-sm text-gray-500">Click around, press keys, watch animations — all with Python!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {showcaseProjects.map((p) => {
          const done = isComplete(p.id);
          return (
            <Link
              key={p.id}
              href={`/showcase/${p.id}`}
              className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:border-yellow-200 transition-all card-hover"
            >
              <div className="h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 flex items-center justify-center text-5xl">
                {p.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800">
                    🎮 Interactive
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.difficulty === "Easy" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {p.difficulty}
                  </span>
                  {done && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">✓ Done</span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-gray-800 group-hover:text-orange-600 transition-colors">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{p.hook}</p>
                {!user && (
                  <p className="text-[10px] text-gray-400 mt-2">Sign in to explore</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
