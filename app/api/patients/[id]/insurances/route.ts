import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("patients.read");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_insurances")
    .select("*")
    .eq("patient_id", id)
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("patients.write");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const body = await request.json();
  if (!body.payer_name || !body.member_id) {
    return badRequest("payer_name and member_id are required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_insurances")
    .insert({
      owner_user_id: auth.userId,
      patient_id: id,
      payer_name: body.payer_name,
      plan_name: body.plan_name ?? null,
      member_id: body.member_id,
      group_number: body.group_number ?? null,
      policy_holder_name: body.policy_holder_name ?? null,
      policy_holder_dob: body.policy_holder_dob ?? null,
      relation_to_patient: body.relation_to_patient ?? null,
      coverage_start: body.coverage_start ?? null,
      coverage_end: body.coverage_end ?? null,
      copay_cents: body.copay_cents ?? null,
      deductible_cents: body.deductible_cents ?? null,
      out_of_pocket_max_cents: body.out_of_pocket_max_cents ?? null,
      verification_status: body.verification_status ?? "unverified",
      verified_at: body.verified_at ?? null,
      is_primary: body.is_primary ?? true
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Insurance added" }, { status: 201 });
}
