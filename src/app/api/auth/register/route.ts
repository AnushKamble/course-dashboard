import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Username required and password min 6 characters" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      username,
      full_name: username,
      password_hash: passwordHash,
      role: "student",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
