import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await authorizeApi("appointments.read");
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const specialty = url.searchParams.get("specialty");

  const supabase = await createClient();
  let query = supabase
    .from("hc_specialty_slot_types")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .eq("is_active", true)
    .order("specialty", { ascending: true });

  if (specialty) query = query.eq("specialty", specialty);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}
