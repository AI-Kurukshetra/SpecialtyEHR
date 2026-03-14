import { NextResponse } from "next/server";
import { authorizeApi, badRequest, forbidden } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_prescriptions")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const auth = await authorizeApi("clinical.write");
  if ("error" in auth) return auth.error;
  if (auth.role !== "doctor" && auth.role !== "admin") {
    return forbidden("Only doctor/admin can create prescriptions");
  }

  const body = await request.json();
  if (!body.patient_id || !body.provider_id || !body.medication_name || !body.dosage || !body.frequency) {
    return badRequest("patient_id, provider_id, medication_name, dosage, and frequency are required");
  }

  const supabase = await createClient();
  const payload = {
    owner_user_id: auth.userId,
    patient_id: body.patient_id,
    appointment_id: body.appointment_id ?? null,
    diagnosis_id: body.diagnosis_id ?? null,
    provider_id: body.provider_id,
    medication_name: body.medication_name,
    generic_name: body.generic_name ?? null,
    dosage: body.dosage,
    route: body.route ?? null,
    frequency: body.frequency,
    duration: body.duration ?? null,
    quantity: body.quantity ?? null,
    refills: body.refills ?? 0,
    start_date: body.start_date ?? null,
    end_date: body.end_date ?? null,
    instructions: body.instructions ?? null,
    interaction_checked: body.interaction_checked ?? false,
    interaction_result: body.interaction_result ?? {},
    status: body.status ?? "active"
  };

  const { data, error } = await supabase.from("hc_prescriptions").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      message: "Prescription generated",
      data
    },
    { status: 201 }
  );
}
