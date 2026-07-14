"use client";

interface ShowcaseCanvasProps {
  hint: string;
}

export default function ShowcaseCanvas({ hint }: ShowcaseCanvasProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] h-full p-4">
      <div className="flex items-center justify-center w-full min-h-[200px]">
        <canvas
          id="showcase-canvas"
          className="bg-gray-800 rounded-xl"
          width={400}
          height={400}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </div>
      <p className="text-[11px] text-gray-500 mt-3 text-center">{hint}</p>
    </div>
  );
}
