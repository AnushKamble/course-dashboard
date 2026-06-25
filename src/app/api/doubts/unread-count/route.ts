import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ count: 0 });

  const supabase = createAdminClient();

  if (user.role === "admin") {
    const { count } = await supabase
      .from("doubts")
      .select("*", { count: "exact", head: true })
      .eq("resolved", false);
    return NextResponse.json({ count: count || 0 });
  }

  // Student: count doubts where admin has replied since last viewed
  const { data } = await supabase
    .from("doubts")
    .select("id, last_student_viewed_at")
    .eq("user_id", user.id);

  let unread = 0;
  if (data) {
    for (const d of data) {
      const lastView = d.last_student_viewed_at || "1970-01-01T00:00:00Z";
      const { count } = await supabase
        .from("doubt_messages")
        .select("*", { count: "exact", head: true })
        .eq("doubt_id", d.id)
        .neq("sender_id", user.id)
        .gt("created_at", lastView);
      if (count && count > 0) unread += count;
    }
  }

  return NextResponse.json({ count: unread });
}
