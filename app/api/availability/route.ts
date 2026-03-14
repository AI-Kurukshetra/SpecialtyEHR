import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await authorizeApi("appointments.read");
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const providerId = url.searchParams.get("provider_id");
  const locationId = url.searchParams.get("location_id");

  if (!from || !to) return badRequest("from and to are required");

  const supabase = await createClient();

  let scheduleQuery = supabase
    .from("hc_schedules")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .eq("is_active", true);
  if (providerId) scheduleQuery = scheduleQuery.eq("provider_id", providerId);
  if (locationId) scheduleQuery = scheduleQuery.eq("location_id", locationId);

  const { data: schedules, error: scheduleError } = await scheduleQuery;
  if (scheduleError) return NextResponse.json({ error: scheduleError.message }, { status: 500 });

  let appointmentQuery = supabase
    .from("hc_appointments")
    .select("id, provider_id, location_id, starts_at, ends_at, status")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .gte("starts_at", from)
    .lte("starts_at", to)
    .not("status", "eq", "cancelled");
  if (providerId) appointmentQuery = appointmentQuery.eq("provider_id", providerId);
  if (locationId) appointmentQuery = appointmentQuery.eq("location_id", locationId);

  const { data: appointments, error: appointmentError } = await appointmentQuery;
  if (appointmentError) return NextResponse.json({ error: appointmentError.message }, { status: 500 });

  return NextResponse.json({
    data: {
      from,
      to,
      schedules: schedules ?? [],
      appointments: appointments ?? []
    }
  });
}
