import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: doubt } = await supabase.from("doubts").select("user_id").eq("id", id).single();
  if (!doubt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "admin" && doubt.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: messages } = await supabase
    .from("doubt_messages")
    .select("*, profiles(username, avatar_url)")
    .eq("doubt_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ messages: messages || [] });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { message } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: doubt } = await supabase.from("doubts").select("user_id").eq("id", id).single();
  if (!doubt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "admin" && doubt.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("doubt_messages")
    .insert({ doubt_id: id, sender_id: user.id, message })
    .select("*, profiles(username, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}
