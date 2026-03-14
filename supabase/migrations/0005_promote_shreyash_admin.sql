update public.profiles as p
set role = 'admin'
from auth.users as u
where p.id = u.id
  and lower(u.email) = 'shreyash.tripathi@bacancy.com';
