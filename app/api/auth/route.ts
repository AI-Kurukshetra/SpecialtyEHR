import { NextResponse } from "next/server";
import { resolveAppRole } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, authenticated: false }, { status: 200 });
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();
  const role = resolveAppRole(
    profile?.role,
    typeof user.user_metadata?.role === "string" ? user.user_metadata.role : null,
    typeof user.app_metadata?.role === "string" ? user.app_metadata.role : null
  );

  return NextResponse.json({
    authenticated: true,
    data: {
      id: user.id,
      email: user.email,
      fullName: profile?.full_name ?? null,
      role
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const action = String(body?.action ?? "");

  if (action !== "signout") {
    return NextResponse.json({ error: "Unsupported auth action" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Signed out successfully" });
}
