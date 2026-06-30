import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("project_id");
  const adminUserId = searchParams.get("admin_user_id");

  const supabase = createAdminClient();
  const targetUserId = adminUserId && user.role === "admin" ? adminUserId : user.id;

  let query = supabase
    .from("project_submissions")
    .select("*")
    .eq("user_id", targetUserId)
    .order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);

  const { data: submissions } = await query;

  return NextResponse.json({ submissions });
}
