import { Terminal, Loader2 } from "lucide-react";

interface Props {
  output: string;
  error?: string;
  running: boolean;
}

export default function OutputPanel({ output, error, running }: Props) {
  return (
    <div className="bg-[#1e1e1e]">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-emerald-900/40 via-emerald-900/20 to-transparent">
        <Terminal size={13} className="text-emerald-400 shrink-0" />
        <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Output</span>
        {running && (
          <span className="flex items-center gap-1 ml-auto text-[11px] text-cyan-400">
            <Loader2 size={11} className="animate-spin" />
            Running...
          </span>
        )}
      </div>
      <pre className="px-3 sm:px-4 pb-4 text-[13px] font-mono text-green-400 overflow-auto max-h-[300px] sm:max-h-[350px] whitespace-pre-wrap m-0 leading-relaxed">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : output ? (
          output
        ) : (
          <span className="text-gray-600 italic">Click &quot;Run&quot; to execute your code</span>
        )}
      </pre>
    </div>
  );
}
