import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await authorizeApi("appointments.read");
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const providerId = url.searchParams.get("provider_id");
  const locationId = url.searchParams.get("location_id");
  const patientId = url.searchParams.get("patient_id");

  const supabase = await createClient();
  let query = supabase
    .from("hc_appointments")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .order("starts_at", { ascending: true });

  if (from) query = query.gte("starts_at", from);
  if (to) query = query.lte("starts_at", to);
  if (providerId) query = query.eq("provider_id", providerId);
  if (locationId) query = query.eq("location_id", locationId);
  if (patientId) query = query.eq("patient_id", patientId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const auth = await authorizeApi("appointments.write");
  if ("error" in auth) return auth.error;

  const body = await request.json();
  if (!body.patient_id || !body.provider_id || !body.starts_at || !body.ends_at || !body.appointment_type) {
    return badRequest("patient_id, provider_id, starts_at, ends_at and appointment_type are required");
  }

  const supabase = await createClient();
  const payload = {
    owner_user_id: auth.userId,
    patient_id: body.patient_id,
    provider_id: body.provider_id,
    location_id: body.location_id ?? null,
    schedule_id: body.schedule_id ?? null,
    appointment_type: body.appointment_type,
    visit_reason: body.visit_reason ?? null,
    starts_at: body.starts_at,
    ends_at: body.ends_at,
    status: body.status ?? "scheduled",
    booked_via: body.booked_via ?? "staff",
    notes: body.notes ?? null,
    created_by_staff_id: body.created_by_staff_id ?? null,
    procedure_id: body.procedure_id ?? null
  };
  const { data, error } = await supabase.from("hc_appointments").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      message: "Appointment scheduled",
      data
    },
    { status: 201 }
  );
}
