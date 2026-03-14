import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { patients } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: patients, total: patients.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Patient intake captured",
      data: {
        id: `pat_new_${Date.now()}`,
        fullName: body.fullName ?? "New Patient",
        created: true
      }
    },
    { status: 201 }
  );
}
