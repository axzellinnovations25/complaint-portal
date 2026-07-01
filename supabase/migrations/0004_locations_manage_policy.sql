drop policy if exists "locations_manage_admins" on public.locations;
create policy "locations_manage_admins"
on public.locations
for all
to authenticated
using (public.current_user_role() in ('super_admin', 'main_admin', 'department_head'))
with check (public.current_user_role() in ('super_admin', 'main_admin', 'department_head'));
