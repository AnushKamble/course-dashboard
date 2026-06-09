"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Send, Loader2, CheckCircle, Lightbulb, Keyboard } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
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

  const lectureId = params.lectureId as string;
  const questionId = params.questionId as string;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      const { user } = await res.json();
      if (!user) { router.push(`/login?redirect=/practice/${lectureId}/${questionId}`); return; }

      const qRes = await fetch(`/api/questions/${questionId}`);
      const qData = await qRes.json();
      if (qData.question) {
        setQuestion(qData.question);
        setCode(qData.question.starter_code);
      }

      const sRes = await fetch(`/api/submissions?question_id=${questionId}`);
      const sData = await sRes.json();
      if (sData.submissions?.length > 0) setSubmitted(true);

      setLoading(false);
    })();
    loadPyodideRuntime();
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
    if (!pyodide) return;
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
  }, [pyodide, code]);

  const handleSubmit = async () => {
    if (!question) return;
    setSubmitting(true);
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: question.id, code, output }),
    });
    if (res.ok) setSubmitted(true);
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
            <span className="text-[11px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">code.py</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button onClick={handleRun} disabled={running || pyodideLoading || !pyodide}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95 touch-manipulation">
                {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Run
              </button>
              <button onClick={handleSubmit} disabled={submitting || submitted}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95 touch-manipulation">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {submitted ? "Submitted" : "Submit"}
              </button>
            </div>
          </div>

          <div className="flex-1 lg:flex-[3] overflow-hidden min-h-[150px]">
            <CodeEditor value={code} onChange={setCode} />
          </div>

          <div className="shrink-0 lg:flex-[2] border-t border-[#3c3c3c] overflow-hidden">
            <OutputPanel output={output} error={error} running={running} />
          </div>
        </div>
      </div>

      {pyodideLoading && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-emerald-900 text-white text-xs sm:text-sm rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg backdrop-blur-sm z-50">
          <Loader2 size={14} className="animate-spin shrink-0" />
          <span className="truncate">Loading Python runtime (~15MB first time)...</span>
        </div>
      )}
    </div>
  );
}

