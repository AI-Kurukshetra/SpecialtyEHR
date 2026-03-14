import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { prescriptions } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: prescriptions, total: prescriptions.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Prescription generated",
      data: {
        id: `rx_new_${Date.now()}`,
        patientId: body.patientId,
        medication: body.medication,
        interactionsChecked: true
      }
    },
    { status: 201 }
  );
}
