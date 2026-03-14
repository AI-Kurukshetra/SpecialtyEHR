import type {
  AdminRole,
  Appointment,
  BillingClaim,
  ClinicalNote,
  DashboardSnapshot,
  IntegrationStatus,
  InventoryItem,
  LabResult,
  MedicalImage,
  Notification,
  Patient,
  Prescription,
  Procedure,
  Referral,
  ReportMetric
} from "@/types/ehr";

const patients: Patient[] = [
  {
    id: "pat_001",
    fullName: "Maya Carson",
    specialty: "dermatology",
    dateOfBirth: "1988-06-14",
    phone: "+1-555-0101",
    email: "maya.carson@example.com",
    insuranceProvider: "Blue Cross",
    insuranceVerified: true,
    riskFlags: ["high_risk_lesion"],
    portalEnabled: true,
    lastVisitAt: "2026-03-12T10:30:00Z"
  },
  {
    id: "pat_002",
    fullName: "Andre Bennett",
    specialty: "ophthalmology",
    dateOfBirth: "1962-01-03",
    phone: "+1-555-0102",
    email: "andre.bennett@example.com",
    insuranceProvider: "Aetna",
    insuranceVerified: true,
    riskFlags: ["diabetic_retinopathy_screening"],
    portalEnabled: true,
    lastVisitAt: "2026-03-10T14:00:00Z"
  },
  {
    id: "pat_003",
    fullName: "Lena Hart",
    specialty: "plastic_surgery",
    dateOfBirth: "1991-09-21",
    phone: "+1-555-0103",
    email: "lena.hart@example.com",
    insuranceProvider: "UnitedHealthcare",
    insuranceVerified: false,
    riskFlags: [],
    portalEnabled: true,
    lastVisitAt: "2026-03-08T09:15:00Z"
  },
  {
    id: "pat_004",
    fullName: "Noah Emerson",
    specialty: "dermatology",
    dateOfBirth: "1977-11-30",
    phone: "+1-555-0104",
    email: "noah.emerson@example.com",
    insuranceProvider: "Cigna",
    insuranceVerified: true,
    riskFlags: ["prior_authorization_required"],
    portalEnabled: false,
    lastVisitAt: "2026-03-11T16:45:00Z"
  }
];

const appointments: Appointment[] = [
  {
    id: "apt_001",
    patientId: "pat_001",
    providerName: "Dr. Rivera",
    locationName: "Downtown Clinic",
    startsAt: "2026-03-14T09:00:00Z",
    endsAt: "2026-03-14T09:30:00Z",
    visitType: "Lesion follow-up",
    status: "checked_in"
  },
  {
    id: "apt_002",
    patientId: "pat_002",
    providerName: "Dr. Kline",
    locationName: "Vision Center",
    startsAt: "2026-03-14T10:15:00Z",
    endsAt: "2026-03-14T10:45:00Z",
    visitType: "Retina screening",
    status: "scheduled"
  },
  {
    id: "apt_003",
    patientId: "pat_003",
    providerName: "Dr. Song",
    locationName: "Aesthetic Suite",
    startsAt: "2026-03-14T13:00:00Z",
    endsAt: "2026-03-14T14:00:00Z",
    visitType: "Pre-op planning",
    status: "scheduled"
  },
  {
    id: "apt_004",
    patientId: "pat_004",
    providerName: "Dr. Rivera",
    locationName: "Downtown Clinic",
    startsAt: "2026-03-14T15:00:00Z",
    endsAt: "2026-03-14T15:20:00Z",
    visitType: "Biopsy review",
    status: "in_progress"
  }
];

const clinicalNotes: ClinicalNote[] = [
  {
    id: "note_001",
    patientId: "pat_001",
    author: "Dr. Rivera",
    soapSummary: "Lesion dimensions stable. Continue topical regimen.",
    diagnosisCodes: ["L81.4"],
    signed: true,
    createdAt: "2026-03-12T11:00:00Z"
  },
  {
    id: "note_002",
    patientId: "pat_002",
    author: "Dr. Kline",
    soapSummary: "Mild progression in right-eye edema. OCT ordered.",
    diagnosisCodes: ["E11.311"],
    signed: false,
    createdAt: "2026-03-13T15:40:00Z"
  }
];

