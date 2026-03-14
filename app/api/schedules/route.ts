import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await authorizeApi("appointments.read");
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const providerId = url.searchParams.get("provider_id");
  const locationId = url.searchParams.get("location_id");

  const supabase = await createClient();
  let query = supabase
    .from("hc_schedules")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .eq("is_active", true)
    .order("day_of_week", { ascending: true });

  if (providerId) query = query.eq("provider_id", providerId);
  if (locationId) query = query.eq("location_id", locationId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}
