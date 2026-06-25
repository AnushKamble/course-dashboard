"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, CheckCircle, Clock, Code, MessageCircle } from "lucide-react";

export default function DoubtConversationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doubt, setDoubt] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.user) { router.push("/login"); return; }
      setUser(d.user);
    });
    fetch(`/api/doubts/${id}`).then(r => r.json()).then(d => {
      if (d.error) { router.push("/doubts"); return; }
      setDoubt(d.doubt);
    });
    fetchMessages();
  }, [id]);

  // Mark as viewed on mount (students only)
  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      fetch(`/api/doubts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark_viewed: true }),
      });
    }
  }, [loading, user]);

  // Poll every 3s
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchMessages = async () => {
    const res = await fetch(`/api/doubts/${id}/messages`);
    const d = await res.json();
    setMessages(d.messages || []);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    const res = await fetch(`/api/doubts/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });
    const d = await res.json();
    if (d.message) {
      setMessages(prev => [...prev, d.message]);
      setNewMessage("");
    }
    setSending(false);
  };

  const toggleResolved = async () => {
    await fetch(`/api/doubts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved: !doubt.resolved }),
    });
    setDoubt({ ...doubt, resolved: !doubt.resolved });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;
  if (!doubt) return null;

  const isAdmin = user?.role === "admin";
  const isStudentOwner = user?.id === doubt.user_id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link href={isAdmin ? "/admin/doubts" : "/doubts"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to {isAdmin ? "All Doubts" : "My Doubts"}
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-base sm:text-lg font-bold text-white truncate">{doubt.questions?.title || "General Doubt"}</h1>
                {doubt.resolved ? (
                  <span className="text-[11px] font-bold text-emerald-200 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Resolved</span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-200 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={10} /> Open</span>
                )}
              </div>
              {isAdmin && <p className="text-xs text-purple-200">Student: {doubt.profiles?.username || "Unknown"}</p>}
              <p className="text-[11px] text-purple-200/70 mt-0.5">{new Date(doubt.created_at).toLocaleString("en-IN")}</p>
            </div>
            {isAdmin && (
              <button onClick={toggleResolved} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${doubt.resolved ? "bg-white/20 text-white hover:bg-white/30" : "bg-white text-purple-700 hover:bg-purple-50"}`}>
                {doubt.resolved ? "Reopen" : "Resolve"}
              </button>
            )}
          </div>
          <div className="mt-3 bg-white/15 backdrop-blur rounded-xl p-3 text-sm text-white/90 leading-relaxed">
            {doubt.question_text}
          </div>
          {doubt.code && (
            <details className="mt-2 group">
              <summary className="text-[11px] font-semibold text-purple-200 hover:text-white cursor-pointer list-none transition-colors">
                <Code size={12} className="inline mr-1" />
                {doubt.questions?.question_type === "dry_run" ? "View predicted output" : "View code & output"}
              </summary>
              <div className="mt-2 bg-[#1e1e1e] rounded-xl overflow-hidden">
                <pre className="p-3 text-[13px] font-mono text-green-300 overflow-x-auto whitespace-pre-wrap max-h-48 leading-relaxed">{doubt.code}</pre>
                {doubt.output && (
                  <>
                    <div className="border-t border-gray-700 px-3 py-1 bg-gray-900"><span className="text-[10px] font-bold text-gray-400 uppercase">Output</span></div>
                    <pre className="px-3 pb-3 text-[13px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">{doubt.output}</pre>
                  </>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-400">No replies yet</p>
              <p className="text-xs text-gray-400 mt-1">{isAdmin ? "Type a reply below." : "Waiting for the instructor."}</p>
            </div>
          )}
          {messages.map((m) => {
            const isMine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] sm:max-w-[65%]`}>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${isMine ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-br-md" : "bg-white border border-gray-200 text-gray-700 rounded-bl-md"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.message}</p>
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${isMine ? "text-right" : "text-left"}`}>
                    {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    {!isMine && m.profiles?.username && <span className="ml-1.5 font-medium text-purple-500">{m.profiles.username}</span>}
                    {isMine && <span className="ml-1.5 text-gray-400">You</span>}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply box */}
        {(isAdmin || isStudentOwner) && (
          <div className="border-t border-gray-100 p-3 sm:p-4 flex items-center gap-3 bg-white">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAdmin ? "Reply to this doubt..." : "Add a follow-up..."}
              rows={1}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-95 shrink-0"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
