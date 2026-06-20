"use client";

import { useState } from "react";

interface Props {
  url?: string | null;
  username: string;
  size?: number;
  className?: string;
}

export default function AvatarDisplay({ url, username, size = 32, className = "" }: Props) {
  const [error, setError] = useState(false);
  const initials = username.slice(0, 2).toUpperCase();

  if (url && !error) {
    return (
      <img
        src={url}
        alt={username}
        onError={() => setError(true)}
        className={`rounded-full object-cover shrink-0 ring-2 ring-white/50 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-extrabold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