const procedures: Procedure[] = [
  {
    id: "proc_001",
    patientId: "pat_003",
    name: "Rhinoplasty consult + simulation",
    cptCode: "30400",
    status: "ready",
    consentSigned: true,
    authorizationStatus: "approved",
    scheduledAt: "2026-03-18T10:00:00Z"
  },
  {
    id: "proc_002",
    patientId: "pat_004",
    name: "Excision with pathology",
    cptCode: "11402",
    status: "planned",
    consentSigned: false,
    authorizationStatus: "pending",
    scheduledAt: "2026-03-16T08:30:00Z"
  }
];

const prescriptions: Prescription[] = [
  {
    id: "rx_001",
    patientId: "pat_001",
    medication: "Clobetasol 0.05%",
    dose: "BID for 14 days",
    interactionsChecked: true,
    prescribedBy: "Dr. Rivera",
    createdAt: "2026-03-12T11:20:00Z"
  },
  {
    id: "rx_002",
    patientId: "pat_002",
    medication: "Prednisolone acetate",
    dose: "QID right eye",
    interactionsChecked: true,
    prescribedBy: "Dr. Kline",
    createdAt: "2026-03-13T16:00:00Z"
  }
];

const billingClaims: BillingClaim[] = [
  {
    id: "clm_001",
    patientId: "pat_001",
    procedureId: "proc_002",
    amountCents: 44500,
    payer: "Blue Cross",
    status: "submitted",
    submittedAt: "2026-03-13T18:00:00Z"
  },
  {
    id: "clm_002",
    patientId: "pat_002",
    procedureId: "proc_001",
    amountCents: 119900,
    payer: "Aetna",
    status: "action_required",
    submittedAt: "2026-03-13T18:10:00Z"
  }
];

const medicalImages: MedicalImage[] = [
  {
    id: "img_001",
    patientId: "pat_001",
    modality: "dermoscopy",
    capturedAt: "2026-03-12T10:50:00Z",
    bodySite: "Left forearm",
    progressionNote: "No increase in pigmentation spread"
  },
  {
    id: "img_002",
    patientId: "pat_002",
    modality: "oct",
    capturedAt: "2026-03-13T15:20:00Z",
    bodySite: "Right retina",
    progressionNote: "Slightly increased edema thickness"
  },
  {
    id: "img_003",
    patientId: "pat_003",
    modality: "photo",
    capturedAt: "2026-03-10T09:15:00Z",
    bodySite: "Nasal profile",
    progressionNote: "Baseline before/after set created"
  }
];

const labResults: LabResult[] = [
  {
    id: "lab_001",
    patientId: "pat_004",
    testName: "Dermatopathology biopsy",
    status: "pending",
    resultedAt: "2026-03-15T12:00:00Z"
  },
  {
    id: "lab_002",
    patientId: "pat_002",
    testName: "HbA1c",
    status: "reviewed",
    resultedAt: "2026-03-11T08:20:00Z"
  }
];

const referrals: Referral[] = [
  {
    id: "ref_001",
    patientId: "pat_001",
    referredTo: "Oncology Dermatology Group",
    reason: "Second opinion for atypical lesion",
    status: "pending",
    createdAt: "2026-03-13T12:30:00Z"
  },
  {
    id: "ref_002",
    patientId: "pat_002",
    referredTo: "Endocrinology Partners",
    reason: "Glycemic management for retina outcomes",
    status: "accepted",
    createdAt: "2026-03-12T14:00:00Z"
  }
];

