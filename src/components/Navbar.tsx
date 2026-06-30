"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, LogOut, LayoutDashboard, Shield, User, Sparkles, Trophy, Flame, Megaphone, MessageCircle, FileText, Code } from "lucide-react";
import ProfilePhoto from "./ProfilePhoto";
import StreakBadge from "./StreakBadge";

export default function Navbar() {
  const [user, setUser] = useState<{ id: string; username: string; role: string; avatar_url?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [doubtCount, setDoubtCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch unread doubt count every 15s
  useEffect(() => {
    if (!user) return;
    const fetchCount = () => fetch("/api/doubts/unread-count").then(r => r.json()).then(d => setDoubtCount(d.count || 0)).catch(() => {});
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 gradient-primary shadow-lg shadow-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1.5 sm:p-2 text-white group-hover:bg-white/30 transition-all group-hover:scale-110 group-hover:-rotate-3">
              <Sparkles size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-white drop-shadow-sm">
              Python Course
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            <NavLink href="/" icon={<BookOpen size={15} />} label="Lectures" />
            {user && <NavLink href="/projects" icon={<Code size={15} />} label="Projects" />}
            {user && <NavLink href="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />}
            {user && user.role !== "admin" && <NavLink href="/playground" icon={<Sparkles size={15} />} label="Playground" />}
            {user && <NavLink href="/report" icon={<FileText size={15} />} label="Report" />}
            {user && <NavLink href="/announcements" icon={<Megaphone size={15} />} label="Announcements" />}
            {user && <NavLink href="/leaderboard" icon={<Trophy size={15} />} label="Rankings" />}
            {user && <NavLink href="/doubts" icon={<MessageCircle size={15} />} label="Doubts" badge={doubtCount} />}
            {user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-yellow-200 hover:text-white hover:bg-white/15 transition-all">
                <Shield size={15} />
                Admin
              </Link>
            )}
            {user && <StreakBadge />}
            {!loading && !user && (
              <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-700 bg-white hover:bg-yellow-100 hover:shadow-lg transition-all active:scale-95 shadow-md">
                Sign In
              </Link>
            )}
            {user && (
              <>
                <div className="flex items-center gap-2 px-3 py-1">
                  <ProfilePhoto avatarUrl={user.avatar_url || null} username={user.username} size={28} onUpdate={(url) => setUser({...user, avatar_url: url})} />
                  <span className="text-xs font-medium text-emerald-100">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-red-200 hover:bg-white/15 transition-all">
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/20 transition-all active:scale-90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-3 border-t border-white/20 mt-2 pt-3 space-y-1 animate-slide-up">
            <MobileNavLink href="/" icon={<BookOpen size={15} />} label="Lectures" onClick={() => setMenuOpen(false)} />
            {user && <MobileNavLink href="/projects" icon={<Code size={15} />} label="Projects" onClick={() => setMenuOpen(false)} />}
            {user && <MobileNavLink href="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" onClick={() => setMenuOpen(false)} />}
            {user && user.role !== "admin" && <MobileNavLink href="/playground" icon={<Sparkles size={15} />} label="Playground" onClick={() => setMenuOpen(false)} />}
            {user && <MobileNavLink href="/report" icon={<FileText size={15} />} label="Report" onClick={() => setMenuOpen(false)} />}
            {user && <MobileNavLink href="/announcements" icon={<Megaphone size={15} />} label="Announcements" onClick={() => setMenuOpen(false)} />}
            {user && <MobileNavLink href="/leaderboard" icon={<Trophy size={15} />} label="Rankings" onClick={() => setMenuOpen(false)} />}
            {user && <MobileNavLink href="/doubts" icon={<MessageCircle size={15} />} label={`Doubts${doubtCount > 0 ? ` (${doubtCount})` : ""}`} onClick={() => setMenuOpen(false)} />}
            {user?.role === "admin" && (
              <MobileNavLink href="/admin" icon={<Shield size={15} />} label="Admin" onClick={() => setMenuOpen(false)} />
            )}
            {!loading && !user && (
              <MobileNavLink href="/login" icon={<User size={15} />} label="Sign In" onClick={() => setMenuOpen(false)} />
            )}
            {user && (
              <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <ProfilePhoto avatarUrl={user.avatar_url || null} username={user.username} size={28} onUpdate={(url) => setUser({...user, avatar_url: url})} />
                      <span className="text-sm font-medium text-emerald-100">{user.username}</span>
                    </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-red-200 hover:bg-white/15 transition-all">
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <Link href={href} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-100 hover:text-white hover:bg-white/15 transition-all relative">
      {icon}
      {label}
      {badge != null && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-lg shadow-rose-500/40 animate-bounce-soft">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/15 transition-all">
      {icon}
      {label}
    </Link>
  );
}
