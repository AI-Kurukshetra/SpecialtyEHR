import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("appointments.read");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_appointments")
    .select("*")
    .eq("id", id)
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("appointments.write");
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();
  const updates = {
    provider_id: body.provider_id,
    location_id: body.location_id,
    schedule_id: body.schedule_id,
    appointment_type: body.appointment_type,
    visit_reason: body.visit_reason,
    starts_at: body.starts_at,
    ends_at: body.ends_at,
    status: body.status,
    cancellation_reason: body.cancellation_reason,
    cancelled_at: body.status === "cancelled" ? body.cancelled_at ?? new Date().toISOString() : body.cancelled_at,
    check_in_at: body.check_in_at,
    booked_via: body.booked_via,
    notes: body.notes,
    procedure_id: body.procedure_id,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("hc_appointments")
    .update(updates)
    .eq("id", id)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Appointment updated" });
}
