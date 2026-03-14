import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPermission, resolveAppRole, type AppPermission, type AppRole } from "@/lib/auth/permissions";

export async function getCurrentUserRole() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = resolveAppRole(
    profile?.role,
    typeof user.user_metadata?.role === "string" ? user.user_metadata.role : null,
    typeof user.app_metadata?.role === "string" ? user.app_metadata.role : null
  );

  return { user, role } as { user: NonNullable<typeof user>; role: AppRole };
}

export async function requirePermission(permission: AppPermission) {
  const { user, role } = await getCurrentUserRole();

  if (!user || !role) {
    redirect("/login?error=Please sign in to continue");
  }

  if (!hasPermission(role, permission)) {
    redirect("/dashboard?error=You do not have permission for that page");
  }

  return { user, role };
}
