import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, questionTitle } = await req.json();
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, streak_count")
    .eq("id", user.id)
    .single();

  let xpGained = 10;
  if (status === "correct") xpGained = 35;

  const newXp = (profile?.xp || 0) + xpGained;
  const currentLevel = profile?.level || 1;
  const nextLevelXp = currentLevel * 100;
  let newLevel = currentLevel;
  let leveledUp = false;

  if (newXp >= nextLevelXp) {
    newLevel = currentLevel + 1;
    leveledUp = true;
  }

  await supabase.from("profiles").update({ xp: newXp, level: newLevel }).eq("id", user.id);

  // Check for new badges
  const { data: earnedBadges } = await supabase.from("user_badges").select("badge_id").eq("user_id", user.id);
  const earnedIds = new Set((earnedBadges || []).map((b: any) => b.badge_id));
  const newBadges: any[] = [];

  const { data: allBadges } = await supabase.from("badges").select("*");

  for (const badge of allBadges || []) {
    if (earnedIds.has(badge.id)) continue;
    let earned = false;

    switch (badge.condition_type) {
      case "first_submission":
        earned = true;
        break;
      case "xp_100":
        if (newXp >= badge.condition_value) earned = true;
        break;
      case "level_10":
        if (newLevel >= badge.condition_value) earned = true;
        break;
      case "wrong_to_correct":
        if (status === "correct") earned = true;
        break;
      case "question_complete":
        if (questionTitle?.toLowerCase().includes("lunch") || questionTitle?.toLowerCase().includes("bill")) earned = true;
        break;
    }

    if (earned) {
      await supabase.from("user_badges").insert({ user_id: user.id, badge_id: badge.id });
      newBadges.push(badge);
    }
  }

  return NextResponse.json({
    xp_gained: xpGained,
    total_xp: newXp,
    level: newLevel,
    leveled_up: leveledUp,
    new_badges: newBadges,
  });
}
