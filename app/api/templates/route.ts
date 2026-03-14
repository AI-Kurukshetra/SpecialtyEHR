import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const specialty = url.searchParams.get("specialty");
  const templateType = url.searchParams.get("template_type");

  const supabase = await createClient();
  let query = supabase
    .from("hc_document_templates")
    .select("*")
    .or(`owner_user_id.eq.${auth.userId},owner_user_id.is.null`)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (specialty) query = query.eq("specialty", specialty);
  if (templateType) query = query.eq("template_type", templateType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: data?.length ?? 0 });
}

export async function POST(request: Request) {
  const auth = await authorizeApi("admin.manage");
  if ("error" in auth) return auth.error;

  const body = await request.json();
  if (!body.specialty || !body.name || !body.template_type || !body.content) {
    return badRequest("specialty, name, template_type, and content are required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hc_document_templates")
    .insert({
      owner_user_id: auth.userId,
      specialty: body.specialty,
      name: body.name,
      template_type: body.template_type,
      content: body.content,
      is_active: body.is_active ?? true
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, message: "Template created" }, { status: 201 });
}
