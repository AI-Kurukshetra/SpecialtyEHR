import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { appointments } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: appointments, total: appointments.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Appointment scheduled",
      data: {
        id: `apt_new_${Date.now()}`,
        patientId: body.patientId,
        providerName: body.providerName,
        startsAt: body.startsAt
      }
    },
    { status: 201 }
  );
}
