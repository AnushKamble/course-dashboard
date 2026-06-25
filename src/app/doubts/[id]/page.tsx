"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, CheckCircle, Clock, Code, User, ShieldCheck, MessageCircle } from "lucide-react";

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
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-base sm:text-lg font-bold text-gray-800">{doubt.questions?.title || "General Doubt"}</h1>
                {doubt.resolved ? (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} /> Resolved
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock size={10} /> Open
                  </span>
                )}
              </div>
              {isAdmin && (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <User size={12} /> {doubt.profiles?.username || "Unknown"}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{new Date(doubt.created_at).toLocaleString("en-IN")}</p>
            </div>
            {isAdmin && (
              <button onClick={toggleResolved} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${doubt.resolved ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                {doubt.resolved ? "Reopen" : "Mark Resolved"}
              </button>
            )}
          </div>
          <div className="mt-3 bg-purple-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
            {doubt.question_text}
          </div>
          {doubt.code && (
            <details className="mt-3 group">
              <summary className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-purple-600 cursor-pointer list-none transition-colors">
                <Code size={13} />
                {doubt.questions?.question_type === "dry_run" ? "Predicted Output" : "Code & Output"}
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
        <div className="h-[400px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No replies yet. {isAdmin ? "Reply to this doubt." : "Waiting for the instructor."}</p>
            </div>
          )}
          {messages.map((m) => {
            const isMine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] ${isMine ? "order-1" : "order-1"}`}>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMine ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-br-md" : "bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm"}`}>
                    <p>{m.message}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    {!isMine && m.profiles?.username && (
                      <span className="text-[10px] font-medium text-purple-500">{m.profiles.username}</span>
                    )}
                    {isMine && <span className="text-[10px] text-gray-400">You</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply box */}
        {(isAdmin || isStudentOwner) && (
          <div className="border-t border-gray-100 p-3 sm:p-4 flex items-center gap-3">
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
