import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const supabase = createAdminClient();
  let schedules: any[] = [];

  try {
    const { data } = await supabase.from("schedules").select("*").order("day_type");
    if (data) schedules = data;
  } catch {}

  return NextResponse.json({ schedules });
}

export async function PUT(req: Request) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, timing } = await req.json();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("schedules")
    .update({ timing, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
