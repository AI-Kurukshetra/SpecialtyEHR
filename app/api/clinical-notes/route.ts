import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const patientId = url.searchParams.get("patient_id");

  const supabase = await createClient();
  let query = supabase
    .from("hc_clinical_notes")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .order("created_at", { ascending: false });

  if (patientId) query = query.eq("patient_id", patientId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const auth = await authorizeApi("clinical.write");
  if ("error" in auth) return auth.error;
  const body = await request.json();

  if (!body.patient_id) return badRequest("patient_id is required");

  const supabase = await createClient();

  const payload = {
    owner_user_id: auth.userId,
    patient_id: body.patient_id,
    appointment_id: body.appointment_id ?? null,
    provider_id: body.provider_id ?? null,
    authored_by_staff_id: body.authored_by_staff_id ?? null,
    note_type: body.note_type ?? "SOAP",
    subjective: body.subjective ?? null,
    objective: body.objective ?? null,
    assessment: body.assessment ?? null,
    plan: body.plan ?? null,
    status: body.status ?? "draft",
    signed_at: body.status === "signed" ? body.signed_at ?? new Date().toISOString() : null,
    signed_by_staff_id: body.signed_by_staff_id ?? null,
    version: body.version ?? 1,
    tags: body.tags ?? [],
    attachments: body.attachments ?? []
  };

  const { data, error } = await supabase.from("hc_clinical_notes").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Clinical note created" }, { status: 201 });
}
