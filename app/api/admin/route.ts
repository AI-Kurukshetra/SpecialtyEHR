import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { adminRoles } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: adminRoles, total: adminRoles.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Admin operation captured",
      data: {
        id: `adm_evt_${Date.now()}`,
        action: body.action ?? "role_update_requested",
        status: "accepted"
      }
    },
    { status: 202 }
  );
}
