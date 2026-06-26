import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", id)
    .single();

  return NextResponse.json(data || { username: "Unknown" });
}
