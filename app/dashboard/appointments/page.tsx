import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime, requireDashboardUser } from "@/services/dashboard";

export default async function AppointmentsPage() {
  await requirePermission("appointments.read");
  const { snapshot } = await requireDashboardUser();

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Appointment Scheduling</CardTitle>
          <CardDescription>Provider calendars, specialty visit types, and location-aware booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.appointments.map((appointment) => {
            const patient = snapshot.patients.find((entry) => entry.id === appointment.patientId);
            return (
              <article key={appointment.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{patient?.fullName ?? "Unknown patient"}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{appointment.status.replace("_", " ")}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {appointment.visitType} • {appointment.providerName} • {appointment.locationName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(appointment.startsAt)}</p>
              </article>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
