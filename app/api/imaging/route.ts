import { NextResponse } from "next/server";
import { loadDashboardSnapshotFromDb } from "@/services/ehr-db";

export async function GET() {
  const { medicalImages } = await loadDashboardSnapshotFromDb();
  return NextResponse.json({ data: medicalImages, total: medicalImages.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      message: "Image metadata recorded",
      data: {
        id: `img_new_${Date.now()}`,
        patientId: body.patientId,
        modality: body.modality,
        uploaded: true
      }
    },
    { status: 201 }
  );
}
