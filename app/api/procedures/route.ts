import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_procedures")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const auth = await authorizeApi("clinical.write");
  if ("error" in auth) return auth.error;

  const body = await request.json();
  if (!body.patient_id || !body.procedure_name) {
    return badRequest("patient_id and procedure_name are required");
  }

  const supabase = await createClient();
  const payload = {
    owner_user_id: auth.userId,
    patient_id: body.patient_id,
    appointment_id: body.appointment_id ?? null,
    treatment_id: body.treatment_id ?? null,
    provider_id: body.provider_id ?? null,
    procedure_code: body.procedure_code ?? null,
    procedure_name: body.procedure_name,
    category: body.category ?? null,
    status: body.status ?? "planned",
    authorization_required: body.authorization_required ?? false,
    authorization_reference: body.authorization_reference ?? null,
    scheduled_at: body.scheduled_at ?? null,
    performed_at: body.performed_at ?? null,
    duration_minutes: body.duration_minutes ?? null,
    theatre_or_room: body.theatre_or_room ?? null,
    anesthesia_type: body.anesthesia_type ?? null,
    findings: body.findings ?? null,
    complications: body.complications ?? null,
    follow_up_instructions: body.follow_up_instructions ?? null
  };

  const { data, error } = await supabase.from("hc_procedures").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      message: "Procedure created",
      data
    },
    { status: 201 }
  );
}
