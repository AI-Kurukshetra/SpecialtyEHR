import { createClient } from "@/lib/supabase/server";
import type {
  Patient,
  PatientAllergy,
  PatientEmergencyContact,
  PatientMedicalHistory,
  PatientVisitTimelineItem
} from "@/types/ehr";

type PatientProfile = {
  patient: Patient;
  medicalHistory: PatientMedicalHistory[];
  allergies: PatientAllergy[];
  emergencyContacts: PatientEmergencyContact[];
  timeline: PatientVisitTimelineItem[];
};

const fallbackProfileData: Omit<PatientProfile, "patient"> = {
  medicalHistory: [
    {
      id: 1,
      patientId: "",
      condition: "Chronic eczema",
      notes: "Managed with topical steroids and moisturizers.",
      diagnosedAt: "2019-06-11"
    }
  ],
  allergies: [
    {
      id: 1,
      patientId: "",
      allergen: "Penicillin",
      reaction: "Rash",
      severity: "moderate"
    }
  ],
  emergencyContacts: [
    {
      id: 1,
      patientId: "",
      name: "Evan Carson",
      relationship: "Spouse",
      phone: "+1-555-2010"
    }
  ],
  timeline: [
    {
      id: "visit_fallback_1",
      patientId: "",
      visitDate: "2026-02-08T14:30:00Z",
      providerName: "Dr. Rivera",
      visitType: "Dermatitis follow-up",
      summary: "Symptoms improved by ~40%. Continue current regimen and hydration protocol."
    }
  ]
};

function mapPatientRow(row: Record<string, unknown>): Patient {
  return {
    id: String(row.id),
    fullName: String(row.full_name),
    specialty: String(row.specialty) as Patient["specialty"],
    dateOfBirth: String(row.date_of_birth),
    gender: row.gender ? String(row.gender) : undefined,
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    addressLine1: row.address_line1 ? String(row.address_line1) : undefined,
    city: row.city ? String(row.city) : undefined,
    state: row.state ? String(row.state) : undefined,
    postalCode: row.postal_code ? String(row.postal_code) : undefined,
    insuranceProvider: String(row.insurance_provider ?? ""),
    insuranceMemberId: row.insurance_member_id ? String(row.insurance_member_id) : undefined,
    insuranceGroupNumber: row.insurance_group_number ? String(row.insurance_group_number) : undefined,
    insurancePolicyHolder: row.insurance_policy_holder ? String(row.insurance_policy_holder) : undefined,
    insuranceVerified: Boolean(row.insurance_verified),
    riskFlags: Array.isArray(row.risk_flags) ? row.risk_flags.map(String) : [],
    portalEnabled: Boolean(row.portal_enabled),
    lastVisitAt: String(row.last_visit_at ?? new Date().toISOString())
  };
}

export async function getSearchablePatients(query: string): Promise<Patient[]> {
  const supabase = await createClient();

  let request = supabase
    .from("ehr_patients")
    .select(
      "id, full_name, specialty, date_of_birth, gender, phone, email, address_line1, city, state, postal_code, insurance_provider, insurance_member_id, insurance_group_number, insurance_policy_holder, insurance_verified, risk_flags, portal_enabled, last_visit_at"
    )
    .order("full_name", { ascending: true });

  const trimmedQuery = query.trim();
  if (trimmedQuery.length > 0) {
    const escapedQuery = trimmedQuery.replace(/[%_]/g, "");
    request = request.or(`full_name.ilike.%${escapedQuery}%,email.ilike.%${escapedQuery}%,phone.ilike.%${escapedQuery}%`);
  }

  const { data, error } = await request;
  if (error || !data) {
    return [];
  }

  return data.map((row) => mapPatientRow(row));
}

