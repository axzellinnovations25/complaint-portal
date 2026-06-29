create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and is_active = true
  limit 1
$$;

create or replace function public.is_staff_role(role public.user_role)
returns boolean
language sql
immutable
as $$
  select role in (
    'super_admin',
    'main_admin',
    'management_viewer',
    'department_head',
    'officer',
    'field_officer',
    'content_admin',
    'knowledge_admin'
  )
$$;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.current_user_role() in ('super_admin', 'main_admin')
);

drop policy if exists "profiles_manage_admins" on public.profiles;
create policy "profiles_manage_admins"
on public.profiles
for all
to authenticated
using (public.current_user_role() in ('super_admin', 'main_admin'))
with check (public.current_user_role() in ('super_admin', 'main_admin'));

drop policy if exists "departments_select_staff" on public.departments;
create policy "departments_select_staff"
on public.departments
for select
to authenticated
using (public.is_staff_role(public.current_user_role()));

drop policy if exists "departments_manage_admins" on public.departments;
create policy "departments_manage_admins"
on public.departments
for all
to authenticated
using (public.current_user_role() in ('super_admin', 'main_admin', 'department_head'))
with check (public.current_user_role() in ('super_admin', 'main_admin', 'department_head'));

drop policy if exists "complaint_categories_select_staff" on public.complaint_categories;
create policy "complaint_categories_select_staff"
on public.complaint_categories
for select
to authenticated
using (public.is_staff_role(public.current_user_role()));

drop policy if exists "complaint_categories_manage_admins" on public.complaint_categories;
create policy "complaint_categories_manage_admins"
on public.complaint_categories
for all
to authenticated
using (public.current_user_role() in ('super_admin', 'main_admin', 'department_head'))
with check (public.current_user_role() in ('super_admin', 'main_admin', 'department_head'));

drop policy if exists "locations_select_staff" on public.locations;
create policy "locations_select_staff"
on public.locations
for select
to authenticated
using (public.is_staff_role(public.current_user_role()));

drop policy if exists "complaints_select_staff" on public.complaints;
create policy "complaints_select_staff"
on public.complaints
for select
to authenticated
using (public.is_staff_role(public.current_user_role()));

drop policy if exists "complaints_update_operations" on public.complaints;
create policy "complaints_update_operations"
on public.complaints
for update
to authenticated
using (public.current_user_role() in ('super_admin', 'main_admin', 'department_head', 'officer', 'field_officer'))
with check (public.current_user_role() in ('super_admin', 'main_admin', 'department_head', 'officer', 'field_officer'));

drop policy if exists "complaint_media_select_staff" on public.complaint_media;
create policy "complaint_media_select_staff"
on public.complaint_media
for select
to authenticated
using (public.is_staff_role(public.current_user_role()));

drop policy if exists "complaint_events_select_staff" on public.complaint_events;
create policy "complaint_events_select_staff"
on public.complaint_events
for select
to authenticated
using (public.is_staff_role(public.current_user_role()));

drop policy if exists "sms_logs_select_staff" on public.sms_logs;
create policy "sms_logs_select_staff"
on public.sms_logs
for select
to authenticated
using (public.is_staff_role(public.current_user_role()));

drop policy if exists "public_content_select_published" on public.public_content;
create policy "public_content_select_published"
on public.public_content
for select
to anon, authenticated
using (
  is_published = true
  or public.current_user_role() in ('super_admin', 'main_admin', 'content_admin', 'knowledge_admin')
);

drop policy if exists "public_content_manage_content_admins" on public.public_content;
create policy "public_content_manage_content_admins"
on public.public_content
for all
to authenticated
using (public.current_user_role() in ('super_admin', 'main_admin', 'content_admin', 'knowledge_admin'))
with check (public.current_user_role() in ('super_admin', 'main_admin', 'content_admin', 'knowledge_admin'));
