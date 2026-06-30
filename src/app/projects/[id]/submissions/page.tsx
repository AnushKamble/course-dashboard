"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, XCircle, Clock, Star, MessageSquare, Send, RotateCcw, FileText } from "lucide-react";
import { projects } from "@/data/projects";
import CodeEditor from "@/components/CodeEditor";

export default function ProjectSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const project = projects.find((p) => p.id === projectId);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resubmitCode, setResubmitCode] = useState("");
  const [resubmitFor, setResubmitFor] = useState<string | null>(null);
  const [resubmitting, setResubmitting] = useState(false);

  const fetchSubs = () => {
    fetch(`/api/projects/submissions?project_id=${projectId}`)
      .then((r) => r.json())
      .then((data) => setSubmissions(data.submissions || []));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) { router.push(`/login?redirect=/projects/${projectId}/submissions`); return; }
        setUser(data.user);
        fetchSubs();
        setLoading(false);
      });
  }, [projectId, router]);

  const handleResubmit = async (oldSub: any) => {
    setResubmitting(true);
    const code = resubmitCode || oldSub.code;
    const res = await fetch("/api/projects/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId, code }),
    });
    if (res.ok) {
      setResubmitFor(null);
      setResubmitCode("");
      fetchSubs();
    }
    setResubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;
  if (!project) return <div className="text-center py-20"><h2 className="text-xl font-bold text-gray-700">Project not found</h2><Link href="/projects" className="text-emerald-600 hover:underline mt-2 inline-block">Back to projects</Link></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/projects/${projectId}`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={14} /> Back to Project
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors">
          All Projects
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-3 text-white shadow-lg">
          <FileText size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{project.emoji} {project.title} — My Submissions</h1>
          <p className="text-xs sm:text-sm text-gray-500">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-200 shadow-lg">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 inline-flex rounded-2xl p-4 text-white shadow-lg mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Submissions Yet</h3>
          <p className="text-gray-500 text-sm mb-4">Complete all the steps and submit your project to see it here!</p>
          <Link href={`/projects/${projectId}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all">
            Go to Project
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                    sub.status === "approved" ? "bg-green-100 text-green-700" :
                    sub.status === "needs_revision" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {sub.status === "approved" ? <CheckCircle size={10} /> :
                     sub.status === "needs_revision" ? <Clock size={10} /> : <Clock size={10} />}
                    {sub.status === "approved" ? "Approved" : sub.status === "needs_revision" ? "Needs Revision" : "Submitted"}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(sub.created_at).toLocaleString()}</span>
                </div>
                {sub.stars && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= sub.stars ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                )}
              </div>

              <div className="px-5 py-3">
                <button onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                  {expandedId === sub.id ? "Hide Code" : "View Code"}
                </button>

                {expandedId === sub.id && (
                  <div className="mt-3 bg-[#1e1e1e] rounded-xl overflow-hidden">
                    <pre className="p-4 text-[12px] font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap max-h-[300px] leading-relaxed"><code>{sub.code}</code></pre>
                  </div>
                )}
              </div>

              {sub.critique && (
                <div className="px-5 pb-3">
                  <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                    <MessageSquare size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">{sub.critique}</p>
                  </div>
                </div>
              )}

              {sub.status === "needs_revision" && (
                <div className="px-5 pb-4">
                  {resubmitFor === sub.id ? (
                    <div className="space-y-2">
                      <div className="h-40 overflow-hidden rounded-xl border border-gray-200">
                        <CodeEditor value={resubmitCode || sub.code} onChange={setResubmitCode} />
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleResubmit(sub)} disabled={resubmitting}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-400 text-white text-xs font-bold rounded-xl transition-all">
                          {resubmitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                          Resubmit
                        </button>
                        <button onClick={() => { setResubmitFor(null); setResubmitCode(""); }}
                          className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setResubmitFor(sub.id); setResubmitCode(sub.code); }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-xl transition-all">
                      <RotateCcw size={12} /> Revise &amp; Resubmit
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
