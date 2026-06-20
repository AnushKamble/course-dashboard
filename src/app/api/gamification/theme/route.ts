import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { theme } = await req.json();
  const validThemes = ["green", "dark", "ocean", "sunset", "aurora"];
  if (!validThemes.includes(theme)) {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase.from("profiles").update({ theme }).eq("id", user.id);

  return NextResponse.json({ success: true, theme });
}
