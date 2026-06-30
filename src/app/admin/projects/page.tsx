"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, XCircle, Clock, Star, Shield, Code, ChevronDown, ChevronUp, Send } from "lucide-react";
import { projects } from "@/data/projects";

export default function AdminProjectsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewStars, setReviewStars] = useState<Record<string, number>>({});
  const [reviewCritique, setReviewCritique] = useState<Record<string, string>>({});
  const [reviewing, setReviewing] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "admin") { router.push("/login"); return; }
        fetchSubmissions();
      });
  }, [router]);

  const fetchSubmissions = () => {
    fetch("/api/projects/all-submissions")
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(data.submissions || []);
        setLoading(false);
      });
  };

  const handleReview = async (subId: string, status: string) => {
    setReviewing((prev) => ({ ...prev, [subId]: true }));
    await fetch(`/api/projects/submissions/${subId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        stars: reviewStars[subId] || null,
        critique: reviewCritique[subId] || null,
      }),
    });
    setReviewing((prev) => ({ ...prev, [subId]: false }));
    setExpandedId(null);
    fetchSubmissions();
  };

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.project_id === filter);
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 mb-6 transition-colors"><ArrowLeft size={16} />Back to Admin</Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-3 text-white shadow-lg shadow-purple-500/20">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Project Reviews 📋</h1>
          <p className="text-xs sm:text-sm text-gray-500">{submissions.length} total submissions</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${filter === "all" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
        {projects.map((p) => (
          <button key={p.id} onClick={() => setFilter(p.id)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${filter === p.id ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {p.emoji} {p.title}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-200 shadow-lg">
          <Code size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Submissions</h3>
          <p className="text-gray-500 text-sm">No submissions for this filter yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const p = projectMap[sub.project_id];
            const isExpanded = expandedId === sub.id;
            return (
              <div key={sub.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : sub.id)}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg">{p?.emoji || "📦"}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{sub.profiles?.username || "Unknown"}</p>
                      <p className="text-[10px] text-gray-400">{p?.title || sub.project_id} &middot; {new Date(sub.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      sub.status === "approved" ? "bg-green-100 text-green-700" :
                      sub.status === "needs_revision" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {sub.status}
                    </span>
                    {sub.stars && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} className={s <= sub.stars ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                        ))}
                      </div>
                    )}
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Code</p>
                      <pre className="bg-[#1e1e1e] text-gray-200 text-[12px] font-mono p-4 rounded-xl overflow-x-auto whitespace-pre-wrap max-h-[250px] leading-relaxed"><code>{sub.code}</code></pre>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Rating</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setReviewStars((prev) => ({ ...prev, [sub.id]: s }))}>
                            <Star size={20} className={`transition-colors ${(reviewStars[sub.id] || sub.stars || 0) >= s ? "text-amber-400 fill-amber-400" : "text-gray-200 hover:text-amber-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Critique</p>
                      <textarea
                        value={reviewCritique[sub.id] ?? sub.critique ?? ""}
                        onChange={(e) => setReviewCritique((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
                        placeholder="Write feedback..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handleReview(sub.id, "approved")} disabled={reviewing[sub.id]}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                        {reviewing[sub.id] ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        Approve
                      </button>
                      <button onClick={() => handleReview(sub.id, "needs_revision")} disabled={reviewing[sub.id]}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                        {reviewing[sub.id] ? <Loader2 size={12} className="animate-spin" /> : <Clock size={12} />}
                        Request Revision
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
