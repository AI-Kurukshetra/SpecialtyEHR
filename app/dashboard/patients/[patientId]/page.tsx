import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime } from "@/services/dashboard";
import { getPatientProfile } from "@/services/patient-module";

type PatientProfilePageProps = {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function PatientProfilePage({ params, searchParams }: PatientProfilePageProps) {
  await requirePermission("patients.read");

  const { patientId } = await params;
  const { message } = await searchParams;
  const profile = await getPatientProfile(patientId);

  if (!profile) {
    notFound();
  }

  const { patient, medicalHistory, allergies, emergencyContacts, timeline } = profile;

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{patient.fullName}</CardTitle>
              <CardDescription>
                Dermatology profile with demographics, insurance details, history, allergies, and timeline.
              </CardDescription>
            </div>
            <Link href="/dashboard/patients" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to list
            </Link>
          </div>
          {message && <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        </CardHeader>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demographic information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>Date of birth: {patient.dateOfBirth}</p>
            <p>Gender: {patient.gender || "Not provided"}</p>
            <p>Email: {patient.email || "Not provided"}</p>
            <p>Phone: {patient.phone || "Not provided"}</p>
            <p>
              Address: {[patient.addressLine1, patient.city, patient.state, patient.postalCode].filter(Boolean).join(", ") ||
                "Not provided"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Insurance details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>Provider: {patient.insuranceProvider || "Not provided"}</p>
            <p>Member ID: {patient.insuranceMemberId || "Not provided"}</p>
            <p>Group #: {patient.insuranceGroupNumber || "Not provided"}</p>
            <p>Policy holder: {patient.insurancePolicyHolder || "Not provided"}</p>
            <p>Verification: {patient.insuranceVerified ? "Verified" : "Pending"}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medical history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicalHistory.map((item) => (
              <article key={item.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{item.condition}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.notes}</p>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Allergies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allergies.map((item) => (
              <article key={item.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{item.allergen}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.reaction}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{item.severity}</p>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((item) => (
              <article key={item.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.relationship}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.phone}</p>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Patient timeline of visits</CardTitle>
          <CardDescription>Recent appointments and documented visit summaries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {timeline.map((item) => (
            <article key={item.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{item.visitType}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(item.visitDate)}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Provider: {item.providerName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
