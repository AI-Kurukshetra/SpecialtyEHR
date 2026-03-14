import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { integrations } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: integrations, total: integrations.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Integration sync requested",
      data: {
        id: body.id ?? `int_new_${Date.now()}`,
        name: body.name ?? "Integration",
        status: "sync_queued"
      }
    },
    { status: 202 }
  );
}
