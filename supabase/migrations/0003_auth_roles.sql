alter table public.profiles
  add column if not exists role text not null default 'receptionist';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('doctor', 'nurse', 'receptionist', 'admin'));

create index if not exists idx_profiles_role on public.profiles(role);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text;
  user_full_name text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'receptionist');
  if user_role not in ('doctor', 'nurse', 'receptionist', 'admin') then
    user_role := 'receptionist';
  end if;

  user_full_name := nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), '');

  insert into public.profiles (id, full_name, role)
  values (new.id, user_full_name, user_role)
  on conflict (id) do update
    set full_name = excluded.full_name,
        role = excluded.role;

  return new;
end;
$$;

update public.profiles
set role = 'receptionist'
where role is null;
