import { createAdminClient } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { StudentDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (!profile || profile.role !== "student") notFound();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, questions(title, description, order_index)")
    .eq("user_id", id)
    .order("submitted_at", { ascending: false });

  const { data: allQuestions } = await supabase.from("questions").select("*").order("order_index");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 mb-6 transition-colors"><ArrowLeft size={16} />Back to Students</Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="gradient-primary rounded-2xl p-3 text-white shadow-lg shadow-purple-500/20"><User size={22} className="sm:w-6 sm:h-6" /></div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{profile.username || "Unnamed"}</h1>
          <p className="text-xs sm:text-sm text-gray-500">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <StudentDetailClient submissions={submissions || []} allQuestions={allQuestions || []} />
    </div>
  );
}
