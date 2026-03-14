import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("patients.read");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_patients")
    .select("*")
    .eq("id", id)
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("patients.write");
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_patients")
    .update({
      mrn: body.mrn,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth,
      gender: body.gender,
      email: body.email,
      phone: body.phone,
      address_line1: body.address_line1,
      address_line2: body.address_line2,
      city: body.city,
      state: body.state,
      postal_code: body.postal_code,
      blood_group: body.blood_group,
      marital_status: body.marital_status,
      preferred_language: body.preferred_language,
      emergency_contact_name: body.emergency_contact_name,
      emergency_contact_phone: body.emergency_contact_phone,
      primary_provider_id: body.primary_provider_id,
      preferred_location_id: body.preferred_location_id,
      is_active: body.is_active,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Patient updated" });
}
