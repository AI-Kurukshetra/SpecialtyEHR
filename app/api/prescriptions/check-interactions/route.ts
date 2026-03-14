import { NextResponse } from "next/server";
import { authorizeApi, badRequest } from "@/lib/auth/api";

type Interaction = {
  medicationA: string;
  medicationB: string;
  severity: "low" | "moderate" | "high";
  message: string;
};

const interactionRules: Array<{
  meds: [string, string];
  severity: Interaction["severity"];
  message: string;
}> = [
  {
    meds: ["warfarin", "fluconazole"],
    severity: "high",
    message: "May significantly increase bleeding risk."
  },
  {
    meds: ["isotretinoin", "tetracycline"],
    severity: "high",
    message: "Avoid combination due to risk of intracranial hypertension."
  },
  {
    meds: ["prednisone", "ibuprofen"],
    severity: "moderate",
    message: "Increased GI irritation/bleeding risk; monitor and use protective measures."
  }
];

export async function POST(request: Request) {
  const auth = await authorizeApi("clinical.read");
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const medications = (body.medications ?? []) as string[];
  if (!Array.isArray(medications) || medications.length === 0) {
    return badRequest("medications must be a non-empty array");
  }

  const normalized = medications.map((m) => m.toLowerCase().trim()).filter(Boolean);
  const found: Interaction[] = [];

  for (const rule of interactionRules) {
    const [a, b] = rule.meds;
    if (normalized.includes(a) && normalized.includes(b)) {
      found.push({
        medicationA: a,
        medicationB: b,
        severity: rule.severity,
        message: rule.message
      });
    }
  }

  return NextResponse.json({
    data: {
      medications,
      interactions: found,
      interaction_checked: true
    }
  });
}
