import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_document_templates")
    .select("*")
    .eq("id", id)
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("admin.manage");
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_document_templates")
    .update({
      name: body.name,
      template_type: body.template_type,
      specialty: body.specialty,
      content: body.content,
      is_active: body.is_active,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Template updated" });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeApi("admin.manage");
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_document_templates")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_user_id", auth.userId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Template deactivated" });
}
