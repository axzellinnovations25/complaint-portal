drop policy if exists "complaint_categories_select_public" on public.complaint_categories;
create policy "complaint_categories_select_public"
on public.complaint_categories
for select
to anon, authenticated
using (is_active = true);
