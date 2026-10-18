import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { readPortalData } from "../lib/portalData.js";

function fixture(stalledTable, { ignoreAbort = false } = {}) {
  const calls = [];
  let release;
  const client = createClient("https://example.invalid", "synthetic-public-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (input, init) => {
      const url = new URL(input);
      const table = url.pathname.split("/").at(-1);
      calls.push({ table, signal: init.signal, method: init.method });
      if (table === stalledTable) return new Promise((resolve, reject) => {
        release = () => resolve(new Response(JSON.stringify([{ id: "late-record" }]), { status: 200 }));
        if (!ignoreAbort) init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      });
      return new Response(JSON.stringify([{ id: `own-${table}` }]), { status: 200 });
    } },
  });
  return { client, calls, release: () => release?.(), recover: () => { stalledTable = null; } };
}

for (const table of ["users", "live_loads", "vehicles", "invoices"]) {
  test(`a stalled ${table} read cannot hold the remaining workspace sections`, async () => {
    const f = fixture(table);
    const sentinel = Symbol("still-pending");
    let timer;
    const outcome = await Promise.race([
      readPortalData(f.client, "synthetic-user", { timeoutMs: 25 }),
      new Promise((resolve) => { timer = setTimeout(() => resolve(sentinel), 150); }),
    ]);
    clearTimeout(timer);
    // Release even before-fix requests so the test leaves no pending transport.
    f.release();
    assert.notEqual(outcome, sentinel, "workspace read stayed pending beyond its deadline");
    const key = { users: "profile", live_loads: "loads", vehicles: "vehicles", invoices: "invoices" }[table];
    assert.deepEqual(outcome[key], { rows: [], error: true });
    for (const [other, result] of Object.entries(outcome)) if (other !== key) {
      assert.equal(result.error, false);
      assert.equal(result.rows.length, 1);
    }
    assert.equal(f.calls.length, 4);
    assert.ok(f.calls.every((call) => call.method === "GET"));
    assert.equal(f.calls.find((call) => call.table === table).signal.aborted, true);
  });
}

test("a transport ignoring abort cannot delay the deadline or overwrite the returned result", async () => {
  const f = fixture("invoices", { ignoreAbort: true });
  const sentinel = Symbol("still-pending");
  let timer;
  const outcome = await Promise.race([
    readPortalData(f.client, "synthetic-user", { timeoutMs: 25 }),
    new Promise((resolve) => { timer = setTimeout(() => resolve(sentinel), 150); }),
  ]);
  clearTimeout(timer);
  f.release();
  assert.notEqual(outcome, sentinel);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(outcome.invoices, { rows: [], error: true });
});

test("ordinary successful reads remain visible without aborting completed requests", async () => {
  const f = fixture(null);
  const result = await readPortalData(f.client, "synthetic-user", { timeoutMs: 100 });
  assert.ok(Object.values(result).every((section) => !section.error && section.rows.length === 1));
  assert.ok(f.calls.every((call) => call.signal && !call.signal.aborted));
});

test("a fresh refresh recovers a previously timed-out section", async () => {
  const f = fixture("vehicles");
  const first = await readPortalData(f.client, "synthetic-user", { timeoutMs: 25 });
  assert.equal(first.vehicles.error, true);
  f.recover();
  const next = await readPortalData(f.client, "synthetic-user", { timeoutMs: 100 });
  assert.deepEqual(next.vehicles, { rows: [{ id: "own-vehicles" }], error: false });
});
