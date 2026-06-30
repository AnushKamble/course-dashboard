import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, stars, critique } = await request.json();

  const supabase = createAdminClient();
  const updates: any = { updated_at: new Date().toISOString() };
  if (status) updates.status = status;
  if (stars !== undefined) updates.stars = stars;
  if (critique !== undefined) updates.critique = critique;

  const { data, error } = await supabase
    .from("project_submissions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ submission: data });
}
