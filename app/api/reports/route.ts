import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { reportMetrics } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: reportMetrics, total: reportMetrics.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Report generation queued",
      data: {
        id: `rpt_new_${Date.now()}`,
        type: body.type ?? "operational",
        status: "queued"
      }
    },
    { status: 202 }
  );
}
