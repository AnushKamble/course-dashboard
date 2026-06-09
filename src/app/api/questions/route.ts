import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .order("order_index", { ascending: true });

  return NextResponse.json({ questions });
}
