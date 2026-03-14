export type Priority = "low" | "medium" | "high";

export type AppointmentStatus = "scheduled" | "checked_in" | "in_progress" | "completed" | "cancelled";

export type ClaimStatus = "draft" | "submitted" | "paid" | "denied" | "action_required";

export interface Patient {
  id: string;
  fullName: string;
  specialty: "dermatology" | "ophthalmology" | "plastic_surgery";
  dateOfBirth: string;
  gender?: string;
  phone: string;
  email: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  insuranceProvider: string;
  insuranceMemberId?: string;
  insuranceGroupNumber?: string;
  insurancePolicyHolder?: string;
  insuranceVerified: boolean;
  riskFlags: string[];
  portalEnabled: boolean;
  lastVisitAt: string;
}

export interface PatientMedicalHistory {
  id: number;
  patientId: string;
  condition: string;
  notes: string;
  diagnosedAt: string | null;
}

export interface PatientAllergy {
  id: number;
  patientId: string;
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
}

export interface PatientEmergencyContact {
  id: number;
  patientId: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientVisitTimelineItem {
  id: string;
  patientId: string;
  visitDate: string;
  providerName: string;
  visitType: string;
  summary: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerName: string;
  locationName: string;
  startsAt: string;
  endsAt: string;
  visitType: string;
  status: AppointmentStatus;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  author: string;
  soapSummary: string;
  diagnosisCodes: string[];
  signed: boolean;
  createdAt: string;
}

export interface Procedure {
  id: string;
  patientId: string;
  name: string;
  cptCode: string;
  status: "planned" | "ready" | "completed";
  consentSigned: boolean;
  authorizationStatus: "approved" | "pending" | "denied";
  scheduledAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dose: string;
  interactionsChecked: boolean;
  prescribedBy: string;
  createdAt: string;
}

export interface BillingClaim {
  id: string;
  patientId: string;
  procedureId: string;
  amountCents: number;
  payer: string;
  status: ClaimStatus;
  submittedAt: string;
}

export interface MedicalImage {
  id: string;
  patientId: string;
  modality: "photo" | "oct" | "fundus" | "dermoscopy";
  capturedAt: string;
  bodySite: string;
  progressionNote: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  status: "pending" | "received" | "reviewed";
  resultedAt: string;
}

export interface Referral {
  id: string;
  patientId: string;
  referredTo: string;
  reason: string;
  status: "pending" | "accepted" | "completed";
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "medication" | "supply" | "device";
  quantityOnHand: number;
  reorderPoint: number;
  locationName: string;
}

export interface Notification {
  id: string;
  type: "authorization" | "critical_lab" | "claim" | "schedule";
  priority: Priority;
  title: string;
  description: string;
  createdAt: string;
}

export interface ReportMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  category: "ehr" | "payments" | "communications" | "imaging";
  status: "healthy" | "degraded" | "offline";
  lastSyncAt: string;
}

export interface AdminRole {
  id: string;
  role: string;
  users: number;
  permissions: string[];
}

export interface DashboardSnapshot {
  patients: Patient[];
  appointments: Appointment[];
  clinicalNotes: ClinicalNote[];
  procedures: Procedure[];
  prescriptions: Prescription[];
  billingClaims: BillingClaim[];
  medicalImages: MedicalImage[];
  labResults: LabResult[];
  referrals: Referral[];
  inventoryItems: InventoryItem[];
  notifications: Notification[];
  reportMetrics: ReportMetric[];
  integrations: IntegrationStatus[];
  adminRoles: AdminRole[];
}
