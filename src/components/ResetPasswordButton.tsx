"use client";

import { useState } from "react";
import { KeyRound, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Props {
  username: string;
}

export default function ResetPasswordButton({ username }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleReset = async () => {
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword: password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Password reset successfully! ✅" });
        setPassword("");
        setTimeout(() => { setOpen(false); setMessage(null); }, 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to reset password" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-800 text-sm font-bold transition-colors"
      >
        <KeyRound size={14} />
        Reset
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !loading && setOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-800">Reset Password</h3>
              <p className="text-sm text-gray-500 mt-1">for <span className="font-bold text-gray-700">{username}</span></p>
            </div>
            <div className="px-5 py-4">
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                autoFocus
              />
              {message && (
                <div className={`flex items-center gap-1.5 mt-3 text-sm font-semibold ${message.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {message.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {message.text}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => { setOpen(false); setMessage(null); setPassword(""); }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2.5 rounded-full font-bold text-sm hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                {loading ? "Resetting..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
