create table if not exists public.hc_document_templates (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  specialty text not null check (specialty in ('ophthalmology', 'dermatology', 'plastic_surgery')),
  name text not null,
  template_type text not null check (template_type in ('SOAP', 'procedure', 'assessment')),
  content jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hc_specialty_slot_types (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  specialty text not null check (specialty in ('ophthalmology', 'dermatology', 'plastic_surgery')),
  code text not null,
  name text not null,
  default_minutes integer not null check (default_minutes > 0),
  is_procedure boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (specialty, code)
);

alter table public.hc_appointments
  add column if not exists procedure_id uuid references public.hc_procedures(id) on delete set null;

alter table public.hc_prescriptions
  add column if not exists external_rx_id text,
  add column if not exists sent_at timestamptz,
  add column if not exists interaction_result jsonb not null default '{}'::jsonb;

create index if not exists idx_hc_templates_specialty on public.hc_document_templates(specialty, template_type);
create index if not exists idx_hc_slot_types_specialty on public.hc_specialty_slot_types(specialty, is_active);
create index if not exists idx_hc_appointments_procedure_id on public.hc_appointments(procedure_id);

insert into public.hc_document_templates (id, owner_user_id, specialty, name, template_type, content, is_active)
values
  (
    '90000000-0000-0000-0000-000000000001',
    null,
    'dermatology',
    'Dermatology SOAP Follow-up',
    'SOAP',
    '{
      "sections": [
        {"key":"subjective","label":"Subjective","prompt":"Symptoms, changes since last visit, patient concerns"},
        {"key":"objective","label":"Objective","prompt":"Lesion size/color/border, dermoscopy findings"},
        {"key":"assessment","label":"Assessment","prompt":"Primary and differential diagnoses with ICD-10"},
        {"key":"plan","label":"Plan","prompt":"Topicals/procedures/follow-up interval, red-flag counseling"}
      ]
    }'::jsonb,
    true
  ),
  (
    '90000000-0000-0000-0000-000000000002',
    null,
    'ophthalmology',
    'Ophthalmology Assessment Template',
    'assessment',
    '{
      "sections": [
        {"key":"history","label":"History","prompt":"Visual symptoms, duration, prior ocular history"},
        {"key":"exam","label":"Exam","prompt":"Visual acuity, IOP, slit-lamp/fundus findings"},
        {"key":"impression","label":"Impression","prompt":"Clinical impression and risk stratification"},
        {"key":"next_steps","label":"Next Steps","prompt":"Treatment or referral with follow-up timing"}
      ]
    }'::jsonb,
    true
  ),
  (
    '90000000-0000-0000-0000-000000000003',
    null,
    'plastic_surgery',
    'Plastic Surgery Procedure Documentation',
    'procedure',
    '{
      "sections": [
        {"key":"indication","label":"Indication","prompt":"Procedure indication and patient goals"},
        {"key":"preop","label":"Pre-op","prompt":"Consent, markings, anesthesia plan"},
        {"key":"intraop","label":"Intra-op","prompt":"Technique, materials, duration, findings"},
        {"key":"postop","label":"Post-op","prompt":"Recovery instructions and complication watch-outs"}
      ]
    }'::jsonb,
    true
  )
on conflict (id) do nothing;

insert into public.hc_specialty_slot_types (id, owner_user_id, specialty, code, name, default_minutes, is_procedure, is_active)
values
  ('91000000-0000-0000-0000-000000000001', null, 'dermatology', 'DERM_FUP', 'Derm Follow-up', 20, false, true),
  ('91000000-0000-0000-0000-000000000002', null, 'dermatology', 'DERM_PROC', 'Derm Procedure Slot', 40, true, true),
  ('91000000-0000-0000-0000-000000000003', null, 'ophthalmology', 'OPH_EXAM', 'Ophthalmology Exam', 30, false, true),
  ('91000000-0000-0000-0000-000000000004', null, 'plastic_surgery', 'PS_CONSULT', 'Plastic Surgery Consult', 45, false, true)
on conflict (id) do nothing;

do $$
declare
  tbl text;
  tables text[] := array[
    'hc_locations',
    'hc_staff',
    'hc_providers',
    'hc_patients',
    'hc_schedules',
    'hc_appointments',
    'hc_clinical_notes',
    'hc_diagnoses',
    'hc_treatments',
    'hc_procedures',
    'hc_prescriptions',
    'hc_insurances',
    'hc_billings',
    'hc_medical_images',
    'hc_lab_results',
    'hc_consents',
    'hc_referrals',
    'hc_equipment',
    'hc_inventory',
    'hc_notifications',
    'hc_audits',
    'hc_reports',
    'hc_document_templates',
    'hc_specialty_slot_types'
  ];
begin
  foreach tbl in array tables loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format(
      'create policy %I_select on public.%I for select using (owner_user_id is null or owner_user_id = auth.uid())',
      tbl,
      tbl
    );
    execute format('drop policy if exists %I_write on public.%I', tbl, tbl);
    execute format(
      'create policy %I_write on public.%I for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid())',
      tbl,
      tbl
    );
  end loop;
end $$;
