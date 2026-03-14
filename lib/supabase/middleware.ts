import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { hasPermission, requiredPermissionForPath, resolveAppRole } from "@/lib/auth/permissions";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/auth");

  const requiredPermission = requiredPermissionForPath(pathname);

  if (!isPublicPath && requiredPermission && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Please sign in to continue");
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && requiredPermission) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = resolveAppRole(
      profile?.role,
      typeof user.user_metadata?.role === "string" ? user.user_metadata.role : null,
      typeof user.app_metadata?.role === "string" ? user.app_metadata.role : null
    );

    if (!hasPermission(role, requiredPermission)) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "You do not have permission to access that resource");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return response;
}
