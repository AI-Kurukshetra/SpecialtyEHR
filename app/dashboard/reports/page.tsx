import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { requireDashboardUser } from "@/services/dashboard";

export default async function ReportsPage() {
  await requirePermission("reports.read");
  const { snapshot } = await requireDashboardUser();

  return (
    <main className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Practice Analytics Dashboard</CardTitle>
          <CardDescription>Revenue cycle, portal adoption, outcomes, and growth metrics</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {snapshot.reportMetrics.map((metric) => (
            <article key={metric.id} className="rounded-lg border p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.trend}</p>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quality + Compliance</CardTitle>
          <CardDescription>MIPS/HEDIS readiness and specialty quality-reporting status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <article className="rounded-lg border p-3">
            <p className="font-semibold">MIPS quality measures</p>
            <p className="mt-1 text-xs text-muted-foreground">8/10 measures currently mapped to structured clinical data.</p>
          </article>
          <article className="rounded-lg border p-3">
            <p className="font-semibold">HEDIS reporting pack</p>
            <p className="mt-1 text-xs text-muted-foreground">Next extraction window scheduled for Monday at 02:00 AM.</p>
          </article>
          <article className="rounded-lg border p-3">
            <p className="font-semibold">Audit trail integrity</p>
            <p className="mt-1 text-xs text-muted-foreground">No unresolved access anomalies across active user sessions.</p>
          </article>
        </CardContent>
      </Card>
    </main>
  );
}
