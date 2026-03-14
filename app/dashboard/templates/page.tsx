import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplatesManager } from "@/components/dashboard/templates-manager";
import { requirePermission } from "@/lib/auth/guards";
import { requireDashboardUser } from "@/services/dashboard";

export default async function TemplatesPage() {
  await requirePermission("clinical.read");
  const { role } = await requireDashboardUser();

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Specialty Templates</CardTitle>
          <CardDescription>SOAP, procedure, and assessment templates by specialty.</CardDescription>
        </CardHeader>
        <CardContent>
          <TemplatesManager isAdmin={role === "admin"} />
        </CardContent>
      </Card>
    </main>
  );
}
