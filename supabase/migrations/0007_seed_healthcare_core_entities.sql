-- Realistic demo seed data for hc_* core entities

insert into public.hc_locations (
  id, code, name, type, address_line1, city, state, postal_code, country, timezone, phone, email, is_active
)
values
  ('10000000-0000-0000-0000-000000000001', 'AUS-NORTH', 'Austin North Clinic', 'clinic', '1204 W Medical Pkwy', 'Austin', 'TX', '78757', 'US', 'America/Chicago', '+1-512-555-0101', 'austin-north@aurorahealth.com', true),
  ('10000000-0000-0000-0000-000000000002', 'DAL-CENTRAL', 'Dallas Central Clinic', 'clinic', '2808 Cedar Ave', 'Dallas', 'TX', '75201', 'US', 'America/Chicago', '+1-214-555-0102', 'dallas-central@aurorahealth.com', true),
  ('10000000-0000-0000-0000-000000000003', 'HOU-HEIGHTS', 'Houston Heights Clinic', 'clinic', '950 Riverline St', 'Houston', 'TX', '77008', 'US', 'America/Chicago', '+1-713-555-0103', 'houston-heights@aurorahealth.com', true)
on conflict (id) do nothing;

insert into public.hc_staff (
  id, employee_code, first_name, last_name, email, phone, role, department, license_number, hire_date, status, emergency_contact_name, emergency_contact_phone
)
values
  ('20000000-0000-0000-0000-000000000001', 'EMP-001', 'Olivia', 'Brooks', 'olivia.brooks@aurorahealth.com', '+1-512-555-1001', 'clinic_admin', 'Operations', null, '2021-03-15', 'active', 'Evan Brooks', '+1-512-555-9001'),
  ('20000000-0000-0000-0000-000000000002', 'EMP-002', 'Amelia', 'Rivera', 'amelia.rivera@aurorahealth.com', '+1-512-555-1002', 'physician', 'Dermatology', 'TX-MD-77412', '2018-07-10', 'active', 'Liam Rivera', '+1-512-555-9002'),
  ('20000000-0000-0000-0000-000000000003', 'EMP-003', 'Noah', 'Kim', 'noah.kim@aurorahealth.com', '+1-214-555-1003', 'clinic_manager', 'Operations', null, '2022-01-09', 'active', 'Mia Kim', '+1-214-555-9003'),
  ('20000000-0000-0000-0000-000000000004', 'EMP-004', 'Ethan', 'Patel', 'ethan.patel@aurorahealth.com', '+1-713-555-1004', 'billing_lead', 'Revenue Cycle', null, '2020-11-04', 'active', 'Sara Patel', '+1-713-555-9004'),
  ('20000000-0000-0000-0000-000000000005', 'EMP-005', 'Mia', 'Green', 'mia.green@aurorahealth.com', '+1-512-555-1005', 'nurse', 'Clinical', 'TX-RN-91822', '2023-05-22', 'active', 'Leo Green', '+1-512-555-9005')
on conflict (id) do nothing;

insert into public.hc_providers (
  id, staff_id, primary_location_id, npi, specialty, sub_specialty, qualifications, years_experience, accepting_new_patients, consultation_fee_cents
)
values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '1760589012', 'dermatology', 'dermoscopy', '{"MD","FAAD"}', 11, true, 18000)
on conflict (id) do nothing;

