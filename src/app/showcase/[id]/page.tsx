"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Loader2, FileText, CheckCircle, Sparkles } from "lucide-react";
import CodeSpotlight from "@/components/CodeSpotlight";
import TourCard from "@/components/TourCard";
import ShowcaseCanvas from "@/components/ShowcaseCanvas";
import { showcaseProjects } from "@/data/showcase";

declare global {
  interface Window { loadPyodide: (config: any) => Promise<any>; pyodide?: any; __events: any[]; }
}

const CANVAS_HELPER = `
from js import window, document
import random
import math

_canvas = None
_ctx = None

def create_canvas(w, h):
    global _canvas, _ctx
    _canvas = document.getElementById("showcase-canvas")
    if _canvas is None:
        return
    _canvas.width = w
    _canvas.height = h
    _canvas.style.width = str(w) + "px"
    _canvas.style.height = str(h) + "px"
    _ctx = _canvas.getContext("2d")

def poll_events():
    evts = window.__events
    if evts is None:
        return []
    result = []
    while len(evts) > 0:
        result.append(evts.shift())
    return result

def background(color):
    if _ctx is None: return
    _ctx.fillStyle = _resolve(color)
    _ctx.fillRect(0, 0, _canvas.width, _canvas.height)

def fill(color):
    if _ctx is None: return
    _ctx.fillStyle = _resolve(color)

def rect(x, y, w, h):
    if _ctx is None: return
    _ctx.fillRect(x, y, w, h)

def circle(x, y, r):
    if _ctx is None: return
    _ctx.beginPath()
    _ctx.arc(x, y, r, 0, 2 * math.pi)
    _ctx.fill()

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

def _resolve(color):
    if color[0] == "#" or color[:3] == "rgb":
        return color
    named = {"red":"#ff4444","green":"#44aa44","blue":"#4488ff","yellow":"#ffdd44","cyan":"#44dddd","orange":"#ff8844","pink":"#ff66aa","purple":"#aa66ff","white":"#ffffff","black":"#222222","skyblue":"#87ceeb"}
    return named.get(color, color)

def line(x1, y1, x2, y2):
    if _ctx is None: return
    _ctx.beginPath()
    _ctx.moveTo(x1, y1)
    _ctx.lineTo(x2, y2)
    _ctx.stroke()
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

  const animRef = useRef<number | null>(null);
  const animRunningRef = useRef(false);

  // Set up global JS event listeners once
  useEffect(() => {
    window.__events = [];

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (window.__events) {
        window.__events.push({ type: "keydown", code: e.code, key: e.key });
      }
    };

    function getCanvasCoords(e: MouseEvent) {
      const canvas = document.getElementById("showcase-canvas");
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = (canvas as HTMLCanvasElement).width / rect.width;
      const scaleY = (canvas as HTMLCanvasElement).height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }

    const onMouseDown = (e: MouseEvent) => {
      const coords = getCanvasCoords(e);
      if (coords && window.__events) {
        window.__events.push({ type: "mousedown", x: coords.x, y: coords.y });
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      const coords = getCanvasCoords(e);
      if (coords && window.__events) {
        window.__events.push({ type: "mouseup", x: coords.x, y: coords.y });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const coords = getCanvasCoords(e);
      if (coords && window.__events) {
        window.__events.push({ type: "mousemove", x: coords.x, y: coords.y });
      }
    };

    document.addEventListener("keydown", onKeyDown, { capture: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      window.__events = [];
      animRunningRef.current = false;
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      document.removeEventListener("keydown", onKeyDown, { capture: true });
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

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

  const runStep = useCallback(async () => {
    if (!animRunningRef.current) return;
    try {
      await window.pyodide.runPythonAsync("step()");
    } catch (e: any) {
      console.error("step error:", e);
    }
    if (animRunningRef.current) {
      animRef.current = requestAnimationFrame(runStep);
    }
  }, []);

  const handleRun = useCallback(async (event?: React.MouseEvent) => {
    if (animRunningRef.current) return;
    const p = showcaseProjects.find((x) => x.id === params.id);
    if (!pyodide || !p) return;

    if (event) (event.currentTarget as HTMLElement).blur();

    setRunning(true);
    window.__events = [];

    try {
      await pyodide.runPythonAsync(CANVAS_HELPER + "\n\n" + p.fullCode);

      animRunningRef.current = true;
      animRef.current = requestAnimationFrame(runStep);
    } catch (e: any) {
      console.error("Run error:", e);
    }
    setRunning(false);
  }, [pyodide, params.id, runStep]);

  const handleStartTour = () => {
    setInTour(true);
    setTourStep(0);
  };

  const handleExitTour = () => {
    setInTour(false);
    setTourStep(0);
  };

  const handleComplete = async () => {
    const p = showcaseProjects.find((x) => x.id === params.id);
    if (!p) return;
    setSubmitting(true);
    const res = await fetch("/api/projects/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: p.id, code: p.fullCode }),
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
              <button onClick={(e) => handleRun(e)} disabled={running || pyodideLoading || !pyodideReady}
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
