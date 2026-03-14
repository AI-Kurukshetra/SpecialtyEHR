import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { billingClaims } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: billingClaims, total: billingClaims.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Claim submitted",
      data: {
        id: `clm_new_${Date.now()}`,
        patientId: body.patientId,
        amountCents: body.amountCents,
        status: "submitted"
      }
    },
    { status: 201 }
  );
}
