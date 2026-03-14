import { NextResponse } from "next/server";
import { authorizeApi, forbidden } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_prescriptions")
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
  if (auth.role !== "doctor" && auth.role !== "admin") {
    return forbidden("Only doctor/admin can update prescriptions");
  }

  const body = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_prescriptions")
    .update({
      medication_name: body.medication_name,
      generic_name: body.generic_name,
      dosage: body.dosage,
      route: body.route,
      frequency: body.frequency,
      duration: body.duration,
      quantity: body.quantity,
      refills: body.refills,
      start_date: body.start_date,
      end_date: body.end_date,
      instructions: body.instructions,
      interaction_checked: body.interaction_checked,
      interaction_result: body.interaction_result,
      status: body.status,
      external_rx_id: body.external_rx_id,
      sent_at: body.sent_at,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Prescription updated" });
}
