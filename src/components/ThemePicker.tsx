"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";

const themes = [
  { id: "green", label: "Green", bg: "bg-emerald-500" },
  { id: "dark", label: "Dark", bg: "bg-gray-800" },
  { id: "ocean", label: "Ocean", bg: "bg-blue-500" },
  { id: "sunset", label: "Sunset", bg: "bg-orange-500" },
  { id: "aurora", label: "Aurora", bg: "bg-purple-500" },
];

interface Props {
  current: string;
  onThemeChange: (theme: string) => void;
}

export default function ThemePicker({ current, onThemeChange }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = async (themeId: string) => {
    await fetch("/api/gamification/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: themeId }),
    });
    onThemeChange(themeId);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-100 hover:text-white hover:bg-white/15 transition-all"
      >
        <Palette size={15} />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[160px] animate-slide-up">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <div className={`w-4 h-4 rounded-full ${t.bg} ring-2 ring-white shadow-sm`} />
                <span>{t.label}</span>
                {current === t.id && <Check size={14} className="ml-auto text-emerald-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
