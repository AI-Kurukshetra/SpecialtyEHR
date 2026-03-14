update public.profiles as p
set
  role = mapped.role,
  full_name = mapped.full_name
from (
  values
    ('doctor1.demo@aurorahealth.app', 'doctor', 'Dr. Ryan Hall'),
    ('doctor2.demo@aurorahealth.app', 'doctor', 'Dr. Emma Sloan'),
    ('nurse1.demo@aurorahealth.app', 'nurse', 'Nurse Ava Brooks'),
    ('nurse2.demo@aurorahealth.app', 'nurse', 'Nurse Jacob Moss'),
    ('reception1.demo@aurorahealth.app', 'receptionist', 'Sophia Reed'),
    ('reception2.demo@aurorahealth.app', 'receptionist', 'Mason Cole'),
    ('admin1.demo@aurorahealth.app', 'admin', 'Olivia Brooks'),
    ('admin2.demo@aurorahealth.app', 'admin', 'Noah Kim')
) as mapped(email, role, full_name)
join auth.users u
  on lower(u.email) = mapped.email
where p.id = u.id;
