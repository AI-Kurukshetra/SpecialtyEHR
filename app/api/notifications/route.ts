import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { notifications } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: notifications, total: notifications.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: "Notification acknowledged", data: { id: body.id, acknowledged: true } });
}
