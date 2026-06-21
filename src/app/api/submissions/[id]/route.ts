import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const { status: newStatus } = await request.json();

  if (!["correct", "incorrect"].includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: sub } = await supabase
    .from("submissions")
    .select("user_id, status")
    .eq("id", id)
    .single();

  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabase
    .from("submissions")
    .update({ status: newStatus, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Award +25 XP bonus when marking correct (skip if already correct)
  if (newStatus === "correct" && sub.status !== "correct") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, level")
      .eq("id", sub.user_id)
      .single();

    const bonusXp = 25;
    const newXp = (profile?.xp || 0) + bonusXp;
    const currentLevel = profile?.level || 1;
    const nextLevelXp = currentLevel * 100;
    let newLevel = currentLevel;

    if (newXp >= nextLevelXp) newLevel = currentLevel + 1;

    await supabase
      .from("profiles")
      .update({ xp: newXp, level: newLevel })
      .eq("id", sub.user_id);

    // Check badges
    const { data: earnedBadges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", sub.user_id);

    const earnedIds = new Set((earnedBadges || []).map((b: any) => b.badge_id));
    const { data: allBadges } = await supabase.from("badges").select("*");

    for (const badge of allBadges || []) {
      if (earnedIds.has(badge.id)) continue;
      let earned = false;

      switch (badge.condition_type) {
        case "wrong_to_correct":
          earned = true;
          break;
        case "xp_100":
          if (newXp >= badge.condition_value) earned = true;
          break;
        case "level_10":
          if (newLevel >= badge.condition_value) earned = true;
          break;
      }

      if (earned) {
        await supabase
          .from("user_badges")
          .insert({ user_id: sub.user_id, badge_id: badge.id });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
