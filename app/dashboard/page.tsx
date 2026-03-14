import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, CalendarClock, CircleDollarSign, FileClock, FlaskConical, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserRole } from "@/lib/auth/guards";
import { formatCurrency, formatDateTime, requireDashboardUser } from "@/services/dashboard";

export default async function DashboardOverviewPage() {
  const { role: currentRole } = await getCurrentUserRole();
  if (currentRole === "admin") {
    redirect("/dashboard/admin");
  }

  const { snapshot, openTasks, revenueCents, todayAppointments, role } = await requireDashboardUser();

  const kpis = [
    {
      label: "Active patients",
      value: snapshot.patients.length.toString(),
      icon: Users,
      detail: "Registration and demographic records"
    },
    {
      label: "Appointments today",
      value: todayAppointments.length.toString(),
      icon: CalendarClock,
      detail: "Multi-provider schedule and procedure slots"
    },
    {
      label: "Open tasks",
      value: openTasks.toString(),
      icon: FileClock,
      detail: "Unsigned notes, auth requests, and claim follow-ups"
    },
    {
      label: "Claimed revenue",
      value: formatCurrency(revenueCents),
      icon: CircleDollarSign,
      detail: "Current billing and claims pipeline"
    }
  ];

  return (
    <main className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white/85 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Clinical Operations</p>
        <h2 className="mt-1 text-2xl font-semibold">Dermatology EHR command center</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mobile-first MVP for patient management, scheduling, documentation, billing, portal access, and essential integrations.
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Signed in as {role}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Link href="/dashboard/patients" className="rounded-xl border bg-muted/20 px-3 py-2 text-sm font-medium hover:bg-muted/40">
            New patient intake
          </Link>
          <Link href="/dashboard/appointments" className="rounded-xl border bg-muted/20 px-3 py-2 text-sm font-medium hover:bg-muted/40">
            View today schedule
          </Link>
          <Link href="/portal" className="rounded-xl border bg-muted/20 px-3 py-2 text-sm font-medium hover:bg-muted/40">
            Open patient portal
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <CardDescription>{kpi.label}</CardDescription>
                <CardTitle className="flex items-center justify-between text-2xl">
                  {kpi.value}
                  <Icon className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{kpi.detail}</CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s schedule</CardTitle>
            <CardDescription>Appointment + procedure flow by provider and location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayAppointments.map((appointment) => {
              const patient = snapshot.patients.find((item) => item.id === appointment.patientId);
              return (
                <article key={appointment.id} className="rounded-lg border bg-muted/20 px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-sm">
                    <p className="font-semibold text-foreground">{patient?.fullName ?? "Unknown patient"}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{appointment.status.replace("_", " ")}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {appointment.visitType} • {appointment.providerName} • {appointment.locationName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(appointment.startsAt)}</p>
                </article>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Priority alerts</CardTitle>
            <CardDescription>Decision support and operational exceptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.notifications.map((notification) => (
              <article key={notification.id} className="rounded-lg border p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{notification.description}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{notification.priority}</p>
                  </div>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Derm image workload</CardTitle>
            <CardDescription>High-volume photo and dermoscopy tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {snapshot.medicalImages.slice(0, 3).map((image) => {
              const patient = snapshot.patients.find((item) => item.id === image.patientId);
              return (
                <article key={image.id} className="rounded-lg border bg-muted/20 px-3 py-2">
                  <p className="text-sm font-semibold">{patient?.fullName ?? "Unknown patient"}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {image.modality} • {image.bodySite}
                  </p>
                </article>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic reporting pulse</CardTitle>
            <CardDescription>Core KPI view for MVP launch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {snapshot.reportMetrics.slice(0, 3).map((metric) => (
              <article key={metric.id} className="rounded-lg border px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                <p className="text-xl font-semibold">{metric.value}</p>
              </article>
            ))}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
              <FlaskConical className="mb-1 h-4 w-4 text-primary" />
              Integrations are configured for FHIR, payments, messaging, and imaging sync.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
