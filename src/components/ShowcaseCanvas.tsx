"use client";

interface ShowcaseCanvasProps {
  hint: string;
}

export default function ShowcaseCanvas({ hint }: ShowcaseCanvasProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] h-full p-4">
      <div
        id="canvas-container"
        className="flex items-center justify-center w-full min-h-[200px]"
      >
        <div className="text-gray-500 text-xs text-center">
          <p>Click <strong>Run</strong> to see the output here</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 mt-3 text-center">{hint}</p>
    </div>
  );
}
