alter table public.departments
add column if not exists is_active boolean not null default true;
