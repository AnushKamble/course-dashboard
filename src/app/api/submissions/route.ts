import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { question_id, code, output } = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("submissions")
    .insert({ user_id: user.id, question_id, code, output, status: "submitted" })
    .select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submission: data });
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("question_id");

  const supabase = createAdminClient();
  let query = supabase
    .from("submissions")
    .select("*, questions(id, title, description, order_index, lecture_id)")
    .eq("user_id", user.id);

  if (questionId) {
    query = query.eq("question_id", questionId);
  }

  const { data: submissions } = await query.order("submitted_at", { ascending: false });

  return NextResponse.json({ submissions });
}
