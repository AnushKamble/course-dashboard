"use client";

import { useEffect, useState, useCallback } from "react";
import { Megaphone, Edit3, Clock, Calendar, X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Schedule {
  id: string;
  day_type: "weekday" | "weekend";
  label: string;
  days: string;
  timing: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [editTiming, setEditTiming] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => {});
    fetchData();
  }, []);

  async function fetchData() {
    const [sRes, aRes] = await Promise.all([
      fetch("/api/schedules"),
      fetch("/api/announcements"),
    ]);
    const sData = await sRes.json();
    const aData = await aRes.json();
    setSchedules(sData.schedules || []);
    setAnnouncements(aData.announcements || []);
  }

  const openEdit = (s: Schedule) => {
    setEditingSchedule(s);
    setEditTiming(s.timing);
  };

  const saveSchedule = async () => {
    if (!editingSchedule) return;
    await fetch("/api/schedules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingSchedule.id, timing: editTiming }),
    });
    setEditingSchedule(null);
    fetchData();
  };

  const postAnnouncement = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    setNewTitle("");
    setNewContent("");
    setShowNewAnnouncement(false);
    fetchData();
  };

  const deleteAnnouncement = async (id: string) => {
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    fetchData();
  };

  const isAdmin = user?.role === "admin";
  const weekday = schedules.find((s) => s.day_type === "weekday");
  const weekend = schedules.find((s) => s.day_type === "weekend");

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 shadow-md mb-4">
            <Megaphone className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800">Announcements</h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">Class schedules, updates, and important notices</p>
        </div>

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Weekday */}
          {weekday && (
            <div className="relative group rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-[2px] shadow-xl shadow-emerald-200/50 animate-slide-up">
              <div className="rounded-2xl bg-white p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{weekday.label}</h2>
                      <p className="text-xs font-semibold text-emerald-500 tracking-wide uppercase">{weekday.days}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => openEdit(weekday)} className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-base font-bold text-gray-800">{weekday.timing}</span>
                </div>
              </div>
            </div>
          )}

          {/* Weekend */}
          {weekend && (
            <div className="relative group rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 p-[2px] shadow-xl shadow-violet-200/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="rounded-2xl bg-white p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{weekend.label}</h2>
                      <p className="text-xs font-semibold text-violet-500 tracking-wide uppercase">{weekend.days}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => openEdit(weekend)} className="p-2 rounded-xl text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-500 shrink-0" />
                  <span className="text-base font-bold text-gray-800">{weekend.timing}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Schedule Modal */}
        {editingSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setEditingSchedule(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Schedule</h3>
                <button onClick={() => setEditingSchedule(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Timing</label>
                  <input value={editTiming} onChange={(e) => setEditTiming(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all" placeholder="e.g. 6:00 PM - 7:30 PM" />
                </div>
                <button onClick={saveSchedule} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-200/50 transition-all active:scale-[0.98]">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <Megaphone size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Latest Updates</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {isAdmin && (
            <button onClick={() => setShowNewAnnouncement(!showNewAnnouncement)} className="w-full py-3.5 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-2">
              <Plus size={18} />
              New Announcement
            </button>
          )}

          {showNewAnnouncement && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 animate-slide-up">
              <div className="space-y-4">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all" placeholder="Announcement title..." />
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none" placeholder="Write your announcement..." />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowNewAnnouncement(false); setNewTitle(""); setNewContent(""); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                  <button onClick={postAnnouncement} disabled={!newTitle.trim() || !newContent.trim()} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">Post</button>
                </div>
              </div>
            </div>
          )}

          {announcements.length === 0 && !showNewAnnouncement && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No announcements yet</p>
            </div>
          )}

          {announcements.map((a, i) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                className="w-full flex items-start gap-4 p-5 sm:p-6 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0 mt-0.5">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-gray-800 truncate">{a.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {expandedId === a.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>
                  <p className={`mt-1 text-sm leading-relaxed ${expandedId === a.id ? "text-gray-600" : "text-gray-400 line-clamp-1"}`}>{a.content}</p>
                </div>
              </button>
              {expandedId === a.id && isAdmin && (
                <div className="px-5 sm:px-6 pb-4 flex justify-end border-t border-gray-100 pt-3">
                  <button onClick={() => deleteAnnouncement(a.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
