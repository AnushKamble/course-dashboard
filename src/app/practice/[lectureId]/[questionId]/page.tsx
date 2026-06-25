"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Send, Loader2, CheckCircle, Lightbulb, Trophy, X, BrainCircuit, HelpCircle, MessageCircle } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import AvatarDisplay from "@/components/AvatarDisplay";
import ConfettiOverlay from "@/components/ConfettiOverlay";
import type { Question } from "@/types";

declare global {
  interface Window { loadPyodide: (config: any) => Promise<any>; }
}

const STDIN_WRAPPER = `
import builtins as __builtins
__original_input = __builtins.input
def __input_wrapper(prompt=""):
    import js
    result = js.prompt(str(prompt))
    return str(result) if result is not None else ""
__builtins.input = __input_wrapper
`;

export default function PracticeQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [userData, setUserData] = useState<{ username: string; avatar_url?: string | null } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpToast, setXpToast] = useState<{ xp: number; levelUp?: boolean; badges?: string[] } | null>(null);
  const [predictedOutput, setPredictedOutput] = useState("");
  const [doubtOpen, setDoubtOpen] = useState(false);
  const [doubtText, setDoubtText] = useState("");
  const [doubtSent, setDoubtSent] = useState(false);
  const [doubtSending, setDoubtSending] = useState(false);
  const [lectureQuestions, setLectureQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const lectureId = params.lectureId as string;
  const questionId = params.questionId as string;
  const isDryRun = question?.question_type === "dry_run";

  const sendDoubt = async () => {
    if (!question || !doubtText.trim()) return;
    setDoubtSending(true);
    await fetch("/api/doubts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: question.id, code, output, question_text: doubtText }),
    });
    setDoubtSent(true);
    setDoubtSending(false);
    setTimeout(() => { setDoubtOpen(false); setDoubtSent(false); setDoubtText(""); }, 1500);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      const { user } = await res.json();
      if (!user) { router.push(`/login?redirect=/practice/${lectureId}/${questionId}`); return; }
      setUserData(user);

      fetch("/api/gamification/record-daily", { method: "POST" }).catch(() => {});

      const qRes = await fetch(`/api/questions/${questionId}`);
      const qData = await qRes.json();
      if (qData.question) {
        setQuestion(qData.question);
        if (qData.question.question_type !== "dry_run") {
          setCode(qData.question.starter_code);
        }
      }

      const sRes = await fetch(`/api/submissions?question_id=${questionId}`);
      const sData = await sRes.json();
      if (sData.submissions?.length > 0) setSubmitted(true);

      const lqRes = await fetch(`/api/questions?lecture_id=${lectureId}`);
      const lqData = await lqRes.json();
      const allLQ: Question[] = lqData.questions || [];
      setLectureQuestions(allLQ);
      setCurrentIndex(allLQ.findIndex((q: Question) => q.id === questionId));

      setLoading(false);

      if (qData.question?.question_type !== "dry_run") {
        loadPyodideRuntime();
      } else {
        setPyodideLoading(false);
      }
    })();
  }, [questionId]);

  const loadPyodideRuntime = async () => {
    try {
      if (!(window as any).pyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        document.head.appendChild(script);
        await new Promise<void>((resolve) => { script.onload = () => resolve(); });
        const pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
        (window as any).pyodide = pyodideInstance;
        setPyodide(pyodideInstance);
      } else {
        setPyodide((window as any).pyodide);
      }
      setPyodideReady(true);
    } catch { setError("Failed to load Python runtime. Please refresh."); }
    setPyodideLoading(false);
  };

  const handleRun = useCallback(async () => {
    if (!pyodide || isDryRun) return;
    setRunning(true);
    setOutput("");
    setError("");

    const fullCode = STDIN_WRAPPER + "\n" + code;

    try {
      pyodide.setStdout({ batched: (text: string) => setOutput((prev) => prev + text + "\n") });
      pyodide.setStderr({ batched: (text: string) => setError((prev) => prev + text + "\n") });
      await pyodide.runPythonAsync(fullCode);
    } catch (e: any) {
      const msg = e.message || "Error running code";
      if (msg.includes("PythonError")) {
        setError((prev) => prev + msg.split("PythonError: ").pop() || msg);
      } else {
        setError((prev) => prev + msg);
      }
    }
    setRunning(false);
  }, [pyodide, code, isDryRun]);

  const handleSubmit = async () => {
    if (!question) return;
    setSubmitting(true);

    const submitCode = isDryRun ? predictedOutput : code;
    const submitOutput = isDryRun ? "" : output;

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: question.id, code: submitCode, output: submitOutput }),
    });
    if (res.ok) setSubmitted(true);

    try {
      const gRes = await fetch("/api/gamification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "submitted", questionTitle: question.title }),
      });
      const gData = await gRes.json();
      setShowConfetti(true);
      setXpToast({
        xp: gData.xp_gained || 10,
        levelUp: gData.leveled_up,
        badges: gData.new_badges?.map((b: any) => b.icon) || [],
      });
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setXpToast(null), 4000);
    } catch { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2000); }

    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;
  if (!question) return <div className="text-center py-20"><h2 className="text-xl font-bold text-gray-700">Question not found</h2><Link href={`/practice/${lectureId}`} className="text-emerald-600 hover:underline mt-2 inline-block">Back to practice</Link></div>;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100 bg-white/50 shrink-0">
        <Link href={`/practice/${lectureId}`} className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Q{question.order_index}</span>
        <h1 className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{question.title}</h1>
        {isDryRun && <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full shrink-0">Dry Run</span>}
        {lectureQuestions.length > 0 && (
          <div className="flex items-center gap-1 ml-2">
            {currentIndex > 0 ? (
              <Link
                href={`/practice/${lectureId}/${lectureQuestions[currentIndex - 1].id}`}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                ◀ Prev
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed">◀ Prev</span>
            )}
            {currentIndex >= 0 && (
              <span className="text-[10px] font-medium text-gray-400 px-1">{currentIndex + 1}/{lectureQuestions.length}</span>
            )}
            {currentIndex < lectureQuestions.length - 1 ? (
              <Link
                href={`/practice/${lectureId}/${lectureQuestions[currentIndex + 1].id}`}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                Next ▶
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed">Next ▶</span>
            )}
          </div>
        )}
        <div className="ml-auto">
          <AvatarDisplay url={userData?.avatar_url} username={userData?.username || ""} size={28} />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-[35%] overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-100 bg-white p-4 sm:p-6">
          <div className="max-w-none">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-amber-500 shrink-0" />
              <span className="font-semibold text-gray-700 text-sm sm:text-base">Instructions</span>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
              {question.description}
            </p>
          </div>
          {submitted && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
              <p className="text-xs text-green-700 font-medium">Submitted! Waiting for review.</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
            <span className="text-[11px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
              {isDryRun ? "code_sample.py" : "code.py"}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {!isDryRun && (
                <button onClick={handleRun} disabled={running || pyodideLoading || !pyodide}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95 touch-manipulation">
                  {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                  Run
                </button>
              )}
              <button onClick={() => setDoubtOpen(true)} disabled={submitted}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95 touch-manipulation">
                <HelpCircle size={14} />
                Doubt?
              </button>
              <button onClick={handleSubmit} disabled={submitting || submitted}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95 touch-manipulation">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {submitted ? "Submitted" : "Submit"}
              </button>
            </div>
          </div>

          {isDryRun ? (
            <>
              <div className="flex-[3] overflow-auto min-h-[150px] bg-[#1e1e1e]">
                <pre className="p-4 sm:p-6 text-[13px] sm:text-[14px] font-mono text-green-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  <code>{question.code_sample || "# No code sample provided"}</code>
                </pre>
              </div>
              <div className="shrink-0 lg:flex-[2] border-t border-[#3c3c3c] flex flex-col bg-[#252526]">
                <div className="px-4 py-2 bg-[#252526] border-b border-[#3c3c3c]">
                  <span className="text-[11px] font-medium text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BrainCircuit size={13} />
                    Your Predicted Output
                  </span>
                </div>
                <textarea
                  value={predictedOutput}
                  onChange={(e) => setPredictedOutput(e.target.value)}
                  disabled={submitted}
                  placeholder="Type what you think the code will output..."
                  className="flex-1 w-full bg-[#1e1e1e] text-gray-200 text-[13px] sm:text-[14px] font-mono p-4 resize-none focus:outline-none border-0 disabled:opacity-50 placeholder-gray-500"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 lg:flex-[3] overflow-hidden min-h-[150px]">
                <CodeEditor value={code} onChange={setCode} />
              </div>
              <div className="shrink-0 lg:flex-[2] border-t border-[#3c3c3c] overflow-hidden">
                <OutputPanel output={output} error={error} running={running} />
              </div>
            </>
          )}
        </div>
      </div>

      {!isDryRun && pyodideLoading && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-emerald-900 text-white text-xs sm:text-sm rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg backdrop-blur-sm z-50">
          <Loader2 size={14} className="animate-spin shrink-0" />
          <span className="truncate">Loading Python runtime (~15MB first time)...</span>
        </div>
      )}

      {showConfetti && <ConfettiOverlay fire={showConfetti} type="correct" />}

      {xpToast && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 left-4 sm:left-auto z-50 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 max-w-sm ml-auto">
            <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl p-2 text-white shadow-lg shrink-0">
              <Trophy size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-gray-800">+{xpToast.xp} XP Earned!</p>
              {xpToast.levelUp && <p className="text-xs font-bold text-amber-600">Level Up!</p>}
              {xpToast.badges && xpToast.badges.length > 0 && (
                <p className="text-xs font-bold text-purple-600">New badge: {xpToast.badges.join(" ")}</p>
              )}
            </div>
            <button onClick={() => setXpToast(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0">
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Doubt Modal */}
      {doubtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => { if (!doubtSent) setDoubtOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
            {doubtSent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-800 mb-1">Doubt Sent!</h3>
                <p className="text-sm text-gray-500">Your doubt and code have been sent to the instructor.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} className="text-purple-500" />
                    <h3 className="text-lg font-bold text-gray-800">Ask a Doubt</h3>
                  </div>
                  <button onClick={() => setDoubtOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-all">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">Your current code and output will be attached automatically.</p>
                <textarea
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your doubt..."
                />
                <button
                  onClick={sendDoubt}
                  disabled={!doubtText.trim() || doubtSending}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-300/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {doubtSending ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Send Doubt"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
