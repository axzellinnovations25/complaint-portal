drop policy if exists "complaints_insert_public" on public.complaints;
create policy "complaints_insert_public"
on public.complaints
for insert
to anon, authenticated
with check (true);
