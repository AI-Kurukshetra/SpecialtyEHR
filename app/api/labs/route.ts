import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { labResults } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: labResults, total: labResults.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Lab result recorded",
      data: {
        id: `lab_new_${Date.now()}`,
        patientId: body.patientId,
        testName: body.testName,
        status: body.status ?? "ordered"
      }
    },
    { status: 201 }
  );
}