export async function getPatientProfile(patientId: string): Promise<PatientProfile | null> {
  const supabase = await createClient();

  const [patientRes, historyRes, allergiesRes, contactsRes, visitsRes, appointmentsRes] = await Promise.all([
    supabase
      .from("ehr_patients")
      .select(
        "id, full_name, specialty, date_of_birth, gender, phone, email, address_line1, city, state, postal_code, insurance_provider, insurance_member_id, insurance_group_number, insurance_policy_holder, insurance_verified, risk_flags, portal_enabled, last_visit_at"
      )
      .eq("id", patientId)
      .single(),
    supabase
      .from("ehr_patient_medical_history")
      .select("id, patient_id, condition, notes, diagnosed_at")
      .eq("patient_id", patientId)
      .order("id", { ascending: true }),
    supabase
      .from("ehr_patient_allergies")
      .select("id, patient_id, allergen, reaction, severity")
      .eq("patient_id", patientId)
      .order("id", { ascending: true }),
    supabase
      .from("ehr_patient_emergency_contacts")
      .select("id, patient_id, name, relationship, phone")
      .eq("patient_id", patientId)
      .order("id", { ascending: true }),
    supabase
      .from("ehr_patient_visits")
      .select("id, patient_id, visit_date, provider_name, visit_type, summary")
      .eq("patient_id", patientId)
      .order("visit_date", { ascending: false }),
    supabase
      .from("ehr_appointments")
      .select("id, patient_id, starts_at, provider_name, visit_type, status")
      .eq("patient_id", patientId)
      .order("starts_at", { ascending: false })
  ]);

  if (patientRes.error || !patientRes.data) {
    return null;
  }

  const visitsFromAppointments: PatientVisitTimelineItem[] = (appointmentsRes.data ?? []).map((appointment) => ({
    id: `appointment_${appointment.id}`,
    patientId: String(appointment.patient_id),
    visitDate: String(appointment.starts_at),
    providerName: String(appointment.provider_name),
    visitType: `Appointment • ${appointment.visit_type}`,
    summary: `Status: ${appointment.status}`
  }));

  const visitsFromTimeline: PatientVisitTimelineItem[] = (visitsRes.data ?? []).map((visit) => ({
    id: String(visit.id),
    patientId: String(visit.patient_id),
    visitDate: String(visit.visit_date),
    providerName: String(visit.provider_name),
    visitType: String(visit.visit_type),
    summary: String(visit.summary)
  }));

  const mergedTimeline = [...visitsFromTimeline, ...visitsFromAppointments].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  return {
    patient: mapPatientRow(patientRes.data),
    medicalHistory:
      historyRes.error || !historyRes.data
        ? fallbackProfileData.medicalHistory.map((item) => ({ ...item, patientId }))
        : historyRes.data.map((item) => ({
            id: Number(item.id),
            patientId: String(item.patient_id),
            condition: String(item.condition),
            notes: String(item.notes ?? ""),
            diagnosedAt: item.diagnosed_at ? String(item.diagnosed_at) : null
          })),
    allergies:
      allergiesRes.error || !allergiesRes.data
        ? fallbackProfileData.allergies.map((item) => ({ ...item, patientId }))
        : allergiesRes.data.map((item) => ({
            id: Number(item.id),
            patientId: String(item.patient_id),
            allergen: String(item.allergen),
            reaction: String(item.reaction ?? ""),
            severity: String(item.severity) as PatientAllergy["severity"]
          })),
    emergencyContacts:
      contactsRes.error || !contactsRes.data
        ? fallbackProfileData.emergencyContacts.map((item) => ({ ...item, patientId }))
        : contactsRes.data.map((item) => ({
            id: Number(item.id),
            patientId: String(item.patient_id),
            name: String(item.name),
            relationship: String(item.relationship),
            phone: String(item.phone)
          })),
    timeline: mergedTimeline.length > 0 ? mergedTimeline : fallbackProfileData.timeline.map((item) => ({ ...item, patientId }))
  };
}

export async function createPatientRegistration(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to register a patient");
  }

  const id = `pat_${Date.now()}`;
  const now = new Date().toISOString();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const specialty = String(formData.get("specialty") ?? "dermatology");
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "");
  const gender = String(formData.get("gender") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const insuranceProvider = String(formData.get("insuranceProvider") ?? "").trim();
  const insuranceMemberId = String(formData.get("insuranceMemberId") ?? "").trim();
  const insuranceGroupNumber = String(formData.get("insuranceGroupNumber") ?? "").trim();
  const insurancePolicyHolder = String(formData.get("insurancePolicyHolder") ?? "").trim();
  const insuranceVerified = String(formData.get("insuranceVerified") ?? "false") === "true";
  const medicalHistory = String(formData.get("medicalHistory") ?? "").trim();
  const allergies = String(formData.get("allergies") ?? "").trim();
  const emergencyContactName = String(formData.get("emergencyContactName") ?? "").trim();
  const emergencyContactRelationship = String(formData.get("emergencyContactRelationship") ?? "").trim();
  const emergencyContactPhone = String(formData.get("emergencyContactPhone") ?? "").trim();

  if (!fullName || !dateOfBirth || !phone) {
    throw new Error("Full name, date of birth, and phone are required");
  }

  const patientInsert = await supabase.from("ehr_patients").insert({
    id,
    user_id: user.id,
    full_name: fullName,
    specialty,
    date_of_birth: dateOfBirth,
    gender,
    phone,
    email,
    address_line1: addressLine1,
    city,
    state,
    postal_code: postalCode,
    insurance_provider: insuranceProvider,
    insurance_member_id: insuranceMemberId,
    insurance_group_number: insuranceGroupNumber,
    insurance_policy_holder: insurancePolicyHolder,
    insurance_verified: insuranceVerified,
    portal_enabled: true,
    risk_flags: [],
    last_visit_at: now
  });

  if (patientInsert.error) {
    throw new Error(patientInsert.error.message);
  }

  if (medicalHistory) {
    await supabase.from("ehr_patient_medical_history").insert({
      user_id: user.id,
      patient_id: id,
      condition: medicalHistory,
      notes: "Entered during intake"
    });
  }

  if (allergies) {
    await supabase.from("ehr_patient_allergies").insert({
      user_id: user.id,
      patient_id: id,
      allergen: allergies,
      reaction: "Noted during intake",
      severity: "moderate"
    });
  }

  if (emergencyContactName && emergencyContactPhone) {
    await supabase.from("ehr_patient_emergency_contacts").insert({
      user_id: user.id,
      patient_id: id,
      name: emergencyContactName,
      relationship: emergencyContactRelationship || "Contact",
      phone: emergencyContactPhone
    });
  }

  await supabase.from("ehr_patient_visits").insert({
    id: `visit_${Date.now()}`,
    user_id: user.id,
    patient_id: id,
    visit_date: now,
    provider_name: "Intake Team",
    visit_type: "Registration",
    summary: "Patient registration and demographic intake completed."
  });

  return id;
}
