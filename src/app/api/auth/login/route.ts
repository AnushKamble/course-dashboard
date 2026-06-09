import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (!profile || !profile.password_hash) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const valid = await verifyPassword(password, profile.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = await createToken({
    id: profile.id,
    username: profile.username,
    role: profile.role,
  });

  await setSessionCookie(token);

  return NextResponse.json({
    user: { id: profile.id, username: profile.username, role: profile.role },
  });
}
