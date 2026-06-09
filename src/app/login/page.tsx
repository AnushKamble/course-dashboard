"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, Sparkles } from "lucide-react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
    } else {
      window.location.href = redirectTo;
    }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-10 animate-float">🐍</div>
        <div className="absolute bottom-1/4 left-1/4 text-3xl opacity-10 animate-bounce-soft">✨</div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-6 sm:p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="gradient-primary inline-flex rounded-2xl p-3 text-white shadow-lg shadow-purple-500/20 mb-4">
              <LogIn size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back! 🎉</h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to continue your Python journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-white py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New student?{" "}
            <Link href="/register" className="font-extrabold bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 size={32} className="animate-spin text-purple-600" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
