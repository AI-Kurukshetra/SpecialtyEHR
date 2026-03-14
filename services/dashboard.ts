import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/guards";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";
import type { DashboardSnapshot, Patient } from "@/types/ehr";

const MVP_SPECIALTY: Patient["specialty"] = "dermatology";

function filterSnapshotBySpecialty(snapshot: DashboardSnapshot, specialty: Patient["specialty"]) {
  const specialtyPatients = snapshot.patients.filter((patient) => patient.specialty === specialty);
  if (specialtyPatients.length === 0) return snapshot;

  const patientIds = new Set(specialtyPatients.map((patient) => patient.id));
  const procedureIds = new Set(
    snapshot.procedures.filter((procedure) => patientIds.has(procedure.patientId)).map((procedure) => procedure.id)
  );

  return {
    ...snapshot,
    patients: specialtyPatients,
    appointments: snapshot.appointments.filter((appointment) => patientIds.has(appointment.patientId)),
    clinicalNotes: snapshot.clinicalNotes.filter((note) => patientIds.has(note.patientId)),
    procedures: snapshot.procedures.filter((procedure) => patientIds.has(procedure.patientId)),
    prescriptions: snapshot.prescriptions.filter((prescription) => patientIds.has(prescription.patientId)),
    billingClaims: snapshot.billingClaims.filter((claim) => patientIds.has(claim.patientId) || procedureIds.has(claim.procedureId)),
    medicalImages: snapshot.medicalImages.filter((image) => patientIds.has(image.patientId)),
    labResults: snapshot.labResults.filter((result) => patientIds.has(result.patientId)),
    referrals: snapshot.referrals.filter((referral) => patientIds.has(referral.patientId))
  };
}

export async function requireDashboardUser() {
  const { role } = await requirePermission("dashboard.read");
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const snapshot = filterSnapshotBySpecialty(await loadDashboardSnapshotFromDb(), MVP_SPECIALTY);
  const openTasks =
    snapshot.clinicalNotes.filter((note) => !note.signed).length +
    snapshot.procedures.filter((procedure) => procedure.authorizationStatus === "pending").length +
    snapshot.billingClaims.filter((claim) => claim.status === "action_required").length;
  const revenueCents = snapshot.billingClaims.reduce((total, claim) => total + claim.amountCents, 0);

  return {
    user,
    role,
    profile,
    snapshot,
    openTasks,
    todayAppointments: snapshot.appointments,
    revenueCents
  };
}

export async function getPortalContext() {
  const { user, profile, snapshot } = await requireDashboardUser();
  const portalPatient = snapshot.patients.find((patient) => patient.portalEnabled) ?? snapshot.patients[0];

  return { user, profile, snapshot, portalPatient };
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(cents / 100);
}

export function formatDateTime(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(isoDate));
}
