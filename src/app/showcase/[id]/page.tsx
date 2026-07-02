"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Loader2, FileText, CheckCircle, Sparkles } from "lucide-react";
import CodeSpotlight from "@/components/CodeSpotlight";
import TourCard from "@/components/TourCard";
import ShowcaseCanvas from "@/components/ShowcaseCanvas";
import { showcaseProjects } from "@/data/showcase";

declare global {
  interface Window { loadPyodide: (config: any) => Promise<any>; }
}

const CANVAS_HELPER = `
from js import document, window
from pyodide.ffi import create_proxy
import random
import math

_canvas = None
_ctx = None
_proxies = []

def _cleanup():
    for p in _proxies:
        try: p.destroy()
        except: pass
    _proxies.clear()

def create_canvas(w, h):
    global _canvas, _ctx
    _cleanup()
    container = document.getElementById("canvas-container")
    if container is None:
        return
    import js
    while container.firstChild:
        container.removeChild(container.firstChild)
    canv = document.createElement("canvas")
    canv.id = "showcase-canvas"
    canv.width = w
    canv.height = h
    canv.style.borderRadius = "12px"
    canv.style.display = "block"
    canv.style.margin = "0 auto"
    canv.style.width = str(w) + "px"
    canv.style.height = str(h) + "px"
    canv.style.maxWidth = "100%"
    container.appendChild(canv)
    _canvas = canv
    _ctx = canv.getContext("2d")

def _get_ctx():
    if _ctx is None:
        create_canvas(400, 400)
    return _ctx

def background(color):
    ctx = _get_ctx()
    ctx.fillStyle = _resolve_color(color)
    ctx.fillRect(0, 0, _canvas.width, _canvas.height)

def fill(color):
    ctx = _get_ctx()
    ctx.fillStyle = _resolve_color(color)

def rect(x, y, w, h):
    ctx = _get_ctx()
    ctx.fillRect(x, y, w, h)

def circle(x, y, r):
    ctx = _get_ctx()
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * math.pi)
    ctx.fill()

def clear():
    if _ctx:
        _ctx.clearRect(0, 0, _canvas.width, _canvas.height)

def random_color():
    r = random.randint(100, 255)
    g = random.randint(100, 255)
    b = random.randint(100, 255)
    return "rgb(" + str(r) + "," + str(g) + "," + str(b) + ")"

def rgb(r, g, b):
    return "rgb(" + str(r) + "," + str(g) + "," + str(b) + ")"

def _resolve_color(color):
    if color[0] == "#" or color[:3] == "rgb":
        return color
    named = {"red":"#ff4444","green":"#44aa44","blue":"#4488ff","yellow":"#ffdd44","cyan":"#44dddd","orange":"#ff8844","pink":"#ff66aa","purple":"#aa66ff","white":"#ffffff","black":"#222222","skyblue":"#87ceeb"}
    return named.get(color, color)

def get_width():
    if _canvas: return _canvas.width
    return 400

def get_height():
    if _canvas: return _canvas.height
    return 400

def on_key_press(fn):
    def handler(event):
        fn(event.key)
    proxy = create_proxy(handler)
    _proxies.append(proxy)
    document.addEventListener("keydown", proxy)

def on_click(fn):
    def handler(event):
        import js
        rect = _canvas.getBoundingClientRect()
        x = event.clientX - rect.left
        y = event.clientY - rect.top
        fn(x, y)
    proxy = create_proxy(handler)
    _proxies.append(proxy)
    _canvas.addEventListener("click", proxy)

def start_anim(fn):
    count = [0]
    def loop(timestamp):
        fn()
        count[0] += 1
        if count[0] < 10000:
            window.requestAnimationFrame(proxy)
    proxy = create_proxy(loop)
    _proxies.append(proxy)
    window.requestAnimationFrame(proxy)
`;

