import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("last_practice_date, streak_count, xp, level")
    .eq("id", user.id)
    .single();

  let newStreak = profile?.streak_count || 0;
  const lastDate = profile?.last_practice_date;

  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    // Streak milestone bonus
    let xpBonus = 5;
    if (newStreak === 3) xpBonus = 50;
    else if (newStreak === 7) xpBonus = 50;
    else if (newStreak === 30) xpBonus = 50;

    const newXp = (profile?.xp || 0) + xpBonus;
    const nextLevelXp = (profile?.level || 1) * 100;
    let newLevel = profile?.level || 1;
    if (newXp >= nextLevelXp) newLevel += 1;

    await supabase
      .from("profiles")
      .update({
        last_practice_date: today,
        streak_count: newStreak,
        xp: newXp,
        level: newLevel,
      })
      .eq("id", user.id);

    return NextResponse.json({ streak: newStreak, xp_bonus: xpBonus, total_xp: newXp, level: newLevel });
  }

  return NextResponse.json({ streak: newStreak, xp_bonus: 0 });
}
