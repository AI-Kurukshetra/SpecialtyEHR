create extension if not exists pgcrypto;

do $$
begin
  create type public.hc_gender as enum ('male', 'female', 'other', 'unknown');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.hc_appointment_status as enum ('scheduled', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.hc_note_status as enum ('draft', 'signed', 'amended');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.hc_procedure_status as enum ('planned', 'authorized', 'in_progress', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.hc_billing_status as enum ('draft', 'submitted', 'paid', 'denied', 'void', 'refunded');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.hc_notification_priority as enum ('low', 'medium', 'high', 'critical');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.hc_locations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  code text unique,
  name text not null,
  type text not null default 'clinic',
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  timezone text not null default 'UTC',
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_staff (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  employee_code text unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  role text not null,
  department text,
  license_number text,
  hire_date date,
  status text not null default 'active',
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email)
);

create table if not exists public.hc_providers (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  staff_id uuid not null references public.hc_staff(id) on delete cascade,
  primary_location_id uuid references public.hc_locations(id) on delete set null,
  npi text unique,
  specialty text not null,
  sub_specialty text,
  qualifications text[] not null default '{}',
  years_experience integer,
  accepting_new_patients boolean not null default true,
  consultation_fee_cents integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (staff_id)
);

create table if not exists public.hc_patients (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  mrn text unique,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  gender public.hc_gender not null default 'unknown',
  email text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  blood_group text,
  marital_status text,
  preferred_language text,
  emergency_contact_name text,
  emergency_contact_phone text,
  primary_provider_id uuid references public.hc_providers(id) on delete set null,
  preferred_location_id uuid references public.hc_locations(id) on delete set null,
  is_active boolean not null default true,
  deceased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_schedules (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  provider_id uuid references public.hc_providers(id) on delete cascade,
  staff_id uuid references public.hc_staff(id) on delete cascade,
  location_id uuid references public.hc_locations(id) on delete set null,
  name text not null,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes integer not null default 15,
  is_active boolean not null default true,
  effective_from date,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((provider_id is not null) or (staff_id is not null)),
  check (start_time < end_time)
);

create table if not exists public.hc_appointments (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  provider_id uuid not null references public.hc_providers(id) on delete restrict,
  location_id uuid references public.hc_locations(id) on delete set null,
  schedule_id uuid references public.hc_schedules(id) on delete set null,
  appointment_type text not null,
  visit_reason text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.hc_appointment_status not null default 'scheduled',
  check_in_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  booked_via text default 'staff',
  notes text,
  created_by_staff_id uuid references public.hc_staff(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

create table if not exists public.hc_clinical_notes (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  provider_id uuid references public.hc_providers(id) on delete set null,
  authored_by_staff_id uuid references public.hc_staff(id) on delete set null,
  note_type text not null default 'SOAP',
  subjective text,
  objective text,
  assessment text,
  plan text,
  status public.hc_note_status not null default 'draft',
  signed_at timestamptz,
  signed_by_staff_id uuid references public.hc_staff(id) on delete set null,
  version integer not null default 1,
  tags text[] not null default '{}',
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_diagnoses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  clinical_note_id uuid references public.hc_clinical_notes(id) on delete set null,
  provider_id uuid references public.hc_providers(id) on delete set null,
  icd10_code text not null,
  diagnosis_name text not null,
  diagnosis_type text not null default 'primary',
  severity text,
  onset_date date,
  resolved_date date,
  is_chronic boolean not null default false,
  status text not null default 'active',
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_treatments (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  diagnosis_id uuid references public.hc_diagnoses(id) on delete set null,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  provider_id uuid references public.hc_providers(id) on delete set null,
  treatment_name text not null,
  treatment_type text not null,
  description text,
  goal text,
  start_date date,
  end_date date,
  frequency text,
  status text not null default 'planned',
  outcome text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_procedures (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  treatment_id uuid references public.hc_treatments(id) on delete set null,
  provider_id uuid references public.hc_providers(id) on delete set null,
  procedure_code text,
  procedure_name text not null,
  category text,
  status public.hc_procedure_status not null default 'planned',
  authorization_required boolean not null default false,
  authorization_reference text,
  scheduled_at timestamptz,
  performed_at timestamptz,
  duration_minutes integer,
  theatre_or_room text,
  anesthesia_type text,
  findings text,
  complications text,
  follow_up_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_prescriptions (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  diagnosis_id uuid references public.hc_diagnoses(id) on delete set null,
  provider_id uuid not null references public.hc_providers(id) on delete restrict,
  medication_name text not null,
  generic_name text,
  dosage text not null,
  route text,
  frequency text not null,
  duration text,
  quantity text,
  refills integer not null default 0,
  start_date date,
  end_date date,
  instructions text,
  interaction_checked boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_insurances (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  payer_name text not null,
  plan_name text,
  member_id text not null,
  group_number text,
  policy_holder_name text,
  policy_holder_dob date,
  relation_to_patient text,
  coverage_start date,
  coverage_end date,
  copay_cents integer,
  deductible_cents integer,
  out_of_pocket_max_cents integer,
  verification_status text not null default 'unverified',
  verified_at timestamptz,
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_billings (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  procedure_id uuid references public.hc_procedures(id) on delete set null,
  insurance_id uuid references public.hc_insurances(id) on delete set null,
  invoice_number text unique,
  claim_number text,
  cpt_code text,
  icd10_code text,
  amount_cents integer not null,
  tax_cents integer not null default 0,
  discount_cents integer not null default 0,
  patient_payable_cents integer,
  insurance_payable_cents integer,
  paid_cents integer not null default 0,
  currency text not null default 'USD',
  status public.hc_billing_status not null default 'draft',
  due_date date,
  submitted_at timestamptz,
  paid_at timestamptz,
  payment_method text,
  denial_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_medical_images (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  procedure_id uuid references public.hc_procedures(id) on delete set null,
  provider_id uuid references public.hc_providers(id) on delete set null,
  modality text not null,
  body_site text,
  captured_at timestamptz not null,
  storage_bucket text,
  storage_path text,
  file_name text,
  mime_type text,
  file_size_bytes bigint,
  hash_sha256 text,
  interpretation text,
  ai_summary text,
  status text not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_lab_results (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  ordering_provider_id uuid references public.hc_providers(id) on delete set null,
  reviewing_provider_id uuid references public.hc_providers(id) on delete set null,
  lab_name text,
  loinc_code text,
  test_name text not null,
  specimen_type text,
  collected_at timestamptz,
  resulted_at timestamptz,
  status text not null default 'ordered',
  value_text text,
  value_numeric numeric(12,4),
  unit text,
  reference_range text,
  interpretation text,
  abnormal_flag text,
  report_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_consents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  procedure_id uuid references public.hc_procedures(id) on delete set null,
  treatment_id uuid references public.hc_treatments(id) on delete set null,
  provider_id uuid references public.hc_providers(id) on delete set null,
  consent_type text not null,
  document_title text not null,
  document_version text,
  language text default 'en',
  consent_status text not null default 'pending',
  signed_by text,
  signed_relationship text,
  signed_at timestamptz,
  witness_staff_id uuid references public.hc_staff(id) on delete set null,
  revoked_at timestamptz,
  revocation_reason text,
  document_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_referrals (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  patient_id uuid not null references public.hc_patients(id) on delete cascade,
  from_provider_id uuid references public.hc_providers(id) on delete set null,
  to_provider_id uuid references public.hc_providers(id) on delete set null,
  referred_facility text,
  referral_type text not null default 'outbound',
  priority text not null default 'routine',
  reason text not null,
  clinical_summary text,
  status text not null default 'pending',
  referred_at timestamptz not null default now(),
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_equipment (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  location_id uuid references public.hc_locations(id) on delete set null,
  equipment_code text unique,
  name text not null,
  category text not null,
  manufacturer text,
  model text,
  serial_number text,
  purchase_date date,
  warranty_expires_on date,
  calibration_due_on date,
  maintenance_due_on date,
  status text not null default 'active',
  assigned_to_staff_id uuid references public.hc_staff(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_inventory (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  equipment_id uuid references public.hc_equipment(id) on delete set null,
  location_id uuid references public.hc_locations(id) on delete set null,
  item_code text unique,
  item_name text not null,
  item_type text not null default 'consumable',
  unit text not null default 'each',
  quantity_on_hand numeric(12,2) not null default 0,
  reorder_level numeric(12,2) not null default 0,
  reorder_quantity numeric(12,2),
  lot_number text,
  expiry_date date,
  vendor_name text,
  unit_cost_cents integer,
  status text not null default 'active',
  last_stocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_notifications (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  recipient_staff_id uuid references public.hc_staff(id) on delete set null,
  patient_id uuid references public.hc_patients(id) on delete set null,
  appointment_id uuid references public.hc_appointments(id) on delete set null,
  channel text not null default 'in_app',
  type text not null,
  priority public.hc_notification_priority not null default 'medium',
  title text not null,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  read_at timestamptz,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.hc_audits (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  actor_staff_id uuid references public.hc_staff(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  table_name text,
  ip_address inet,
  user_agent text,
  request_id text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.hc_reports (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  generated_by_staff_id uuid references public.hc_staff(id) on delete set null,
  report_name text not null,
  report_type text not null,
  period_start date,
  period_end date,
  filters jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  generated_at timestamptz,
  file_format text default 'pdf',
  file_path text,
  checksum text,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hc_locations_owner on public.hc_locations(owner_user_id);
create index if not exists idx_hc_staff_owner on public.hc_staff(owner_user_id);
create index if not exists idx_hc_providers_owner on public.hc_providers(owner_user_id);
create index if not exists idx_hc_patients_owner on public.hc_patients(owner_user_id);
create index if not exists idx_hc_patients_provider on public.hc_patients(primary_provider_id);
create index if not exists idx_hc_schedules_provider on public.hc_schedules(provider_id);
create index if not exists idx_hc_appointments_patient on public.hc_appointments(patient_id);
create index if not exists idx_hc_appointments_provider on public.hc_appointments(provider_id);
create index if not exists idx_hc_appointments_starts_at on public.hc_appointments(starts_at);
create index if not exists idx_hc_clinical_notes_patient on public.hc_clinical_notes(patient_id);
create index if not exists idx_hc_diagnoses_patient on public.hc_diagnoses(patient_id);
create index if not exists idx_hc_treatments_patient on public.hc_treatments(patient_id);
create index if not exists idx_hc_procedures_patient on public.hc_procedures(patient_id);
create index if not exists idx_hc_prescriptions_patient on public.hc_prescriptions(patient_id);
create index if not exists idx_hc_insurances_patient on public.hc_insurances(patient_id);
create index if not exists idx_hc_billings_patient on public.hc_billings(patient_id);
create index if not exists idx_hc_billings_status on public.hc_billings(status);
create index if not exists idx_hc_medical_images_patient on public.hc_medical_images(patient_id);
create index if not exists idx_hc_lab_results_patient on public.hc_lab_results(patient_id);
create index if not exists idx_hc_consents_patient on public.hc_consents(patient_id);
create index if not exists idx_hc_referrals_patient on public.hc_referrals(patient_id);
create index if not exists idx_hc_equipment_location on public.hc_equipment(location_id);
create index if not exists idx_hc_inventory_location on public.hc_inventory(location_id);
create index if not exists idx_hc_notifications_recipient on public.hc_notifications(recipient_staff_id);
create index if not exists idx_hc_notifications_created_at on public.hc_notifications(created_at desc);
create index if not exists idx_hc_audits_entity on public.hc_audits(entity_type, entity_id);
create index if not exists idx_hc_reports_type on public.hc_reports(report_type);
