import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const candidate = await readFile(new URL('../../docs/sql/vehicles-owner-read.candidate.sql', import.meta.url), 'utf8');
const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
async function baseline() {
  const db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      'select nullif(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
    grant usage on schema public,auth to anon,authenticated;
    grant execute on function auth.uid() to anon,authenticated;
    create table public.vehicles(id integer primary key, user_id uuid, registration text);
    alter table public.vehicles enable row level security;
    grant all on public.vehicles to anon,authenticated;
    insert into public.vehicles values(1,'${a}','A'),(2,'${b}','B'),(3,null,'ORPHAN');
  `);
  return db;
}
test('vehicle candidate isolates accounts without frontend filters and denies writes/truncate', async () => {
  const db = await baseline();
  try {
    await db.exec(candidate);
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub','${a}',false);`);
    assert.deepEqual((await db.query('select id from public.vehicles order by id')).rows,[{id:1}]);
    assert.equal((await db.query('select id from public.vehicles where id=2')).rows.length,0);
    await db.exec(`select set_config('request.jwt.claim.sub','${b}',false)`);
    assert.deepEqual((await db.query('select id from public.vehicles')).rows,[{id:2}]);
    await db.exec("select set_config('request.jwt.claim.sub','',false)");
    assert.equal((await db.query('select id from public.vehicles')).rows.length,0);
    for (const role of ['authenticated','anon']) {
      await db.exec(`reset role; set role ${role};`);
      for (const sql of ["insert into public.vehicles values(4,null,'X')", "update public.vehicles set user_id=null", 'delete from public.vehicles', 'truncate public.vehicles']) {
        await assert.rejects(db.exec(sql), (error) => error.code === '42501');
      }
    }
    await assert.rejects(db.query('select * from public.vehicles'), (error) => error.code === '42501');
  } finally { await db.close(); }
});
test('candidate refuses an existing policy instead of silently widening access', async () => {
  const db=await baseline();
  try {
    await db.exec('create policy unexpected on public.vehicles for select using(true)');
    await assert.rejects(db.exec(candidate), /already has policies/);
    await db.exec('rollback');
    assert.equal((await db.query("select count(*)::int as n from pg_policies where tablename='vehicles'")).rows[0].n,1);
  } finally { await db.close(); }
});
