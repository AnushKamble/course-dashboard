import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { Shield, Users, FileText, CheckSquare, ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const supabase = createAdminClient();

  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  const { count: totalLectures } = await supabase
    .from("lectures")
    .select("*", { count: "exact", head: true });

  const { count: totalQuestions } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true });

  const { count: pendingSubmissions } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "submitted");

  const cards = [
    { title: "Students", value: totalStudents || 0, icon: Users, gradient: "gradient-primary", href: "/admin/students" },
    { title: "Lectures", value: totalLectures || 0, icon: FileText, gradient: "gradient-secondary", href: "/" },
    { title: "Questions", value: totalQuestions || 0, icon: FileText, gradient: "gradient-accent", href: "/" },
    { title: "Pending Reviews", value: pendingSubmissions || 0, icon: CheckSquare, gradient: "gradient-green", href: "/admin/submissions" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="gradient-accent rounded-2xl p-3 text-white shadow-lg shadow-orange-500/20"><Shield size={22} className="sm:w-6 sm:h-6" /></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Admin Dashboard 🛡️</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage your Python course</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}
            className={`${card.gradient} rounded-2xl p-5 sm:p-6 shadow-lg text-white card-hover`}>
            <div className="bg-white/20 rounded-xl p-2 inline-flex mb-3"><card.icon size={18} /></div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{card.value}</p>
            <p className="text-xs sm:text-sm text-white/80 mt-1 font-semibold">{card.title}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Link href="/admin/submissions"
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 card-hover flex items-center justify-between group">
          <div>
            <div className="gradient-green rounded-xl p-2.5 text-white inline-flex mb-3 shadow-lg shadow-emerald-500/20"><CheckSquare size={18} /></div>
            <p className="font-extrabold text-gray-800">Review Submissions</p>
            <p className="text-sm text-gray-500 mt-1">{pendingSubmissions || 0} pending reviews</p>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/admin/students"
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 card-hover flex items-center justify-between group">
          <div>
            <div className="gradient-primary rounded-xl p-2.5 text-white inline-flex mb-3 shadow-lg shadow-emerald-500/20"><Users size={18} /></div>
            <p className="font-extrabold text-gray-800">View Students</p>
            <p className="text-sm text-gray-500 mt-1">{totalStudents || 0} enrolled students</p>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
