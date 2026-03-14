import { createClient } from "@/lib/supabase/server";
import { getDashboardSnapshot } from "@/services/ehr-data";
import type { DashboardSnapshot } from "@/types/ehr";

export async function loadDashboardSnapshotFromDb(): Promise<DashboardSnapshot> {
  const supabase = await createClient();

  const [
    patientsRes,
    appointmentsRes,
    clinicalNotesRes,
    proceduresRes,
    prescriptionsRes,
    billingClaimsRes,
    medicalImagesRes,
    labResultsRes,
    referralsRes,
    inventoryRes,
    notificationsRes,
    metricsRes,
    integrationsRes,
    adminRolesRes
  ] = await Promise.all([
    supabase
      .from("ehr_patients")
      .select(
        "id, full_name, specialty, date_of_birth, gender, phone, email, address_line1, city, state, postal_code, insurance_provider, insurance_member_id, insurance_group_number, insurance_policy_holder, insurance_verified, risk_flags, portal_enabled, last_visit_at"
      ),
    supabase.from("ehr_appointments").select("id, patient_id, provider_name, location_name, starts_at, ends_at, visit_type, status"),
    supabase.from("ehr_clinical_notes").select("id, patient_id, author, soap_summary, diagnosis_codes, signed, created_at"),
    supabase.from("ehr_procedures").select("id, patient_id, name, cpt_code, status, consent_signed, authorization_status, scheduled_at"),
    supabase.from("ehr_prescriptions").select("id, patient_id, medication, dose, interactions_checked, prescribed_by, created_at"),
    supabase.from("ehr_billing_claims").select("id, patient_id, procedure_id, amount_cents, payer, status, submitted_at"),
    supabase.from("ehr_medical_images").select("id, patient_id, modality, captured_at, body_site, progression_note"),
    supabase.from("ehr_lab_results").select("id, patient_id, test_name, status, resulted_at"),
    supabase.from("ehr_referrals").select("id, patient_id, referred_to, reason, status, created_at"),
    supabase.from("ehr_inventory_items").select("id, name, category, quantity_on_hand, reorder_point, location_name"),
    supabase.from("ehr_notifications").select("id, type, priority, title, description, created_at"),
    supabase.from("ehr_report_metrics").select("id, label, value, trend"),
    supabase.from("ehr_integrations").select("id, name, category, status, last_sync_at"),
    supabase.from("ehr_admin_roles").select("id, role, users, permissions")
  ]);

  const hasError = [
    patientsRes.error,
    appointmentsRes.error,
    clinicalNotesRes.error,
    proceduresRes.error,
    prescriptionsRes.error,
    billingClaimsRes.error,
    medicalImagesRes.error,
    labResultsRes.error,
    referralsRes.error,
    inventoryRes.error,
    notificationsRes.error,
    metricsRes.error,
    integrationsRes.error,
    adminRolesRes.error
  ].some(Boolean);

  const hasData = (patientsRes.data?.length ?? 0) > 0;

  if (hasError || !hasData) {
    return getDashboardSnapshot();
  }

  return {
    patients: (patientsRes.data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      specialty: row.specialty,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      phone: row.phone,
      email: row.email,
      addressLine1: row.address_line1,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      insuranceProvider: row.insurance_provider,
      insuranceMemberId: row.insurance_member_id,
      insuranceGroupNumber: row.insurance_group_number,
      insurancePolicyHolder: row.insurance_policy_holder,
      insuranceVerified: row.insurance_verified,
      riskFlags: row.risk_flags ?? [],
      portalEnabled: row.portal_enabled,
      lastVisitAt: row.last_visit_at
    })),
    appointments: (appointmentsRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      providerName: row.provider_name,
      locationName: row.location_name,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      visitType: row.visit_type,
      status: row.status
    })),
    clinicalNotes: (clinicalNotesRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      author: row.author,
      soapSummary: row.soap_summary,
      diagnosisCodes: row.diagnosis_codes ?? [],
      signed: row.signed,
      createdAt: row.created_at
    })),
    procedures: (proceduresRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      name: row.name,
      cptCode: row.cpt_code,
      status: row.status,
      consentSigned: row.consent_signed,
      authorizationStatus: row.authorization_status,
      scheduledAt: row.scheduled_at
    })),
    prescriptions: (prescriptionsRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      medication: row.medication,
      dose: row.dose,
      interactionsChecked: row.interactions_checked,
      prescribedBy: row.prescribed_by,
      createdAt: row.created_at
    })),
    billingClaims: (billingClaimsRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      procedureId: row.procedure_id,
      amountCents: row.amount_cents,
      payer: row.payer,
      status: row.status,
      submittedAt: row.submitted_at
    })),
    medicalImages: (medicalImagesRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      modality: row.modality,
      capturedAt: row.captured_at,
      bodySite: row.body_site,
      progressionNote: row.progression_note
    })),
    labResults: (labResultsRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      testName: row.test_name,
      status: row.status,
      resultedAt: row.resulted_at
    })),
    referrals: (referralsRes.data ?? []).map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      referredTo: row.referred_to,
      reason: row.reason,
      status: row.status,
      createdAt: row.created_at
    })),
    inventoryItems: (inventoryRes.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      quantityOnHand: row.quantity_on_hand,
      reorderPoint: row.reorder_point,
      locationName: row.location_name
    })),
    notifications: (notificationsRes.data ?? []).map((row) => ({
      id: row.id,
      type: row.type,
      priority: row.priority,
      title: row.title,
      description: row.description,
      createdAt: row.created_at
    })),
    reportMetrics: (metricsRes.data ?? []).map((row) => ({
      id: row.id,
      label: row.label,
      value: row.value,
      trend: row.trend
    })),
    integrations: (integrationsRes.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      status: row.status,
      lastSyncAt: row.last_sync_at
    })),
    adminRoles: (adminRolesRes.data ?? []).map((row) => ({
      id: row.id,
      role: row.role,
      users: row.users,
      permissions: row.permissions ?? []
    }))
  };
}
