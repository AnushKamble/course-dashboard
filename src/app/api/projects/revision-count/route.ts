import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ count: 0 });

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("project_submissions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "needs_revision");

  return NextResponse.json({ count: count || 0 });
}
