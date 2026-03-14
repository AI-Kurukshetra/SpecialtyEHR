import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { procedures } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: procedures, total: procedures.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Procedure created",
      data: {
        id: `proc_new_${Date.now()}`,
        name: body.name,
        cptCode: body.cptCode,
        authorizationStatus: "pending"
      }
    },
    { status: 201 }
  );
}
