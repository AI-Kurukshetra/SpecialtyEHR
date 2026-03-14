import Link from "next/link";
import type { ReactNode } from "react";
import { Settings } from "lucide-react";
import { signOut } from "@/app/(auth)/login/actions";
import { DashboardNavigation } from "@/components/dashboard/navigation";
import { SignOutForm } from "@/components/dashboard/signout-form";
import { hasPermission, type AppPermission } from "@/lib/auth/permissions";
import { requireDashboardUser } from "@/services/dashboard";

const roleFrameStyles = {
  admin: "bg-[linear-gradient(180deg,hsl(194_100%_96%),hsl(0_0%_100%))]",
  doctor: "bg-[linear-gradient(180deg,hsl(158_60%_96%),hsl(0_0%_100%))]",
  nurse: "bg-[linear-gradient(180deg,hsl(208_80%_96%),hsl(0_0%_100%))]",
  receptionist: "bg-[linear-gradient(180deg,hsl(40_90%_95%),hsl(0_0%_100%))]"
} as const;

const navigationPermissionMap: Array<{ href: string; permission: AppPermission }> = [
  { href: "/dashboard", permission: "dashboard.read" },
  { href: "/dashboard/patients", permission: "patients.read" },
  { href: "/dashboard/appointments", permission: "appointments.read" },
  { href: "/dashboard/clinical", permission: "clinical.read" },
  { href: "/dashboard/templates", permission: "clinical.read" },
  { href: "/dashboard/imaging", permission: "clinical.read" },
  { href: "/dashboard/billing", permission: "billing.read" },
  { href: "/dashboard/reports", permission: "reports.read" },
  { href: "/dashboard/integrations", permission: "integrations.read" },
  { href: "/dashboard/admin", permission: "admin.manage" },
  { href: "/portal", permission: "dashboard.read" }
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, profile, role } = await requireDashboardUser();
  const allowedHrefs = navigationPermissionMap
    .filter((item) => hasPermission(role, item.permission))
    .map((item) => item.href);

  return (
    <div className={`min-h-screen ${roleFrameStyles[role]} pb-20 md:pb-0`}>
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-4 px-3 py-3 md:grid-cols-[250px_1fr] md:px-4 md:py-4">
        <DashboardNavigation role={role} allowedHrefs={allowedHrefs} />

        <div className="space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
            <div>
              <p className="text-sm font-medium text-foreground">{profile?.full_name || "Care Team Member"}</p>
              <p className="text-xs text-muted-foreground">{user.email} • Dermatology Operations</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/portal" className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                Portal
              </Link>
              <Link href="/" className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                <Settings className="h-4 w-4" />
                Home
              </Link>
              <SignOutForm action={signOut} />
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
