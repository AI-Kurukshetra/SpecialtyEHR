"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, FileText, LayoutDashboard, Receipt, UserRound } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Patients", icon: UserRound },
  { href: "/dashboard/appointments", label: "Schedule", icon: CalendarRange },
  { href: "/dashboard/clinical", label: "Clinical", icon: FileText },
  { href: "/dashboard/billing", label: "Billing", icon: Receipt }
];

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-between gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-md px-1 py-1 text-[11px] font-medium ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
