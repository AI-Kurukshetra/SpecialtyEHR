import Link from "next/link";
import { CalendarCheck2, CircleDollarSign, FileText, MessageSquareText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { formatCurrency, formatDateTime, getPortalContext } from "@/services/dashboard";

export default async function PatientPortalPage() {
  await requirePermission("dashboard.read");
  const { portalPatient, snapshot } = await getPortalContext();

  if (!portalPatient) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient Portal</CardTitle>
            <CardDescription>No portal-enabled dermatology patient records are currently available.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const appointments = snapshot.appointments.filter((item) => item.patientId === portalPatient.id);
  const notes = snapshot.clinicalNotes.filter((item) => item.patientId === portalPatient.id);
  const claims = snapshot.billingClaims.filter((item) => item.patientId === portalPatient.id);
  const latestClaim = claims[0];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,hsl(210_58%_97%),hsl(210_42%_99%))] px-3 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Patient Portal</p>
          <h1 className="mt-1 text-2xl font-semibold">Welcome, {portalPatient.fullName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dermatology-first portal for appointments, visit summaries, billing transparency, and secure updates.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/dashboard" className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
              Back to team dashboard
            </Link>
            <button type="button" className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
              Request appointment
            </button>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Upcoming visits</CardDescription>
              <CardTitle className="flex items-center justify-between text-2xl">
                {appointments.length}
                <CalendarCheck2 className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Visit summaries</CardDescription>
              <CardTitle className="flex items-center justify-between text-2xl">
                {notes.length}
                <FileText className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Latest claim</CardDescription>
              <CardTitle className="flex items-center justify-between text-2xl">
                {latestClaim ? formatCurrency(latestClaim.amountCents) : "$0"}
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Secure messaging</CardDescription>
              <CardTitle className="flex items-center justify-between text-2xl">
                24/7
                <MessageSquareText className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointments</CardTitle>
              <CardDescription>Mobile-friendly timeline of upcoming and recent care visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.map((appointment) => (
                <article key={appointment.id} className="rounded-lg border p-3">
                  <p className="text-sm font-semibold">{appointment.visitType}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(appointment.startsAt)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{appointment.providerName}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing & Records</CardTitle>
              <CardDescription>Transparent claim status and care summary access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {claims.map((claim) => (
                <article key={claim.id} className="rounded-lg border p-3">
                  <p className="text-sm font-semibold">Claim {claim.id.toUpperCase()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Amount: {formatCurrency(claim.amountCents)}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{claim.status.replace("_", " ")}</p>
                </article>
              ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mb-1 h-4 w-4 text-primary" />
                Essential integrations active: payment gateway, appointment reminders, and EHR sync.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