const inventoryItems: InventoryItem[] = [
  {
    id: "inv_001",
    name: "Lidocaine 1%",
    category: "medication",
    quantityOnHand: 18,
    reorderPoint: 20,
    locationName: "Downtown Clinic"
  },
  {
    id: "inv_002",
    name: "Surgical sutures 5-0",
    category: "supply",
    quantityOnHand: 72,
    reorderPoint: 50,
    locationName: "Aesthetic Suite"
  },
  {
    id: "inv_003",
    name: "Retina scanner maintenance kit",
    category: "device",
    quantityOnHand: 4,
    reorderPoint: 5,
    locationName: "Vision Center"
  }
];

const notifications: Notification[] = [
  {
    id: "not_001",
    type: "authorization",
    priority: "high",
    title: "Prior auth missing supporting note",
    description: "Procedure proc_002 requires updated SOAP note before submission.",
    createdAt: "2026-03-14T06:20:00Z"
  },
  {
    id: "not_002",
    type: "critical_lab",
    priority: "medium",
    title: "New pathology result expected today",
    description: "Patient pat_004 biopsy expected by 12:00 PM.",
    createdAt: "2026-03-14T05:40:00Z"
  },
  {
    id: "not_003",
    type: "claim",
    priority: "high",
    title: "Claim clm_002 marked action required",
    description: "Payer requested additional procedure documentation.",
    createdAt: "2026-03-14T05:05:00Z"
  }
];

const reportMetrics: ReportMetric[] = [
  {
    id: "mrr",
    label: "MRR",
    value: "$142,900",
    trend: "+8.4% vs last month"
  },
  {
    id: "claim_clean_rate",
    label: "Clean claim rate",
    value: "96.2%",
    trend: "+1.1 pts"
  },
  {
    id: "patient_satisfaction",
    label: "Patient satisfaction",
    value: "4.8 / 5",
    trend: "steady"
  },
  {
    id: "portal_adoption",
    label: "Portal adoption",
    value: "78%",
    trend: "+4.0 pts"
  }
];

const integrations: IntegrationStatus[] = [
  {
    id: "int_001",
    name: "HL7 FHIR Gateway",
    category: "ehr",
    status: "healthy",
    lastSyncAt: "2026-03-14T07:40:00Z"
  },
  {
    id: "int_002",
    name: "Stripe Payments",
    category: "payments",
    status: "healthy",
    lastSyncAt: "2026-03-14T07:35:00Z"
  },
  {
    id: "int_003",
    name: "Twilio Messaging",
    category: "communications",
    status: "degraded",
    lastSyncAt: "2026-03-14T07:10:00Z"
  },
  {
    id: "int_004",
    name: "DICOM Archive",
    category: "imaging",
    status: "healthy",
    lastSyncAt: "2026-03-14T07:30:00Z"
  }
];

const adminRoles: AdminRole[] = [
  {
    id: "role_001",
    role: "Physician",
    users: 12,
    permissions: ["clinical_notes", "prescriptions", "procedures"]
  },
  {
    id: "role_002",
    role: "Billing",
    users: 5,
    permissions: ["claims", "reports", "authorizations"]
  },
  {
    id: "role_003",
    role: "Front Desk",
    users: 8,
    permissions: ["patients", "appointments", "portal_invites"]
  }
];

export function getDashboardSnapshot(): DashboardSnapshot {
  return {
    patients,
    appointments,
    clinicalNotes,
    procedures,
    prescriptions,
    billingClaims,
    medicalImages,
    labResults,
    referrals,
    inventoryItems,
    notifications,
    reportMetrics,
    integrations,
    adminRoles
  };
}

export function getTodayAppointments(): Appointment[] {
  return appointments;
}

export function getOpenTasksCount(): number {
  const unsignedNotes = clinicalNotes.filter((note) => !note.signed).length;
  const pendingAuthorizations = procedures.filter((procedure) => procedure.authorizationStatus === "pending").length;
  const actionClaims = billingClaims.filter((claim) => claim.status === "action_required").length;
  return unsignedNotes + pendingAuthorizations + actionClaims;
}

export function getRevenueCents(): number {
  return billingClaims.reduce((total, claim) => total + claim.amountCents, 0);
}
