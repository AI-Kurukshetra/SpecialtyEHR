import { ClinicalWorkspace } from "@/components/dashboard/clinical-workspace";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";

export default async function ClinicalPage() {
  await requirePermission("clinical.read");

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Clinical Documentation</CardTitle>
          <CardDescription>SOAP notes, diagnoses, e-signatures, and decision support readiness</CardDescription>
        </CardHeader>
        <CardContent>
          <ClinicalWorkspace />
        </CardContent>
      </Card>
    </main>
  );
}
