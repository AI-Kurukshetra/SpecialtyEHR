"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarRange,
  ChartNoAxesCombined,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MonitorSmartphone,
  Receipt,
  ShieldCheck,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Patients", icon: Users },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarRange },
  { href: "/dashboard/clinical", label: "Clinical", icon: FileText },
  { href: "/dashboard/templates", label: "Templates", icon: FileText },
  { href: "/dashboard/imaging", label: "Imaging", icon: Activity },
  { href: "/dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/dashboard/reports", label: "Reports", icon: ChartNoAxesCombined },
  { href: "/dashboard/integrations", label: "Integrations", icon: FolderKanban },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
  { href: "/portal", label: "Patient Portal", icon: MonitorSmartphone }
];

type Role = "admin" | "doctor" | "nurse" | "receptionist";

const roleTheme: Record<Role, { name: string; sidebarTint: string; activeTab: string; iconTint: string }> = {
  admin: {
    name: "Admin Control",
    sidebarTint: "from-cyan-50 to-sky-100",
    activeTab: "bg-cyan-600 text-white hover:bg-cyan-600",
    iconTint: "text-cyan-700"
  },
  doctor: {
    name: "Doctor Workspace",
    sidebarTint: "from-emerald-50 to-teal-100",
    activeTab: "bg-emerald-600 text-white hover:bg-emerald-600",
    iconTint: "text-emerald-700"
  },
  nurse: {
    name: "Nursing Station",
    sidebarTint: "from-blue-50 to-sky-100",
    activeTab: "bg-blue-600 text-white hover:bg-blue-600",
    iconTint: "text-blue-700"
  },
  receptionist: {
    name: "Front Desk",
    sidebarTint: "from-amber-50 to-orange-100",
    activeTab: "bg-amber-600 text-white hover:bg-amber-600",
    iconTint: "text-amber-700"
  }
};

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNavigation({ role, allowedHrefs }: { role: Role; allowedHrefs: string[] }) {
  const pathname = usePathname();
  const theme = roleTheme[role];
  const allowedItems = navItems.filter((item) => allowedHrefs.includes(item.href));
  const mobileItems = allowedItems.slice(0, 5);

  return (
    <>
      <aside
        className={cn(
          "hidden rounded-2xl border p-4 shadow-sm backdrop-blur md:block",
          `bg-gradient-to-b ${theme.sidebarTint}`
        )}
      >
        <div className="mb-6">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">NexTech EHR</p>
            <span className="rounded-full border bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
              {role}
            </span>
          </div>
          <h1 className="mt-2 text-xl font-semibold">{theme.name}</h1>
        </div>
        <nav className="space-y-1">
          {allowedItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive ? theme.activeTab : "text-foreground hover:bg-white/70"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : theme.iconTint)} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        <ul className="mx-auto flex max-w-md items-center justify-between gap-1">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md px-1 py-1 text-[11px] font-medium",
                    isActive ? theme.activeTab : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : theme.iconTint)} />
                  {item.label === "Overview" ? "Home" : item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
