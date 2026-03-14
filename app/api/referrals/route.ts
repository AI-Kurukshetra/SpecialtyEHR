import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { referrals } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: referrals, total: referrals.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Referral created",
      data: {
        id: `ref_new_${Date.now()}`,
        patientId: body.patientId,
        referredTo: body.referredTo,
        status: body.status ?? "pending"
      }
    },
    { status: 201 }
  );
}
