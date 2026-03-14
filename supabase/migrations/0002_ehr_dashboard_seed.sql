-- Core specialty EHR tables + realistic demo seed data

create table if not exists public.ehr_patients (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  specialty text not null,
  date_of_birth date not null,
  phone text,
  email text,
  insurance_provider text,
  insurance_verified boolean not null default false,
  risk_flags text[] not null default '{}',
  portal_enabled boolean not null default true,
  last_visit_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_appointments (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  provider_name text not null,
  location_name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  visit_type text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_clinical_notes (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  author text not null,
  soap_summary text not null,
  diagnosis_codes text[] not null default '{}',
  signed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_procedures (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  name text not null,
  cpt_code text not null,
  status text not null,
  consent_signed boolean not null default false,
  authorization_status text not null,
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_prescriptions (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  medication text not null,
  dose text not null,
  interactions_checked boolean not null default true,
  prescribed_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_billing_claims (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  procedure_id text references public.ehr_procedures(id),
  amount_cents integer not null,
  payer text not null,
  status text not null,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_medical_images (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  modality text not null,
  captured_at timestamptz not null,
  body_site text,
  progression_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_lab_results (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  test_name text not null,
  status text not null,
  resulted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_referrals (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  referred_to text not null,
  reason text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_inventory_items (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  quantity_on_hand integer not null,
  reorder_point integer not null,
  location_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_notifications (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  priority text not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_report_metrics (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  label text not null,
  value text not null,
  trend text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_integrations (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  status text not null,
  last_sync_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_admin_roles (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null,
  users integer not null,
  permissions text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_ehr_patients_user_id on public.ehr_patients(user_id);
create index if not exists idx_ehr_appointments_user_id on public.ehr_appointments(user_id);
create index if not exists idx_ehr_appointments_start on public.ehr_appointments(starts_at);
create index if not exists idx_ehr_claims_status on public.ehr_billing_claims(status);

alter table public.ehr_patients enable row level security;
alter table public.ehr_appointments enable row level security;
alter table public.ehr_clinical_notes enable row level security;
alter table public.ehr_procedures enable row level security;
alter table public.ehr_prescriptions enable row level security;
alter table public.ehr_billing_claims enable row level security;
alter table public.ehr_medical_images enable row level security;
alter table public.ehr_lab_results enable row level security;
alter table public.ehr_referrals enable row level security;
alter table public.ehr_inventory_items enable row level security;
alter table public.ehr_notifications enable row level security;
alter table public.ehr_report_metrics enable row level security;
alter table public.ehr_integrations enable row level security;
alter table public.ehr_admin_roles enable row level security;

drop policy if exists "ehr_patients_select" on public.ehr_patients;
create policy "ehr_patients_select" on public.ehr_patients for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_patients_write" on public.ehr_patients;
create policy "ehr_patients_write" on public.ehr_patients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_appointments_select" on public.ehr_appointments;
create policy "ehr_appointments_select" on public.ehr_appointments for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_appointments_write" on public.ehr_appointments;
create policy "ehr_appointments_write" on public.ehr_appointments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_clinical_notes_select" on public.ehr_clinical_notes;
create policy "ehr_clinical_notes_select" on public.ehr_clinical_notes for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_clinical_notes_write" on public.ehr_clinical_notes;
create policy "ehr_clinical_notes_write" on public.ehr_clinical_notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_procedures_select" on public.ehr_procedures;
create policy "ehr_procedures_select" on public.ehr_procedures for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_procedures_write" on public.ehr_procedures;
create policy "ehr_procedures_write" on public.ehr_procedures for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_prescriptions_select" on public.ehr_prescriptions;
create policy "ehr_prescriptions_select" on public.ehr_prescriptions for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_prescriptions_write" on public.ehr_prescriptions;
create policy "ehr_prescriptions_write" on public.ehr_prescriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_billing_claims_select" on public.ehr_billing_claims;
create policy "ehr_billing_claims_select" on public.ehr_billing_claims for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_billing_claims_write" on public.ehr_billing_claims;
create policy "ehr_billing_claims_write" on public.ehr_billing_claims for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_medical_images_select" on public.ehr_medical_images;
create policy "ehr_medical_images_select" on public.ehr_medical_images for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_medical_images_write" on public.ehr_medical_images;
create policy "ehr_medical_images_write" on public.ehr_medical_images for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_lab_results_select" on public.ehr_lab_results;
create policy "ehr_lab_results_select" on public.ehr_lab_results for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_lab_results_write" on public.ehr_lab_results;
create policy "ehr_lab_results_write" on public.ehr_lab_results for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_referrals_select" on public.ehr_referrals;
create policy "ehr_referrals_select" on public.ehr_referrals for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_referrals_write" on public.ehr_referrals;
create policy "ehr_referrals_write" on public.ehr_referrals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_inventory_items_select" on public.ehr_inventory_items;
create policy "ehr_inventory_items_select" on public.ehr_inventory_items for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_inventory_items_write" on public.ehr_inventory_items;
create policy "ehr_inventory_items_write" on public.ehr_inventory_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_notifications_select" on public.ehr_notifications;
create policy "ehr_notifications_select" on public.ehr_notifications for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_notifications_write" on public.ehr_notifications;
create policy "ehr_notifications_write" on public.ehr_notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_report_metrics_select" on public.ehr_report_metrics;
create policy "ehr_report_metrics_select" on public.ehr_report_metrics for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_report_metrics_write" on public.ehr_report_metrics;
create policy "ehr_report_metrics_write" on public.ehr_report_metrics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_integrations_select" on public.ehr_integrations;
create policy "ehr_integrations_select" on public.ehr_integrations for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_integrations_write" on public.ehr_integrations;
create policy "ehr_integrations_write" on public.ehr_integrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_admin_roles_select" on public.ehr_admin_roles;
create policy "ehr_admin_roles_select" on public.ehr_admin_roles for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_admin_roles_write" on public.ehr_admin_roles;
create policy "ehr_admin_roles_write" on public.ehr_admin_roles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.ehr_patients (id, user_id, full_name, specialty, date_of_birth, phone, email, insurance_provider, insurance_verified, risk_flags, portal_enabled, last_visit_at)
values
  ('pat_001', null, 'Maya Carson', 'dermatology', '1988-06-14', '+1-555-0101', 'maya.carson@example.com', 'Blue Cross', true, '{high_risk_lesion}', true, '2026-03-12T10:30:00Z'),
  ('pat_002', null, 'Andre Bennett', 'ophthalmology', '1962-01-03', '+1-555-0102', 'andre.bennett@example.com', 'Aetna', true, '{diabetic_retinopathy_screening}', true, '2026-03-10T14:00:00Z'),
  ('pat_003', null, 'Lena Hart', 'plastic_surgery', '1991-09-21', '+1-555-0103', 'lena.hart@example.com', 'UnitedHealthcare', false, '{}', true, '2026-03-08T09:15:00Z'),
  ('pat_004', null, 'Noah Emerson', 'dermatology', '1977-11-30', '+1-555-0104', 'noah.emerson@example.com', 'Cigna', true, '{prior_authorization_required}', false, '2026-03-11T16:45:00Z')
on conflict (id) do nothing;

insert into public.ehr_appointments (id, user_id, patient_id, provider_name, location_name, starts_at, ends_at, visit_type, status)
values
  ('apt_001', null, 'pat_001', 'Dr. Rivera', 'Downtown Clinic', '2026-03-14T09:00:00Z', '2026-03-14T09:30:00Z', 'Lesion follow-up', 'checked_in'),
  ('apt_002', null, 'pat_002', 'Dr. Kline', 'Vision Center', '2026-03-14T10:15:00Z', '2026-03-14T10:45:00Z', 'Retina screening', 'scheduled'),
  ('apt_003', null, 'pat_003', 'Dr. Song', 'Aesthetic Suite', '2026-03-14T13:00:00Z', '2026-03-14T14:00:00Z', 'Pre-op planning', 'scheduled'),
  ('apt_004', null, 'pat_004', 'Dr. Rivera', 'Downtown Clinic', '2026-03-14T15:00:00Z', '2026-03-14T15:20:00Z', 'Biopsy review', 'in_progress')
on conflict (id) do nothing;

insert into public.ehr_clinical_notes (id, user_id, patient_id, author, soap_summary, diagnosis_codes, signed, created_at)
values
  ('note_001', null, 'pat_001', 'Dr. Rivera', 'Lesion dimensions stable. Continue topical regimen.', '{L81.4}', true, '2026-03-12T11:00:00Z'),
  ('note_002', null, 'pat_002', 'Dr. Kline', 'Mild progression in right-eye edema. OCT ordered.', '{E11.311}', false, '2026-03-13T15:40:00Z')
on conflict (id) do nothing;

insert into public.ehr_procedures (id, user_id, patient_id, name, cpt_code, status, consent_signed, authorization_status, scheduled_at)
values
  ('proc_001', null, 'pat_003', 'Rhinoplasty consult + simulation', '30400', 'ready', true, 'approved', '2026-03-18T10:00:00Z'),
  ('proc_002', null, 'pat_004', 'Excision with pathology', '11402', 'planned', false, 'pending', '2026-03-16T08:30:00Z')
on conflict (id) do nothing;

insert into public.ehr_prescriptions (id, user_id, patient_id, medication, dose, interactions_checked, prescribed_by, created_at)
values
  ('rx_001', null, 'pat_001', 'Clobetasol 0.05%', 'BID for 14 days', true, 'Dr. Rivera', '2026-03-12T11:20:00Z'),
  ('rx_002', null, 'pat_002', 'Prednisolone acetate', 'QID right eye', true, 'Dr. Kline', '2026-03-13T16:00:00Z')
on conflict (id) do nothing;

insert into public.ehr_billing_claims (id, user_id, patient_id, procedure_id, amount_cents, payer, status, submitted_at)
values
  ('clm_001', null, 'pat_001', 'proc_002', 44500, 'Blue Cross', 'submitted', '2026-03-13T18:00:00Z'),
  ('clm_002', null, 'pat_002', 'proc_001', 119900, 'Aetna', 'action_required', '2026-03-13T18:10:00Z')
on conflict (id) do nothing;

insert into public.ehr_medical_images (id, user_id, patient_id, modality, captured_at, body_site, progression_note)
values
  ('img_001', null, 'pat_001', 'dermoscopy', '2026-03-12T10:50:00Z', 'Left forearm', 'No increase in pigmentation spread'),
  ('img_002', null, 'pat_002', 'oct', '2026-03-13T15:20:00Z', 'Right retina', 'Slightly increased edema thickness'),
  ('img_003', null, 'pat_003', 'photo', '2026-03-10T09:15:00Z', 'Nasal profile', 'Baseline before/after set created')
on conflict (id) do nothing;

insert into public.ehr_lab_results (id, user_id, patient_id, test_name, status, resulted_at)
values
  ('lab_001', null, 'pat_004', 'Dermatopathology biopsy', 'pending', '2026-03-15T12:00:00Z'),
  ('lab_002', null, 'pat_002', 'HbA1c', 'reviewed', '2026-03-11T08:20:00Z')
on conflict (id) do nothing;

insert into public.ehr_referrals (id, user_id, patient_id, referred_to, reason, status, created_at)
values
  ('ref_001', null, 'pat_001', 'Oncology Dermatology Group', 'Second opinion for atypical lesion', 'pending', '2026-03-13T12:30:00Z'),
  ('ref_002', null, 'pat_002', 'Endocrinology Partners', 'Glycemic management for retina outcomes', 'accepted', '2026-03-12T14:00:00Z')
on conflict (id) do nothing;

insert into public.ehr_inventory_items (id, user_id, name, category, quantity_on_hand, reorder_point, location_name)
values
  ('inv_001', null, 'Lidocaine 1%', 'medication', 18, 20, 'Downtown Clinic'),
  ('inv_002', null, 'Surgical sutures 5-0', 'supply', 72, 50, 'Aesthetic Suite'),
  ('inv_003', null, 'Retina scanner maintenance kit', 'device', 4, 5, 'Vision Center')
on conflict (id) do nothing;

insert into public.ehr_notifications (id, user_id, type, priority, title, description, created_at)
values
  ('not_001', null, 'authorization', 'high', 'Prior auth missing supporting note', 'Procedure proc_002 requires updated SOAP note before submission.', '2026-03-14T06:20:00Z'),
  ('not_002', null, 'critical_lab', 'medium', 'New pathology result expected today', 'Patient pat_004 biopsy expected by 12:00 PM.', '2026-03-14T05:40:00Z'),
  ('not_003', null, 'claim', 'high', 'Claim clm_002 marked action required', 'Payer requested additional procedure documentation.', '2026-03-14T05:05:00Z')
on conflict (id) do nothing;

insert into public.ehr_report_metrics (id, user_id, label, value, trend)
values
  ('mrr', null, 'MRR', '$142,900', '+8.4% vs last month'),
  ('claim_clean_rate', null, 'Clean claim rate', '96.2%', '+1.1 pts'),
  ('patient_satisfaction', null, 'Patient satisfaction', '4.8 / 5', 'steady'),
  ('portal_adoption', null, 'Portal adoption', '78%', '+4.0 pts')
on conflict (id) do nothing;

insert into public.ehr_integrations (id, user_id, name, category, status, last_sync_at)
values
  ('int_001', null, 'HL7 FHIR Gateway', 'ehr', 'healthy', '2026-03-14T07:40:00Z'),
  ('int_002', null, 'Stripe Payments', 'payments', 'healthy', '2026-03-14T07:35:00Z'),
  ('int_003', null, 'Twilio Messaging', 'communications', 'degraded', '2026-03-14T07:10:00Z'),
  ('int_004', null, 'DICOM Archive', 'imaging', 'healthy', '2026-03-14T07:30:00Z')
on conflict (id) do nothing;

insert into public.ehr_admin_roles (id, user_id, role, users, permissions)
values
  ('role_001', null, 'Physician', 12, '{clinical_notes,prescriptions,procedures}'),
  ('role_002', null, 'Billing', 5, '{claims,reports,authorizations}'),
  ('role_003', null, 'Front Desk', 8, '{patients,appointments,portal_invites}')
on conflict (id) do nothing;
