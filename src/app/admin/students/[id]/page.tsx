import { createAdminClient } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { StudentDetailClient } from "./client";
import ResetPasswordButton from "@/components/ResetPasswordButton";
import AvatarDisplay from "@/components/AvatarDisplay";

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
      <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 mb-6 transition-colors"><ArrowLeft size={16} />Back to Students</Link>

      <div className="flex items-center gap-4 mb-8">
        <AvatarDisplay url={profile.avatar_url} username={profile.username} size={56} />
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{profile.username || "Unnamed"}</h1>
          <p className="text-xs sm:text-sm text-gray-500">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
        <ResetPasswordButton username={profile.username} />
      </div>

      <StudentDetailClient submissions={submissions || []} allQuestions={allQuestions || []} />
    </div>
  );
}

