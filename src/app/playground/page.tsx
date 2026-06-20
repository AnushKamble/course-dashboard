"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Loader2, Sparkles, Terminal } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";

declare global {
  interface Window { loadPyodide: (config: any) => Promise<any>; pyodide?: any; }
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

export default function PlaygroundPage() {
  const router = useRouter();
  const [code, setCode] = useState("# 🎮 Python Playground\n# Type any Python code here and run it!\nprint('Hello, Python!')\nprint(2 + 2)\n");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideReady, setPyodideReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (!d.user) router.push("/login"); });
    loadPyodide();
  }, []);

  const loadPyodide = async () => {
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
  };

  const handleRun = useCallback(async () => {
    if (!pyodide) return;
    setRunning(true);
    setOutput("");
    setError("");
    try {
      pyodide.setStdout({ batched: (text: string) => setOutput((prev) => prev + text + "\n") });
      pyodide.setStderr({ batched: (text: string) => setError((prev) => prev + text + "\n") });
      await pyodide.runPythonAsync(STDIN_WRAPPER + "\n" + code);
    } catch (e: any) {
      setError((prev) => prev + (e.message || "Error"));
    }
    setRunning(false);
  }, [pyodide, code]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100 bg-white/50 shrink-0">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-1.5 text-white shadow-lg">
          <Sparkles size={18} />
        </div>
        <h1 className="text-sm sm:text-base font-extrabold text-gray-800">Python Playground</h1>
        <p className="text-xs text-gray-400 hidden sm:block">Experiment with Python code freely ✨</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
            <span className="text-[11px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">playground.py</span>
            <button onClick={handleRun} disabled={running || !pyodideReady}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95">
              {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              Run
            </button>
          </div>
          <div className="flex-1 overflow-hidden min-h-[150px]">
            <CodeEditor value={code} onChange={setCode} />
          </div>
          <div className="shrink-0 border-t border-[#3c3c3c] overflow-hidden max-h-[40%]">
            <OutputPanel output={output} error={error} running={running} />
          </div>
        </div>
      </div>
    </div>
  );
}
