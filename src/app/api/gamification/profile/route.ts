import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const targetUserId = searchParams.get("user_id");

  // Only admin can view other users' profiles
  const profileId = targetUserId && targetUserId !== user.id
    ? (user.role === "admin" ? targetUserId : user.id)
    : user.id;

  const supabase = createAdminClient();

  let profile: any = { xp: 0, level: 1, streak_count: 0, last_practice_date: null, theme: "green", avatar_url: null };
  const { data, error } = await supabase
    .from("profiles")
    .select("xp, level, streak_count, last_practice_date, theme, avatar_url")
    .eq("id", profileId)
    .single();

  if (data) profile = data;

  let badges: any[] = [];
  let allBadges: any[] = [];

  try {
    const { data: b } = await supabase.from("user_badges").select("*, badges(*)").eq("user_id", profileId);
    if (b) badges = b;
  } catch {}

  try {
    const { data: a } = await supabase.from("badges").select("*");
    if (a) allBadges = a;
  } catch {}

  const nextLevelXp = (profile.level || 1) * 100;

  return NextResponse.json({
    xp: profile.xp || 0,
    level: profile.level || 1,
    streak_count: profile.streak_count || 0,
    last_practice_date: profile.last_practice_date,
    theme: profile.theme || "green",
    avatar_url: profile.avatar_url,
    xp_to_next_level: nextLevelXp,
    earned_badges: badges.map((b: any) => ({ ...b.badges, earned_at: b.earned_at })) || [],
    all_badges: allBadges || [],
  });
}
