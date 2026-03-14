import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_clinical_notes")
    .select("*")
    .eq("id", id)
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("clinical.write");
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const body = await request.json();

  const updatePayload = {
    note_type: body.note_type,
    subjective: body.subjective,
    objective: body.objective,
    assessment: body.assessment,
    plan: body.plan,
    status: body.status,
    signed_at: body.status === "signed" ? body.signed_at ?? new Date().toISOString() : body.signed_at,
    signed_by_staff_id: body.signed_by_staff_id,
    version: body.version,
    tags: body.tags,
    attachments: body.attachments,
    updated_at: new Date().toISOString()
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_clinical_notes")
    .update(updatePayload)
    .eq("id", id)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Clinical note updated" });
}
