import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, newPassword } = await req.json();

  if (!username || !newPassword || newPassword.length < 6) {
    return NextResponse.json(
      { error: "Username required and password min 6 characters" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const passwordHash = await hashPassword(newPassword);

  const { error } = await supabase
    .from("profiles")
    .update({ password_hash: passwordHash })
    .eq("username", username);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
