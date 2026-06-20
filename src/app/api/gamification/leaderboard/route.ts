import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = createAdminClient();

  let leaders: any[] = [];
  try {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, xp, level, streak_count, avatar_url")
      .eq("role", "student")
      .order("xp", { ascending: false })
      .limit(20);
    if (data) leaders = data;
  } catch {}

  return NextResponse.json({ leaders });
}
