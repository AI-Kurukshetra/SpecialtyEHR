import { NextResponse } from "next/server";
import { getCurrentUserRole } from "@/lib/auth/guards";
import { hasPermission, type AppPermission, type AppRole } from "@/lib/auth/permissions";

type ApiAuthSuccess = {
  userId: string;
  role: AppRole;
};

type ApiAuthFailure = {
  error: NextResponse;
};

export async function authorizeApi(permission: AppPermission): Promise<ApiAuthSuccess | ApiAuthFailure> {
  const { user, role } = await getCurrentUserRole();

  if (!user || !role) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (!hasPermission(role, permission)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { userId: user.id, role };
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message = "Invalid request") {
  return NextResponse.json({ error: message }, { status: 400 });
}
