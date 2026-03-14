import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { formatCurrency, requireDashboardUser } from "@/services/dashboard";

export default async function BillingPage() {
  await requirePermission("billing.read");
  const { snapshot } = await requireDashboardUser();

  return (
    <main className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Billing + Claims</CardTitle>
          <CardDescription>Specialty CPT workflows, claim status, and payer action tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.billingClaims.map((claim) => {
            const patient = snapshot.patients.find((entry) => entry.id === claim.patientId);
            return (
              <article key={claim.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{patient?.fullName ?? "Unknown patient"}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{claim.status.replace("_", " ")}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Payer: {claim.payer}</p>
                <p className="mt-1 text-xs text-muted-foreground">Amount: {formatCurrency(claim.amountCents)}</p>
              </article>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Prescription Management</CardTitle>
          <CardDescription>E-prescribing with drug interaction verification records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.prescriptions.map((prescription) => {
            const patient = snapshot.patients.find((entry) => entry.id === prescription.patientId);
            return (
              <article key={prescription.id} className="rounded-lg border p-3">
                <p className="text-sm font-semibold">{prescription.medication}</p>
                <p className="mt-1 text-xs text-muted-foreground">{patient?.fullName ?? "Unknown patient"}</p>
                <p className="mt-1 text-xs text-muted-foreground">Dose: {prescription.dose}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Interactions checked: {prescription.interactionsChecked ? "Yes" : "No"}
                </p>
              </article>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
