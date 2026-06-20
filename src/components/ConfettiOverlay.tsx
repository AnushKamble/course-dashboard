"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface Props {
  fire: boolean;
  type?: "correct" | "levelup" | "badge";
}

export default function ConfettiOverlay({ fire, type = "correct" }: Props) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!fire || hasFired.current) return;
    hasFired.current = true;

    if (type === "correct") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#34D399", "#FBBF24", "#F43F5E", "#3B82F6"],
      });
    } else if (type === "levelup") {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#FBBF24", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"],
      });
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.4 }, colors: ["#FBBF24", "#F59E0B"] });
      }, 200);
    } else if (type === "badge") {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#8B5CF6", "#A78BFA", "#FBBF24", "#10B981"],
        shapes: ["star", "circle"],
      });
    }

    return () => { hasFired.current = false; };
  }, [fire, type]);

  return null;
}
