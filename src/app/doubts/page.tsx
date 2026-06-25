"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ChevronRight, CheckCircle, Clock, ArrowLeft, Loader2 } from "lucide-react";

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.user) { window.location.href = "/login"; return; }
      setUser(d.user);
    });
    fetch("/api/doubts").then(r => r.json()).then(d => {
      setDoubts(d.doubts || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-3 text-white shadow-lg shadow-purple-500/20">
          <MessageCircle size={22} className="sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Doubts</h1>
          <p className="text-xs sm:text-sm text-gray-500">{doubts.length} {doubts.length === 1 ? "doubt" : "doubts"}</p>
        </div>
      </div>

      {doubts.length === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-200 shadow-lg">
          <MessageCircle size={48} className="mx-auto text-purple-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Doubts Yet</h3>
          <p className="text-gray-500 text-sm">Ask a doubt while solving practice questions!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {doubts.map((d) => (
            <Link
              key={d.id}
              href={`/doubts/${d.id}`}
              className="block bg-white rounded-2xl shadow-sm border border-gray-100 card-hover overflow-hidden group"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl p-2.5 text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle size={16} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-gray-800 group-hover:text-purple-700 transition-colors truncate">
                        {d.questions?.title || "General Doubt"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-1">{d.question_text}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-gray-400">{new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        {d.resolved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle size={10} /> Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock size={10} /> Open
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
