import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime, requireDashboardUser } from "@/services/dashboard";

export default async function ClinicalPage() {
  await requirePermission("clinical.read");
  const { snapshot } = await requireDashboardUser();

  return (
    <main className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Clinical Documentation</CardTitle>
          <CardDescription>SOAP notes, diagnoses, e-signatures, and decision support readiness</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.clinicalNotes.map((note) => {
            const patient = snapshot.patients.find((entry) => entry.id === note.patientId);
            return (
              <article key={note.id} className="rounded-lg border p-3">
                <p className="text-sm font-semibold">{patient?.fullName ?? "Unknown patient"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{note.soapSummary}</p>
                <p className="mt-1 text-xs text-muted-foreground">Dx: {note.diagnosisCodes.join(", ")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {note.signed ? "Signed" : "Needs signature"} • {formatDateTime(note.createdAt)}
                </p>
              </article>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Procedures + Consent</CardTitle>
          <CardDescription>Procedure lifecycle, CPT tracking, prior authorization, and consent forms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.procedures.map((procedure) => {
            const patient = snapshot.patients.find((entry) => entry.id === procedure.patientId);
            return (
              <article key={procedure.id} className="rounded-lg border p-3">
                <p className="text-sm font-semibold">{procedure.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{patient?.fullName ?? "Unknown patient"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  CPT {procedure.cptCode} • {procedure.status} • Auth {procedure.authorizationStatus}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Consent {procedure.consentSigned ? "signed" : "missing"} • {formatDateTime(procedure.scheduledAt)}
                </p>
              </article>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
