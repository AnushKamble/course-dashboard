import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data: lectures } = await supabase
    .from("lectures")
    .select("*")
    .order("order_index", { ascending: true });

  return NextResponse.json({ lectures });
}
