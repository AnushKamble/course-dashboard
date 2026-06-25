"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, CheckCircle, Clock, Code, User, MessageCircle, Phone, Video, MoreHorizontal } from "lucide-react";
import AvatarDisplay from "@/components/AvatarDisplay";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
  const otherPerson = isAdmin ? doubt.profiles?.username : "Instructor";
  const otherAvatar = isAdmin ? doubt.profiles?.avatar_url : null;

  // Group messages by date
  const grouped: { date: string; msgs: typeof messages }[] = [];
  for (const m of messages) {
    const dateKey = new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const last = grouped[grouped.length - 1];
    if (last && last.date === dateKey) {
      last.msgs.push(m);
    } else {
      grouped.push({ date: dateKey, msgs: [m] });
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#efeae2]">
      {/* Chat header — WhatsApp style */}
      <div className="bg-[#075e54] text-white px-4 sm:px-6 py-3 flex items-center gap-3 shrink-0 shadow-lg z-10">
        <Link href={isAdmin ? "/admin/doubts" : "/doubts"} className="p-1 -ml-1 hover:bg-white/20 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <AvatarDisplay url={otherAvatar} username={otherPerson || "?"} size={36} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{otherPerson}</p>
          <p className="text-[11px] text-emerald-200">{doubt.questions?.title || "General Doubt"}</p>
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <button onClick={toggleResolved} className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 ${doubt.resolved ? "bg-white/20 text-white" : "bg-emerald-500 text-white"}`}>
              {doubt.resolved ? "Reopen" : "Resolve"}
            </button>
          )}
        </div>
      </div>

      {/* Original doubt bubble */}
      <div className="px-4 sm:px-6 pt-3 pb-1 bg-[#efeae2]">
        <div className="max-w-[85%] sm:max-w-[65%] mx-auto">
          <div className="bg-white rounded-lg rounded-tl-none shadow-sm p-3 text-sm text-gray-700 leading-relaxed relative">
            <p>{doubt.question_text}</p>
            <p className="text-[10px] text-gray-400 mt-1.5 text-right">{new Date(doubt.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
            {doubt.resolved && <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">Resolved</div>}
          </div>
          {doubt.code && (
            <details className="mt-1 group">
              <summary className="text-[11px] font-semibold text-gray-500 hover:text-purple-700 cursor-pointer list-none text-center transition-colors">
                {doubt.questions?.question_type === "dry_run" ? "View predicted output" : "View code & output"}
              </summary>
              <div className="mt-1.5 bg-[#1e1e1e] rounded-lg overflow-hidden shadow">
                <pre className="p-3 text-[12px] font-mono text-green-300 overflow-x-auto whitespace-pre-wrap max-h-36 leading-relaxed">{doubt.code}</pre>
                {doubt.output && (
                  <>
                    <div className="border-t border-gray-700 px-3 py-1 bg-gray-900"><span className="text-[9px] font-bold text-gray-400 uppercase">Output</span></div>
                    <pre className="px-3 pb-3 text-[12px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">{doubt.output}</pre>
                  </>
                )}
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Messages area — WhatsApp chat style */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 space-y-1 bg-[#efeae2]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}>
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-white/80 backdrop-blur rounded-2xl px-6 py-8 shadow-sm max-w-xs">
              <MessageCircle size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">{isAdmin ? "Tap reply below to respond." : "Waiting for the instructor to reply."}</p>
            </div>
          </div>
        )}

        {grouped.map((group, gi) => (
          <div key={gi}>
            <div className="flex justify-center my-3">
              <span className="text-[11px] text-gray-500 bg-white/70 backdrop-blur px-3 py-1 rounded-full shadow-sm">{group.date}</span>
            </div>
            {group.msgs.map((m, mi) => {
              const isMine = m.sender_id === user?.id;
              const showAvatar = !isMine && (mi === 0 || group.msgs[mi - 1]?.sender_id !== m.sender_id);
              const time = new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={m.id} className={`flex items-end gap-1.5 mb-1 ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <div className={`w-7 h-7 rounded-full mb-1 shrink-0 transition-opacity ${showAvatar ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                      <AvatarDisplay url={otherAvatar} username={otherPerson || "?"} size={28} />
                    </div>
                  )}
                  <div className={`max-w-[80%] sm:max-w-[60%] ${isMine ? "mr-0" : "ml-0"}`}>
                    <div className={`px-3 py-2 text-sm leading-relaxed shadow-sm ${isMine ? "bg-[#d9fdd3] text-gray-800 rounded-lg rounded-tr-sm" : "bg-white text-gray-800 rounded-lg rounded-tl-sm"}`}>
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? "text-gray-400 text-right" : "text-gray-400 text-right"}`}>{time}</p>
                    </div>
                  </div>
                  {isMine && (
                    <div className="w-7 h-7 rounded-full mb-1 shrink-0">
                      <AvatarDisplay url={user?.avatar_url} username={user?.username || "You"} size={28} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply bar — WhatsApp style */}
      {(isAdmin || isStudentOwner) && (
        <div className="bg-[#f0f2f5] px-4 sm:px-6 py-2.5 flex items-center gap-3 shrink-0 border-t border-gray-200/50">
          <div className="flex-1 flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAdmin ? "Type a reply..." : "Type a message..."}
              rows={1}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-700 resize-none focus:outline-none rounded-2xl max-h-20"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 rounded-full bg-[#075e54] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0b7a6e] transition-all active:scale-95 shrink-0 flex items-center justify-center shadow-sm"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
