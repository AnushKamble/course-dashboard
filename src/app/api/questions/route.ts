import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lectureId = searchParams.get("lecture_id");

  const supabase = createAdminClient();
  let query = supabase
    .from("questions")
    .select("*, lectures(title, order_index)")
    .order("order_index", { ascending: true });

  if (lectureId) {
    query = query.eq("lecture_id", lectureId);
  }

  const { data: questions } = await query;

  return NextResponse.json({ questions });
}