insert into public.hc_patients (
  id, mrn, first_name, last_name, date_of_birth, gender, email, phone, address_line1, city, state, postal_code, blood_group, marital_status, preferred_language, emergency_contact_name, emergency_contact_phone, primary_provider_id, preferred_location_id, is_active
)
values
  ('40000000-0000-0000-0000-000000000001', 'MRN-10001', 'Maya', 'Carson', '1988-06-14', 'female', 'maya.carson@example.com', '+1-555-0101', '4120 Windsor Rd', 'Austin', 'TX', '78703', 'O+', 'married', 'English', 'Evan Carson', '+1-555-2010', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', true),
  ('40000000-0000-0000-0000-000000000002', 'MRN-10002', 'Noah', 'Emerson', '1977-11-30', 'male', 'noah.emerson@example.com', '+1-555-0104', '9805 Brodie Ln', 'Austin', 'TX', '78748', 'A+', 'married', 'English', 'Rita Emerson', '+1-555-2044', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', true),
  ('40000000-0000-0000-0000-000000000003', 'MRN-10003', 'Lena', 'Hart', '1991-09-21', 'female', 'lena.hart@example.com', '+1-555-0103', '1604 Westlake Dr', 'Austin', 'TX', '78746', 'B+', 'single', 'English', 'Jared Hart', '+1-555-2072', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', true)
on conflict (id) do nothing;

insert into public.hc_schedules (
  id, provider_id, location_id, name, day_of_week, start_time, end_time, slot_minutes, is_active, effective_from
)
values
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Dr Rivera - Weekday Morning', 1, '08:30', '12:30', 20, true, '2026-01-01'),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Dr Rivera - Weekday Afternoon', 3, '13:30', '17:00', 20, true, '2026-01-01')
on conflict (id) do nothing;

insert into public.hc_appointments (
  id, patient_id, provider_id, location_id, schedule_id, appointment_type, visit_reason, starts_at, ends_at, status, check_in_at, booked_via, notes, created_by_staff_id
)
values
  ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'follow_up', 'Pigmented lesion follow-up', '2026-03-14T09:00:00Z', '2026-03-14T09:30:00Z', 'checked_in', '2026-03-14T08:53:00Z', 'staff', 'Patient reports mild itching and no bleeding.', '20000000-0000-0000-0000-000000000005'),
  ('60000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'procedure_review', 'Biopsy results review', '2026-03-14T15:00:00Z', '2026-03-14T15:25:00Z', 'scheduled', null, 'staff', 'Bring pathology report copy.', '20000000-0000-0000-0000-000000000003'),
  ('60000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', null, 'consultation', 'Scar revision planning consult', '2026-03-18T13:00:00Z', '2026-03-18T13:45:00Z', 'scheduled', null, 'portal', 'Patient uploaded pre-visit photos.', '20000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.hc_clinical_notes (
  id, patient_id, appointment_id, provider_id, authored_by_staff_id, note_type, subjective, objective, assessment, plan, status, signed_at, signed_by_staff_id, version, tags
)
values
  ('70000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'SOAP', 'No pain, occasional itching for 2 days.', '6mm pigmented lesion left forearm, unchanged border.', 'Stable atypical nevus without concerning change.', 'Continue topical regimen, repeat dermoscopy in 6 weeks.', 'signed', '2026-03-14T09:32:00Z', '20000000-0000-0000-0000-000000000002', 1, '{"dermatology","follow-up"}'),
  ('70000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'SOAP', 'Patient anxious about pathology result timeline.', 'Healing biopsy site with no erythema or drainage.', 'Post-procedure recovery appropriate.', 'Await final pathology; review in visit today.', 'draft', null, null, 1, '{"biopsy","post-op"}')
on conflict (id) do nothing;

insert into public.hc_diagnoses (
  id, patient_id, appointment_id, clinical_note_id, provider_id, icd10_code, diagnosis_name, diagnosis_type, severity, onset_date, is_chronic, status, remarks
)
values
  ('71000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'D22.62', 'Melanocytic nevi of left upper limb', 'primary', 'mild', '2024-11-12', false, 'active', 'Monitor with serial dermoscopy'),
  ('71000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Z98.890', 'Post procedural state', 'primary', 'low', '2026-03-10', false, 'active', 'Biopsy done, pending final report')
on conflict (id) do nothing;

insert into public.hc_treatments (
  id, patient_id, diagnosis_id, appointment_id, provider_id, treatment_name, treatment_type, description, goal, start_date, end_date, frequency, status, outcome
)
values
  ('72000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '71000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Topical anti-inflammatory regimen', 'medication_plan', 'Clobetasol 0.05% for short course during flare.', 'Reduce inflammation and prevent lesion irritation.', '2026-03-14', '2026-03-28', 'BID', 'in_progress', null),
  ('72000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '71000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Wound care protocol', 'post_procedure_care', 'Daily dressing change with topical antibiotic.', 'Promote clean healing and prevent infection.', '2026-03-10', '2026-03-20', 'daily', 'in_progress', null)
on conflict (id) do nothing;

insert into public.hc_procedures (
  id, patient_id, appointment_id, treatment_id, provider_id, procedure_code, procedure_name, category, status, authorization_required, authorization_reference, scheduled_at, performed_at, duration_minutes, theatre_or_room, anesthesia_type, findings, complications, follow_up_instructions
)
values
  ('73000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '72000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '11102', 'Tangential skin biopsy', 'dermatologic_procedure', 'completed', false, null, '2026-03-10T10:00:00Z', '2026-03-10T10:08:00Z', 8, 'Procedure Room 2', 'local', 'Adequate tissue obtained from left forearm lesion.', null, 'Keep site dry 24h; return if redness or drainage.'),
  ('73000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000003', null, '30000000-0000-0000-0000-000000000001', '17999', 'Scar revision consultation planning', 'aesthetic_consult', 'planned', true, 'AUTH-PLN-20260318', '2026-03-18T13:10:00Z', null, null, 'Consult Room 5', null, null, null, 'Pre-op photographs and consent package required.')
on conflict (id) do nothing;

insert into public.hc_prescriptions (
  id, patient_id, appointment_id, diagnosis_id, provider_id, medication_name, generic_name, dosage, route, frequency, duration, quantity, refills, start_date, end_date, instructions, interaction_checked, status
)
values
  ('74000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '71000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Clobetasol 0.05% ointment', 'Clobetasol propionate', 'Apply thin layer', 'topical', 'BID', '14 days', '30 g', 1, '2026-03-14', '2026-03-28', 'Avoid applying on broken skin.', true, 'active'),
  ('74000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '71000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Mupirocin 2% ointment', 'Mupirocin', 'Apply small amount', 'topical', 'TID', '7 days', '22 g', 0, '2026-03-11', '2026-03-18', 'Apply after gentle cleaning.', true, 'active')
on conflict (id) do nothing;

insert into public.hc_insurances (
  id, patient_id, payer_name, plan_name, member_id, group_number, policy_holder_name, policy_holder_dob, relation_to_patient, coverage_start, coverage_end, copay_cents, deductible_cents, out_of_pocket_max_cents, verification_status, verified_at, is_primary
)
values
  ('75000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Blue Cross Blue Shield', 'PPO Gold', 'BCBS-98211377', 'GRP-7712', 'Maya Carson', '1988-06-14', 'self', '2025-01-01', '2026-12-31', 3500, 120000, 450000, 'verified', '2026-03-14T08:20:00Z', true),
  ('75000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'Aetna', 'Open Choice', 'AET-22190345', 'GRP-2301', 'Noah Emerson', '1977-11-30', 'self', '2024-01-01', '2026-12-31', 4000, 150000, 500000, 'verified', '2026-03-10T09:10:00Z', true),
  ('75000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 'UnitedHealthcare', 'Choice Plus', 'UHC-55428091', 'GRP-8820', 'Lena Hart', '1991-09-21', 'self', '2025-06-01', '2026-05-31', 5000, 180000, 600000, 'verified', '2026-03-13T14:00:00Z', true)
on conflict (id) do nothing;

insert into public.hc_billings (
  id, patient_id, appointment_id, procedure_id, insurance_id, invoice_number, claim_number, cpt_code, icd10_code, amount_cents, tax_cents, discount_cents, patient_payable_cents, insurance_payable_cents, paid_cents, currency, status, due_date, submitted_at, paid_at, payment_method, denial_reason
)
values
  ('76000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '73000000-0000-0000-0000-000000000001', '75000000-0000-0000-0000-000000000002', 'INV-2026-0001', 'CLM-2026-7781', '11102', 'Z98.890', 44500, 0, 0, 6500, 38000, 0, 'USD', 'submitted', '2026-03-28', '2026-03-13T18:00:00Z', null, null, null),
  ('76000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', null, '75000000-0000-0000-0000-000000000001', 'INV-2026-0002', null, null, 'D22.62', 18000, 0, 1000, 17000, 0, 17000, 'USD', 'paid', '2026-03-14', null, '2026-03-14T09:40:00Z', 'card', null),
  ('76000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000003', '73000000-0000-0000-0000-000000000002', '75000000-0000-0000-0000-000000000003', 'INV-2026-0003', 'CLM-2026-7819', '17999', null, 119900, 0, 0, 19900, 100000, 0, 'USD', 'denied', '2026-04-01', '2026-03-14T07:30:00Z', null, null, 'Pre-authorization mismatch on planned procedure code')
on conflict (id) do nothing;

insert into public.hc_medical_images (
  id, patient_id, appointment_id, procedure_id, provider_id, modality, body_site, captured_at, storage_bucket, storage_path, file_name, mime_type, file_size_bytes, hash_sha256, interpretation, ai_summary, status
)
values
  ('77000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', null, '30000000-0000-0000-0000-000000000001', 'dermoscopy', 'Left forearm', '2026-03-14T09:10:00Z', 'clinical-images', 'patients/MRN-10001/2026-03-14/derm-01.jpg', 'derm-01.jpg', 'image/jpeg', 2489012, 'a6f4ea342f0f6db6f3a2fd4d0d3be0d476f4b8190f7bf5fe258caed4c7043001', 'No interval growth or irregular border evolution.', 'Stable lesion profile; low short-term progression risk.', 'available'),
  ('77000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '73000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'clinical_photo', 'Left forearm biopsy site', '2026-03-10T10:15:00Z', 'clinical-images', 'patients/MRN-10002/2026-03-10/post-biopsy-01.jpg', 'post-biopsy-01.jpg', 'image/jpeg', 1982201, '9f4b32217d7b9e2f39862fbf5b220ad6f41ff7b2b2b2e3910d4a2a5a90fbbace', 'Clean wound margins; no purulent discharge.', 'Expected healing pattern for post-biopsy day 4.', 'available')
on conflict (id) do nothing;

insert into public.hc_lab_results (
  id, patient_id, appointment_id, ordering_provider_id, reviewing_provider_id, lab_name, loinc_code, test_name, specimen_type, collected_at, resulted_at, status, value_text, value_numeric, unit, reference_range, interpretation, abnormal_flag, report_path
)
values
  ('78000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'DermPath Labs', 'LP36683-8', 'Dermatopathology biopsy', 'tissue', '2026-03-10T10:10:00Z', '2026-03-13T11:45:00Z', 'reviewed', 'Compound melanocytic nevus; no malignancy.', null, null, null, 'Benign histopathology.', 'normal', 'labs/2026/03/MRN-10002-biopsy.pdf'),
  ('78000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', null, 'Quest Diagnostics', '4548-4', 'Hemoglobin A1c', 'blood', '2026-03-13T07:20:00Z', '2026-03-13T17:30:00Z', 'resulted', '6.2', 6.2000, '%', '4.0 - 5.6', 'Slightly above target; monitor with PCP.', 'high', 'labs/2026/03/MRN-10001-hba1c.pdf')
on conflict (id) do nothing;

insert into public.hc_consents (
  id, patient_id, appointment_id, procedure_id, treatment_id, provider_id, consent_type, document_title, document_version, language, consent_status, signed_by, signed_relationship, signed_at, witness_staff_id, revoked_at, revocation_reason, document_path
)
values
  ('79000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '73000000-0000-0000-0000-000000000001', '72000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'procedure', 'Skin Biopsy Informed Consent', 'v2.1', 'en', 'signed', 'Noah Emerson', 'self', '2026-03-10T09:55:00Z', '20000000-0000-0000-0000-000000000005', null, null, 'consents/2026/03/MRN-10002-biopsy-consent.pdf'),
  ('79000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000003', '73000000-0000-0000-0000-000000000002', null, '30000000-0000-0000-0000-000000000001', 'treatment', 'Aesthetic Planning and Photo Consent', 'v1.4', 'en', 'pending', null, null, null, null, null, null, 'consents/2026/03/MRN-10003-aesthetic-planning.pdf')
on conflict (id) do nothing;

insert into public.hc_referrals (
  id, patient_id, from_provider_id, to_provider_id, referred_facility, referral_type, priority, reason, clinical_summary, status, referred_at, appointment_id, closed_at
)
values
  ('80000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', null, 'Oncology Dermatology Group', 'outbound', 'routine', 'Second opinion on atypical nevus monitoring interval.', 'Stable lesion; patient seeks specialist reassurance.', 'pending', '2026-03-14T10:05:00Z', '60000000-0000-0000-0000-000000000001', null),
  ('80000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', null, 'Austin Wound Care Center', 'outbound', 'high', 'Evaluate delayed epithelialization risk factors.', 'Post-biopsy healing appears normal but patient has anxiety and diabetes history.', 'accepted', '2026-03-13T16:20:00Z', '60000000-0000-0000-0000-000000000002', null)
on conflict (id) do nothing;

insert into public.hc_equipment (
  id, location_id, equipment_code, name, category, manufacturer, model, serial_number, purchase_date, warranty_expires_on, calibration_due_on, maintenance_due_on, status, assigned_to_staff_id, notes
)
values
  ('81000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'EQ-DERM-001', 'Dermatoscope Pro', 'diagnostic_device', 'Heine', 'Delta 30', 'HN-D30-88421', '2024-06-12', '2027-06-12', '2026-06-01', '2026-12-01', 'active', '20000000-0000-0000-0000-000000000002', 'Primary device for serial lesion imaging.'),
  ('81000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'EQ-SURG-004', 'Electrosurgical Unit', 'procedure_device', 'Bovie', 'BOV-1250S', 'BV-1250-99210', '2023-09-20', '2026-09-20', '2026-08-15', '2026-05-30', 'active', null, 'Used in minor outpatient procedures.')
on conflict (id) do nothing;

insert into public.hc_inventory (
  id, equipment_id, location_id, item_code, item_name, item_type, unit, quantity_on_hand, reorder_level, reorder_quantity, lot_number, expiry_date, vendor_name, unit_cost_cents, status, last_stocked_at
)
values
  ('82000000-0000-0000-0000-000000000001', null, '10000000-0000-0000-0000-000000000001', 'INV-LIDO-1P', 'Lidocaine 1% vial', 'medication', 'vial', 18, 20, 40, 'LID-202602-A', '2027-02-28', 'MedSupply Co', 690, 'active', '2026-03-01T09:10:00Z'),
  ('82000000-0000-0000-0000-000000000002', null, '10000000-0000-0000-0000-000000000001', 'INV-SUT-5O', 'Surgical sutures 5-0', 'surgical_supply', 'pack', 72, 50, 100, 'SUT-202601-C', '2028-01-31', 'SteriSource', 420, 'active', '2026-02-26T16:45:00Z'),
  ('82000000-0000-0000-0000-000000000003', '81000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'INV-DSC-KIT', 'Dermatoscope maintenance kit', 'device_kit', 'kit', 4, 5, 8, null, null, 'Heine Direct', 12900, 'active', '2026-01-18T11:00:00Z')
on conflict (id) do nothing;

insert into public.hc_notifications (
  id, recipient_staff_id, patient_id, appointment_id, channel, type, priority, title, message, payload, is_read, read_at, scheduled_for, sent_at
)
values
  ('83000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000003', 'in_app', 'billing_denial', 'high', 'Claim denied for INV-2026-0003', 'UnitedHealthcare denied claim due to pre-authorization mismatch.', '{"invoice_number":"INV-2026-0003","next_step":"appeal"}'::jsonb, false, null, null, '2026-03-14T08:05:00Z'),
  ('83000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', 'sms', 'lab_result', 'medium', 'Biopsy result finalized', 'Dermatopathology report is now available for review.', '{"lab_result_id":"78000000-0000-0000-0000-000000000001"}'::jsonb, true, '2026-03-13T12:10:00Z', null, '2026-03-13T11:50:00Z'),
  ('83000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'in_app', 'care_gap', 'low', 'Follow-up due in 6 weeks', 'Schedule repeat dermoscopy follow-up before April 30.', '{"suggested_date":"2026-04-28"}'::jsonb, false, null, '2026-03-20T14:00:00Z', null)
on conflict (id) do nothing;

insert into public.hc_audits (
  id, actor_staff_id, actor_user_id, action, entity_type, entity_id, table_name, ip_address, user_agent, request_id, before_data, after_data, metadata, created_at
)
values
  ('84000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', null, 'appointment.created', 'appointment', '60000000-0000-0000-0000-000000000003', 'hc_appointments', '10.10.4.22', 'Mozilla/5.0', 'req-apt-93aa', null, '{"status":"scheduled","booked_via":"portal"}'::jsonb, '{"source":"scheduler"}'::jsonb, '2026-03-14T06:05:00Z'),
  ('84000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', null, 'billing.status_updated', 'billing', '76000000-0000-0000-0000-000000000003', 'hc_billings', '10.10.6.14', 'Mozilla/5.0', 'req-bil-a12e', '{"status":"submitted"}'::jsonb, '{"status":"denied","denial_reason":"Pre-authorization mismatch on planned procedure code"}'::jsonb, '{"workflow":"claims"}'::jsonb, '2026-03-14T08:12:00Z'),
  ('84000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', null, 'clinical_note.signed', 'clinical_note', '70000000-0000-0000-0000-000000000001', 'hc_clinical_notes', '10.10.5.9', 'Mozilla/5.0', 'req-note-120f', '{"status":"draft"}'::jsonb, '{"status":"signed","signed_at":"2026-03-14T09:32:00Z"}'::jsonb, '{"module":"ehr"}'::jsonb, '2026-03-14T09:32:00Z')
on conflict (id) do nothing;

insert into public.hc_reports (
  id, generated_by_staff_id, report_name, report_type, period_start, period_end, filters, status, generated_at, file_format, file_path, checksum, summary
)
values
  ('85000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'Revenue Cycle Weekly Pulse', 'billing', '2026-03-08', '2026-03-14', '{"location":"all","payer":"all"}'::jsonb, 'generated', '2026-03-14T07:15:00Z', 'pdf', 'reports/2026/03/revenue-cycle-weekly-pulse.pdf', '5d4d77a8d2e3ed2db4c8971300f4fbe36c67d128e3e93236f7d1d59f1bb49c8b', '{"submitted":2,"paid":1,"denied":1,"net_collections_cents":17000}'::jsonb),
  ('85000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Dermatology Clinical Operations Snapshot', 'clinical', '2026-03-01', '2026-03-14', '{"specialty":"dermatology","location":"AUS-NORTH"}'::jsonb, 'generated', '2026-03-14T07:40:00Z', 'csv', 'reports/2026/03/derm-ops-snapshot.csv', 'be1a41f4e988b4b27eaf6f5826af6a487ba9f7711c2d23f5bd20f34ca6e741da', '{"appointments":3,"completed_procedures":1,"open_referrals":2}'::jsonb),
  ('85000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'Inventory Reorder Forecast', 'inventory', '2026-03-14', '2026-03-31', '{"location":"AUS-NORTH"}'::jsonb, 'queued', null, 'xlsx', null, null, '{"items_below_reorder":2}'::jsonb)
on conflict (id) do nothing;
