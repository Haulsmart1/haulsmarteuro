-- REVIEW CANDIDATE ONLY. Not an automatically applied migration.
-- Only vehicles: loads and invoice recipient ownership remain undecided.
begin;
do $$
begin
  if not exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='vehicles' and c.relrowsecurity) then
    raise exception 'vehicles RLS baseline changed; review required';
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='vehicles') then
    raise exception 'vehicles already has policies; review additive access before proceeding';
  end if;
end $$;
revoke all privileges on table public.vehicles from public, anon, authenticated;
grant select on table public.vehicles to authenticated;
create policy vehicles_owner_read on public.vehicles for select to authenticated
  using ((select auth.uid()) = user_id);
commit;
