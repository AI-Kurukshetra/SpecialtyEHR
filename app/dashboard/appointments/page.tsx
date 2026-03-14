import { AppointmentsWorkspace } from "@/components/dashboard/appointments-workspace";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";

export default async function AppointmentsPage() {
  await requirePermission("appointments.read");

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Appointment Scheduling</CardTitle>
          <CardDescription>Provider calendars, specialty visit types, and location-aware booking</CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentsWorkspace />
        </CardContent>
      </Card>
    </main>
  );
}
