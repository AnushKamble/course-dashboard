import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: submissions } = await supabase
    .from("project_submissions")
    .select("*, profiles(username, avatar_url)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ submissions });
}