export default function ShowcaseTutorialPage() {
  const params = useParams();
  const router = useRouter();
  const project = showcaseProjects.find((p) => p.id === params.id);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [inTour, setInTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) { router.push(`/login?redirect=/showcase/${params.id}`); return; }
        if (!project) { router.push("/showcase"); return; }
        setUser(data.user);
        setLoading(false);
        loadPyodideRuntime();
      });
  }, [params.id, router]);

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
    } catch { /* ignore */ }
    setPyodideLoading(false);
  };

  const handleRun = useCallback(async () => {
    if (!pyodide || !project) return;
    setRunning(true);

    try {
      const container = document.getElementById("canvas-container");
      if (container) {
        while (container.firstChild) container.removeChild(container.firstChild);
      }

      const fullCode = CANVAS_HELPER + "\n\n" + project.fullCode;
      console.log("Running showcase code...");
      console.time("showcase-run");
      await pyodide.runPythonAsync(fullCode);
      console.timeEnd("showcase-run");
    } catch (e: any) {
      console.error("Showcase run error:", e);
      const container = document.getElementById("canvas-container");
      if (container) {
        const msg = typeof e === "object" ? (e.message || String(e)) : String(e);
        container.innerHTML = `<div style="color:#f87171;font-size:12px;text-align:center;padding:16px;">Error: ${msg.replace(/</g, "&lt;")}</div>`;
      }
    }
    setRunning(false);
  }, [pyodide, project]);

  const handleStartTour = () => {
    setInTour(true);
    setTourStep(0);
  };

  const handleExitTour = () => {
    setInTour(false);
    setTourStep(0);
  };

  const handleComplete = async () => {
    if (!project) return;
    setSubmitting(true);
    const res = await fetch("/api/projects/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: project.id, code: project.fullCode }),
    });
    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;
  if (!project) return null;

  const step = project.steps[tourStep];
  const activeCode = project.steps[tourStep]?.code || "";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100 bg-white/50 shrink-0">
        <Link href="/showcase" className="flex items-center gap-1 text-sm text-gray-400 hover:text-orange-600 transition-colors">
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Showcase</span>
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-lg leading-none">{project.emoji}</span>
        <h1 className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{project.title}</h1>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 ml-auto">
          🎮 Interactive
        </span>
        <Link href={`/projects/${project.id}/submissions`} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-bold text-gray-600 transition-all">
          <FileText size={11} /> Submissions
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e] lg:w-1/2">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">showcase.py</span>
            <div className="flex items-center gap-2">
              {!inTour && (
                <button onClick={handleStartTour}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white text-xs font-semibold rounded-lg transition-all active:scale-95">
                  <Sparkles size={13} /> Start Tour
                </button>
              )}
              {inTour && (
                <button onClick={handleExitTour}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95">
                  Exit Tour
                </button>
              )}
              <button onClick={handleRun} disabled={running || pyodideLoading || !pyodideReady}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95">
                {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Run
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto min-h-[150px]">
            <CodeSpotlight code={project.fullCode} activeCode={activeCode} stepIndex={tourStep + 1} inTour={inTour} />
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col border-t lg:border-t-0 lg:border-l border-[#3c3c3c] bg-gray-900">
          <div className="flex-1 min-h-0 overflow-auto">
            <ShowcaseCanvas hint={project.runHint} />
          </div>

          {inTour && step && (
            <div className="shrink-0 border-t border-[#3c3c3c] bg-white p-4">
              <TourCard
                step={step}
                stepIndex={tourStep}
                totalSteps={project.steps.length}
                onPrev={() => setTourStep((s) => Math.max(0, s - 1))}
                onNext={() => setTourStep((s) => Math.min(project.steps.length - 1, s + 1))}
                onSkip={handleExitTour}
                onComplete={handleComplete}
                completed={submitted}
                completing={submitting}
              />
            </div>
          )}

          {!inTour && submitted && (
            <div className="shrink-0 border-t border-[#3c3c3c] bg-white p-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-green-700 font-bold">Completed!</p>
                  <p className="text-[10px] text-green-600">This project has been submitted.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {pyodideLoading && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-emerald-900 text-white text-xs sm:text-sm rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg z-50">
          <Loader2 size={14} className="animate-spin shrink-0" />
          <span className="truncate">Loading Python runtime (~15MB first time)...</span>
        </div>
      )}
    </div>
  );
}
