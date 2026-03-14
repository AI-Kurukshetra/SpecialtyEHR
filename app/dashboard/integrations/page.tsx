import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime, requireDashboardUser } from "@/services/dashboard";

export default async function IntegrationsPage() {
  await requirePermission("integrations.read");
  const { snapshot } = await requireDashboardUser();

  return (
    <main className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Integration Health</CardTitle>
          <CardDescription>FHIR, payments, messaging, and imaging bridge status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.integrations.map((integration) => (
            <article key={integration.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{integration.name}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{integration.status}</p>
              </div>
              <p className="mt-1 text-xs capitalize text-muted-foreground">{integration.category}</p>
              <p className="mt-1 text-xs text-muted-foreground">Last sync: {formatDateTime(integration.lastSyncAt)}</p>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Staff Role Management</CardTitle>
          <CardDescription>Granular permissions by team function and specialty workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.adminRoles.map((role) => (
            <article key={role.id} className="rounded-lg border p-3">
              <p className="text-sm font-semibold">{role.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">Users: {role.users}</p>
              <p className="mt-1 text-xs text-muted-foreground">{role.permissions.join(", ")}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
