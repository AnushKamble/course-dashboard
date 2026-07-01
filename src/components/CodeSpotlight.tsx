"use client";

import { useMemo } from "react";

interface CodeSpotlightProps {
  code: string;
  activeCode: string;
  stepIndex: number;
  inTour: boolean;
}

export default function CodeSpotlight({ code, activeCode, stepIndex, inTour }: CodeSpotlightProps) {
  const parts = useMemo(() => {
    if (!inTour) return [{ text: code, highlighted: false }];

    const idx = code.indexOf(activeCode);
    if (idx === -1) return [{ text: code, highlighted: false }];

    const before = code.slice(0, idx);
    const match = code.slice(idx, idx + activeCode.length);
    const after = code.slice(idx + activeCode.length);

    return [
      { text: before, highlighted: false },
      { text: match, highlighted: true },
      { text: after, highlighted: false },
    ];
  }, [code, activeCode, inTour]);

  return (
    <pre className="relative font-mono text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap p-4 sm:p-5 min-h-[200px]">
      <code>
        {parts.map((part, i) => (
          <span
            key={i}
            className={`transition-all duration-300 ${
              part.highlighted
                ? "text-white bg-emerald-600/30 rounded-lg px-1 -mx-1 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20"
                : inTour
                  ? "text-gray-500/40"
                  : "text-gray-200"
            }`}
          >
            {part.text}
          </span>
        ))}
      </code>
      {inTour && (
        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          Step {stepIndex}
        </div>
      )}
    </pre>
  );
}
