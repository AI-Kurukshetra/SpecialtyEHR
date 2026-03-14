import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("clinical.write");
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_procedures")
    .update({
      procedure_code: body.procedure_code,
      procedure_name: body.procedure_name,
      category: body.category,
      status: body.status,
      authorization_required: body.authorization_required,
      authorization_reference: body.authorization_reference,
      scheduled_at: body.scheduled_at,
      performed_at: body.performed_at,
      duration_minutes: body.duration_minutes,
      theatre_or_room: body.theatre_or_room,
      anesthesia_type: body.anesthesia_type,
      findings: body.findings,
      complications: body.complications,
      follow_up_instructions: body.follow_up_instructions,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Procedure updated" });
}
