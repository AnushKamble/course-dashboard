import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question_id, code, output, question_text } = await req.json();
  if (!question_text?.trim()) {
    return NextResponse.json({ error: "Question text is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("doubts")
    .insert({ question_id, user_id: user.id, code, output, question_text })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ doubt: data });
}

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  let query = supabase
    .from("doubts")
    .select("*, questions(title, order_index), profiles(username, avatar_url)");

  if (user.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { data: doubts } = await query.order("created_at", { ascending: false });

  return NextResponse.json({ doubts: doubts || [] });
}
