import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { inventoryItems } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: inventoryItems, total: inventoryItems.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Inventory adjustment captured",
      data: {
        id: body.id,
        quantityOnHand: body.quantityOnHand
      }
    },
    { status: 202 }
  );
}
