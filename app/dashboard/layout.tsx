import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  CalendarRange,
  ChartNoAxesCombined,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MonitorSmartphone,
  Receipt,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import { requireDashboardUser } from "@/services/dashboard";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Patients", icon: Users },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarRange },
  { href: "/dashboard/clinical", label: "Clinical", icon: FileText },
  { href: "/dashboard/imaging", label: "Imaging", icon: Activity },
  { href: "/dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/dashboard/reports", label: "Reports", icon: ChartNoAxesCombined },
  { href: "/dashboard/integrations", label: "Integrations", icon: FolderKanban },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
  { href: "/portal", label: "Patient Portal", icon: MonitorSmartphone }
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, profile } = await requireDashboardUser();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,hsl(210_52%_97%),hsl(0_0%_100%))] pb-20 md:pb-0">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-4 px-3 py-3 md:grid-cols-[250px_1fr] md:px-4 md:py-4">
        <aside className="hidden rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur md:block">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">NexTech EHR</p>
            <h1 className="mt-2 text-xl font-semibold">Dermatology MVP</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Mobile-first workspace</p>
            <p className="mt-1">Core patient, schedule, clinical, billing, portal, reporting, and integrations.</p>
          </div>
        </aside>

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
              <form action={signOut}>
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            </div>
          </header>
          {children}
        </div>
      </div>
      <DashboardMobileNav />
    </div>
  );
}
