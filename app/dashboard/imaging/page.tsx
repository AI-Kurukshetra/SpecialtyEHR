import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, requireDashboardUser } from "@/services/dashboard";

export default async function ImagingPage() {
  const { snapshot } = await requireDashboardUser();

  return (
    <main className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Medical Imaging</CardTitle>
          <CardDescription>DICOM/photo metadata, before/after timelines, and progression comparisons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.medicalImages.map((image) => {
            const patient = snapshot.patients.find((entry) => entry.id === image.patientId);
            return (
              <article key={image.id} className="rounded-lg border p-3">
                <p className="text-sm font-semibold">{patient?.fullName ?? "Unknown patient"}</p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">
                  {image.modality} • {image.bodySite}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{image.progressionNote}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(image.capturedAt)}</p>
              </article>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lab + Referral Coordination</CardTitle>
          <CardDescription>Linked lab results and referral handoffs for continuity of care</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.labResults.map((lab) => {
            const patient = snapshot.patients.find((entry) => entry.id === lab.patientId);
            return (
              <article key={lab.id} className="rounded-lg border p-3">
                <p className="text-sm font-semibold">{lab.testName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{patient?.fullName ?? "Unknown patient"}</p>
                <p className="mt-1 text-xs text-muted-foreground">Status: {lab.status}</p>
              </article>
            );
          })}
          {snapshot.referrals.map((referral) => {
            const patient = snapshot.patients.find((entry) => entry.id === referral.patientId);
            return (
              <article key={referral.id} className="rounded-lg border bg-muted/20 p-3">
                <p className="text-sm font-semibold">Referral: {patient?.fullName ?? "Unknown patient"}</p>
                <p className="mt-1 text-xs text-muted-foreground">To {referral.referredTo}</p>
                <p className="mt-1 text-xs text-muted-foreground">{referral.reason}</p>
              </article>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
