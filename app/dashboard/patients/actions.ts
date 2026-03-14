"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPatientRegistration } from "@/services/patient-module";

export async function registerPatient(formData: FormData) {
  try {
    const patientId = await createPatientRegistration(formData);
    revalidatePath("/dashboard/patients");
    redirect(`/dashboard/patients/${patientId}?message=Patient registered successfully`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to register patient";
    redirect(`/dashboard/patients/new?error=${encodeURIComponent(message)}`);
  }
}
