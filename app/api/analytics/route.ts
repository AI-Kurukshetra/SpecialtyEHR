import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const snapshot = await loadDashboardSnapshotFromDb();
  const revenueCents = snapshot.billingClaims.reduce((total, claim) => total + claim.amountCents, 0);
  const openTasks =
    snapshot.clinicalNotes.filter((note) => !note.signed).length +
    snapshot.procedures.filter((procedure) => procedure.authorizationStatus === "pending").length +
    snapshot.billingClaims.filter((claim) => claim.status === "action_required").length;

  return NextResponse.json({
    data: {
      patientCount: snapshot.patients.length,
      appointmentsToday: snapshot.appointments.length,
      openTasks,
      monthlyRevenueCents: revenueCents,
      imagesTracked: snapshot.medicalImages.length,
      claimVolume: snapshot.billingClaims.length
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Analytics computation queued",
      data: {
        id: `anl_new_${Date.now()}`,
        metric: body.metric ?? "dashboard_overview",
        status: "queued"
      }
    },
    { status: 202 }
  );
}
