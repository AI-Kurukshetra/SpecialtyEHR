import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const snapshot = await loadDashboardSnapshotFromDb();
  const dermatologyPatients = snapshot.patients.filter((patient) => patient.specialty === "dermatology" && patient.portalEnabled);
  const patient = dermatologyPatients[0];

  if (!patient) {
    return NextResponse.json({ data: null, message: "No dermatology portal patient available" });
  }

  return NextResponse.json({
    data: {
      patient,
      appointments: snapshot.appointments.filter((item) => item.patientId === patient.id),
      clinicalNotes: snapshot.clinicalNotes.filter((item) => item.patientId === patient.id),
      billingClaims: snapshot.billingClaims.filter((item) => item.patientId === patient.id)
    }
  });
}
