"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Send, Loader2, Lightbulb, CheckCircle, ChevronLeft, ChevronRight, Eye, EyeOff, FileText } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";

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

export default function ProjectTutorialPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showNextWarning, setShowNextWarning] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) { router.push(`/login?redirect=/projects/${projectId}`); return; }
        const p = projects.find((x) => x.id === projectId);
        if (!p) { router.push("/projects"); return; }
        setProject(p);
        setCode(p.steps[0]?.starterCode || "");
        setLoading(false);
        loadPyodideRuntime();
      });
  }, [projectId, router]);

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
    } catch { setError("Failed to load Python runtime."); }
    setPyodideLoading(false);
  };

  const handleRun = useCallback(async () => {
    if (!pyodide) return;
    setRunning(true);
    setOutput("");
    setError("");
    setRanOnce(true);
    const fullCode = STDIN_WRAPPER + "\n" + code;
    try {
      pyodide.setStdout({ batched: (text: string) => setOutput((prev) => prev + text + "\n") });
      pyodide.setStderr({ batched: (text: string) => setError((prev) => prev + text + "\n") });
      await pyodide.runPythonAsync(fullCode);
    } catch (e: any) {
      const msg = e.message || "Error running code";
      if (msg.includes("PythonError")) setError((prev) => prev + msg.split("PythonError: ").pop() || msg);
      else setError((prev) => prev + msg);
    }
    setRunning(false);
  }, [pyodide, code]);

  const goToStep = (stepIndex: number) => {
    if (!project) return;
    if (stepIndex > currentStep && !ranOnce) {
      setShowNextWarning(true);
      return;
    }
    setCurrentStep(stepIndex);
    setShowHint(false);
    setShowSolution(false);
    setOutput("");
    setError("");
    setRanOnce(false);
    const accumulatedCode = project.steps.slice(0, stepIndex).map(s => s.solution).join("\n\n") + (stepIndex > 0 ? "\n\n" : "") + project.steps[stepIndex].starterCode;
    setCode(accumulatedCode);
  };

  const handleCompleteProject = async () => {
    if (!project) return;
    setSubmitting(true);
    const res = await fetch("/api/projects/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: project.id, code }),
    });
    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;
  if (!project) return null;

  const step = project.steps[currentStep];
  const isLastStep = currentStep === project.steps.length - 1;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100 bg-white/50 shrink-0">
        <Link href="/projects" className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Projects</span>
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-lg leading-none">{project.emoji}</span>
        <h1 className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{project.title}</h1>
        <span className="text-[10px] font-medium text-gray-400 ml-auto">Step {currentStep + 1}/{project.steps.length}</span>
        <Link href={`/projects/${project.id}/submissions`} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-bold text-gray-600 transition-all">
          <FileText size={11} /> My Submissions
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-[35%] overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-100 bg-white p-4 sm:p-6 flex flex-col">
          <div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Step {currentStep + 1}</span>
            <h2 className="text-base font-extrabold text-gray-800 mt-1 mb-3">{step.title}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm mb-4">{step.instruction}</p>

            {step.hint && (
              <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors mb-3">
                <Lightbulb size={14} />
                {showHint ? "Hide Hint" : "Need a Hint?"}
              </button>
            )}
            {showHint && step.hint && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 leading-relaxed">{step.hint}</div>
            )}

            <button onClick={() => setShowSolution(!showSolution)} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors mb-3">
              {showSolution ? <EyeOff size={14} /> : <Eye size={14} />}
              {showSolution ? "Hide Solution" : "Show Solution"}
            </button>
            {showSolution && (
              <pre className="bg-gray-900 text-green-300 text-[11px] font-mono p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed mb-4">
                <code>{step.solution}</code>
              </pre>
            )}
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all">
                <ChevronLeft size={14} /> Prev
              </button>
              <div className="flex items-center gap-1 mx-auto">
                {project.steps.map((_, i) => (
                  <button key={i} onClick={() => goToStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? "bg-emerald-500 scale-125" : i < currentStep ? "bg-emerald-300" : "bg-gray-200"}`} />
                ))}
              </div>
              {isLastStep ? (
                <button onClick={handleCompleteProject} disabled={!ranOnce || submitting || submitted}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {submitted ? "Submitted!" : "Complete Project"}
                </button>
              ) : (
                <button onClick={() => goToStep(currentStep + 1)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg rounded-xl transition-all">
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>

            {submitted && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-green-700 font-bold">Project submitted!</p>
                  <p className="text-[10px] text-green-600">Waiting for review. Check &quot;My Submissions&quot; for updates.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">code.py</span>
            <button onClick={handleRun} disabled={running || pyodideLoading || !pyodideReady}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95">
              {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              Run
            </button>
          </div>
          <div className="flex-1 lg:flex-[3] overflow-hidden min-h-[150px]">
            <CodeEditor value={code} onChange={setCode} />
          </div>
          <div className="shrink-0 lg:flex-[2] border-t border-[#3c3c3c] overflow-hidden">
            <OutputPanel output={output} error={error} running={running} />
          </div>
        </div>
      </div>

      {showNextWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowNextWarning(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slide-up text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Lightbulb size={24} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-800 mb-2">Run your code first!</h3>
            <p className="text-sm text-gray-500 mb-4">Make sure your code works by clicking <strong>Run</strong> before moving to the next step.</p>
            <button onClick={() => setShowNextWarning(false)} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-sm font-bold hover:shadow-lg transition-all">
              Got it!
            </button>
          </div>
        </div>
      )}

      {pyodideLoading && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-emerald-900 text-white text-xs sm:text-sm rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg z-50">
          <Loader2 size={14} className="animate-spin shrink-0" />
          <span className="truncate">Loading Python runtime (~15MB first time)...</span>
        </div>
      )}
    </div>
  );
}
