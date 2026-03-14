import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; insuranceId: string }> }
) {
  const auth = await authorizeApi("patients.write");
  if ("error" in auth) return auth.error;
  const { id, insuranceId } = await params;
  const body = await request.json();

  const supabase = await createClient();
  const updates = {
    payer_name: body.payer_name,
    plan_name: body.plan_name,
    member_id: body.member_id,
    group_number: body.group_number,
    policy_holder_name: body.policy_holder_name,
    policy_holder_dob: body.policy_holder_dob,
    relation_to_patient: body.relation_to_patient,
    coverage_start: body.coverage_start,
    coverage_end: body.coverage_end,
    copay_cents: body.copay_cents,
    deductible_cents: body.deductible_cents,
    out_of_pocket_max_cents: body.out_of_pocket_max_cents,
    verification_status: body.verification_status,
    verified_at: body.verification_status === "verified" ? body.verified_at ?? new Date().toISOString() : body.verified_at,
    is_primary: body.is_primary,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("hc_insurances")
    .update(updates)
    .eq("patient_id", id)
    .eq("id", insuranceId)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Insurance updated" });
}
