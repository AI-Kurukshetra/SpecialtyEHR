import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await authorizeApi("patients.read");
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_patients")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const auth = await authorizeApi("patients.write");
  if ("error" in auth) return auth.error;

  const body = await request.json();
  if (!body.first_name || !body.last_name || !body.date_of_birth) {
    return badRequest("first_name, last_name, and date_of_birth are required");
  }

  const supabase = await createClient();
  const payload = {
    owner_user_id: auth.userId,
    mrn: body.mrn ?? null,
    first_name: body.first_name,
    last_name: body.last_name,
    date_of_birth: body.date_of_birth,
    gender: body.gender ?? "unknown",
    email: body.email ?? null,
    phone: body.phone ?? null,
    address_line1: body.address_line1 ?? null,
    address_line2: body.address_line2 ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    postal_code: body.postal_code ?? null,
    blood_group: body.blood_group ?? null,
    marital_status: body.marital_status ?? null,
    preferred_language: body.preferred_language ?? null,
    emergency_contact_name: body.emergency_contact_name ?? null,
    emergency_contact_phone: body.emergency_contact_phone ?? null,
    primary_provider_id: body.primary_provider_id ?? null,
    preferred_location_id: body.preferred_location_id ?? null,
    is_active: body.is_active ?? true
  };
  const { data, error } = await supabase.from("hc_patients").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      message: "Patient registered",
      data
    },
    { status: 201 }
  );
}
