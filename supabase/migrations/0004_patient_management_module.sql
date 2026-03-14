alter table public.ehr_patients
  add column if not exists gender text,
  add column if not exists address_line1 text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists postal_code text,
  add column if not exists insurance_member_id text,
  add column if not exists insurance_group_number text,
  add column if not exists insurance_policy_holder text;

create table if not exists public.ehr_patient_medical_history (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  condition text not null,
  notes text,
  diagnosed_at date,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_patient_allergies (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  allergen text not null,
  reaction text,
  severity text not null default 'moderate',
  created_at timestamptz not null default now(),
  constraint ehr_patient_allergies_severity_check check (severity in ('mild', 'moderate', 'severe'))
);

create table if not exists public.ehr_patient_emergency_contacts (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  name text not null,
  relationship text,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ehr_patient_visits (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null references public.ehr_patients(id) on delete cascade,
  visit_date timestamptz not null,
  provider_name text not null,
  visit_type text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_ehr_patient_history_patient_id on public.ehr_patient_medical_history(patient_id);
create index if not exists idx_ehr_patient_allergies_patient_id on public.ehr_patient_allergies(patient_id);
create index if not exists idx_ehr_patient_contacts_patient_id on public.ehr_patient_emergency_contacts(patient_id);
create index if not exists idx_ehr_patient_visits_patient_id on public.ehr_patient_visits(patient_id);
create index if not exists idx_ehr_patient_visits_date on public.ehr_patient_visits(visit_date desc);

alter table public.ehr_patient_medical_history enable row level security;
alter table public.ehr_patient_allergies enable row level security;
alter table public.ehr_patient_emergency_contacts enable row level security;
alter table public.ehr_patient_visits enable row level security;

drop policy if exists "ehr_patient_history_select" on public.ehr_patient_medical_history;
create policy "ehr_patient_history_select" on public.ehr_patient_medical_history for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_patient_history_write" on public.ehr_patient_medical_history;
create policy "ehr_patient_history_write" on public.ehr_patient_medical_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_patient_allergies_select" on public.ehr_patient_allergies;
create policy "ehr_patient_allergies_select" on public.ehr_patient_allergies for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_patient_allergies_write" on public.ehr_patient_allergies;
create policy "ehr_patient_allergies_write" on public.ehr_patient_allergies for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_patient_contacts_select" on public.ehr_patient_emergency_contacts;
create policy "ehr_patient_contacts_select" on public.ehr_patient_emergency_contacts for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_patient_contacts_write" on public.ehr_patient_emergency_contacts;
create policy "ehr_patient_contacts_write" on public.ehr_patient_emergency_contacts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ehr_patient_visits_select" on public.ehr_patient_visits;
create policy "ehr_patient_visits_select" on public.ehr_patient_visits for select using (auth.uid() = user_id or user_id is null);
drop policy if exists "ehr_patient_visits_write" on public.ehr_patient_visits;
create policy "ehr_patient_visits_write" on public.ehr_patient_visits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

update public.ehr_patients
set gender = coalesce(gender, 'Not specified'),
    address_line1 = coalesce(address_line1, 'Address unavailable'),
    city = coalesce(city, 'San Francisco'),
    state = coalesce(state, 'CA'),
    postal_code = coalesce(postal_code, '94107'),
    insurance_member_id = coalesce(insurance_member_id, concat('MBR-', upper(replace(id, 'pat_', '')))),
    insurance_group_number = coalesce(insurance_group_number, 'GRP-100'),
    insurance_policy_holder = coalesce(insurance_policy_holder, full_name)
where user_id is null;

insert into public.ehr_patient_medical_history (user_id, patient_id, condition, notes, diagnosed_at)
values
  (null, 'pat_001', 'Atopic dermatitis', 'Flare-ups seasonally, controlled with topical steroid.', '2019-06-11'),
  (null, 'pat_004', 'Suspicious nevus history', 'Requires serial dermoscopy imaging every 6 months.', '2021-02-14')
on conflict do nothing;

insert into public.ehr_patient_allergies (user_id, patient_id, allergen, reaction, severity)
values
  (null, 'pat_001', 'Penicillin', 'Rash', 'moderate'),
  (null, 'pat_004', 'Latex', 'Contact dermatitis', 'mild')
on conflict do nothing;

insert into public.ehr_patient_emergency_contacts (user_id, patient_id, name, relationship, phone)
values
  (null, 'pat_001', 'Evan Carson', 'Spouse', '+1-555-2010'),
  (null, 'pat_004', 'Rita Emerson', 'Sister', '+1-555-2044')
on conflict do nothing;

insert into public.ehr_patient_visits (id, user_id, patient_id, visit_date, provider_name, visit_type, summary)
values
  ('visit_001', null, 'pat_001', '2026-02-08T14:30:00Z', 'Dr. Rivera', 'Dermatitis follow-up', 'Symptoms improved. Continue clobetasol BID for 14 days.'),
  ('visit_002', null, 'pat_001', '2026-01-06T11:20:00Z', 'Dr. Rivera', 'Initial lesion evaluation', 'Baseline dermoscopy captured and treatment plan initiated.'),
  ('visit_003', null, 'pat_004', '2026-02-19T09:10:00Z', 'Dr. Rivera', 'Biopsy planning', 'Discussed excision approach and post-op wound care instructions.')
on conflict (id) do nothing;
