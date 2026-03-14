export type AppRole = "doctor" | "nurse" | "receptionist" | "admin";

export type AppPermission =
  | "dashboard.read"
  | "patients.read"
  | "patients.write"
  | "appointments.read"
  | "appointments.write"
  | "clinical.read"
  | "clinical.write"
  | "billing.read"
  | "reports.read"
  | "integrations.read"
  | "admin.manage";

const rolePermissions: Record<AppRole, AppPermission[]> = {
  doctor: [
    "dashboard.read",
    "patients.read",
    "patients.write",
    "appointments.read",
    "appointments.write",
    "clinical.read",
    "clinical.write",
    "reports.read"
  ],
  nurse: [
    "dashboard.read",
    "patients.read",
    "patients.write",
    "appointments.read",
    "appointments.write",
    "clinical.read",
    "clinical.write"
  ],
  receptionist: [
    "dashboard.read",
    "patients.read",
    "patients.write",
    "appointments.read",
    "appointments.write",
    "billing.read"
  ],
  admin: [
    "dashboard.read",
    "patients.read",
    "patients.write",
    "appointments.read",
    "appointments.write",
    "clinical.read",
    "clinical.write",
    "billing.read",
    "reports.read",
    "integrations.read",
    "admin.manage"
  ]
};

function parseRole(value: string | null | undefined): AppRole | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "doctor" || normalized === "nurse" || normalized === "receptionist" || normalized === "admin") {
    return normalized;
  }

  return null;
}

export function isAppRole(value: string | null | undefined): value is AppRole {
  return parseRole(value) !== null;
}

export function resolveAppRole(...values: Array<string | null | undefined>): AppRole {
  for (const value of values) {
    const role = parseRole(value);
    if (role) return role;
  }

  return "receptionist";
}

export function hasPermission(role: AppRole, permission: AppPermission) {
  return rolePermissions[role].includes(permission);
}

const routePermissionRules: Array<{ prefix: string; permission: AppPermission }> = [
  { prefix: "/dashboard/patients", permission: "patients.read" },
  { prefix: "/dashboard/appointments", permission: "appointments.read" },
  { prefix: "/dashboard/clinical", permission: "clinical.read" },
  { prefix: "/dashboard/imaging", permission: "clinical.read" },
  { prefix: "/dashboard/billing", permission: "billing.read" },
  { prefix: "/dashboard/reports", permission: "reports.read" },
  { prefix: "/dashboard/integrations", permission: "integrations.read" },
  { prefix: "/dashboard/admin", permission: "admin.manage" },
  { prefix: "/api/patients", permission: "patients.read" },
  { prefix: "/api/appointments", permission: "appointments.read" },
  { prefix: "/api/schedules", permission: "appointments.read" },
  { prefix: "/api/availability", permission: "appointments.read" },
  { prefix: "/api/slot-types", permission: "appointments.read" },
  { prefix: "/api/templates", permission: "clinical.read" },
  { prefix: "/api/clinical-notes", permission: "clinical.read" },
  { prefix: "/api/procedures", permission: "clinical.read" },
  { prefix: "/api/prescriptions", permission: "clinical.read" },
  { prefix: "/api/imaging", permission: "clinical.read" },
  { prefix: "/api/billing", permission: "billing.read" },
  { prefix: "/api/reports", permission: "reports.read" },
  { prefix: "/api/integrations", permission: "integrations.read" },
  { prefix: "/api/admin", permission: "admin.manage" }
];

export function requiredPermissionForPath(pathname: string): AppPermission | null {
  const matched = routePermissionRules.find((rule) => pathname.startsWith(rule.prefix));
  if (matched) return matched.permission;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/portal") || pathname.startsWith("/api")) {
    return "dashboard.read";
  }

  return null;
}
