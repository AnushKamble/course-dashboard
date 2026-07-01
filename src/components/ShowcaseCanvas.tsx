"use client";

import { useEffect, useRef } from "react";

interface ShowcaseCanvasProps {
  hint: string;
}

export default function ShowcaseCanvas({ hint }: ShowcaseCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const existing = container.querySelector("canvas");
    if (existing) {
      existing.remove();
    }

    const canv = document.createElement("canvas");
    canv.id = "showcase-canvas";
    canv.width = 400;
    canv.height = 400;
    canv.style.cssText =
      "border-radius:12px;display:block;margin:0 auto;width:400px;height:400px;max-width:100%;background:#1e1e1e";
    container.appendChild(canv);

    return () => {
      const c = container.querySelector("canvas");
      if (c) c.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div
        ref={containerRef}
        id="canvas-container"
        className="flex items-center justify-center w-full"
      />
      <p className="text-[11px] text-gray-500 mt-3 text-center">{hint}</p>
    </div>
  );
}
