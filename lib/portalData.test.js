import test from "node:test";
import assert from "node:assert/strict";
import { readPortalData, signOutPortalAccount } from "./portalData.js";

test("sign out only succeeds when the auth operation confirms success", async () => {
  assert.equal(await signOutPortalAccount({ auth: { signOut: async () => ({ error: null }) } }), true);
  assert.equal(await signOutPortalAccount({ auth: { signOut: async () => ({ error: new Error("denied") }) } }), false);
});
test("sign out network exceptions and unavailable configuration remain retryable failures", async () => {
  assert.equal(await signOutPortalAccount({ auth: { signOut: async () => { throw new Error("offline"); } } }), false);
  assert.equal(await signOutPortalAccount(null), false);
});
function client(results = {}) {
  const calls = [];
  return { calls, from(table) {
    const query = { then(resolve, reject) { return Promise.resolve(results[table] || { data: [], error: null }).then(resolve, reject); } };
    for (const method of ["select", "eq", "or", "order", "limit"]) query[method] = (...args) => { calls.push([table, method, ...args]); return query; };
    return query;
  } };
}
test("rejects missing identity before requesting data", async () => {
  const fake = client(); await assert.rejects(readPortalData(fake, ""), /Authentication/); assert.equal(fake.calls.length, 0);
});
test("queries only account-scoped core tables with bounded results", async () => {
  const fake = client(); await readPortalData(fake, "account-id");
  assert.deepEqual(fake.calls.filter((call) => call[1] === "eq"), [["users", "eq", "id", "account-id"], ["live_loads", "eq", "user_id", "account-id"], ["vehicles", "eq", "user_id", "account-id"]]);
  assert.deepEqual(fake.calls.find((call) => call[1] === "or"), ["invoices", "or", "issued_by.eq.account-id,issued_to.eq.account-id"]);
  assert.equal(fake.calls.filter((call) => call[1] === "limit").length, 4);
});
test("does not turn failed records into apparent successful empty results", async () => {
  const fake = client({ live_loads: { error: { message: "permission denied" }, data: [{ id: "untrusted" }] }, vehicles: { data: [{ id: "own-vehicle" }], error: null } });
  const data = await readPortalData(fake, "account-id"); assert.equal(data.loads.error, true); assert.deepEqual(data.loads.rows, []); assert.equal(data.vehicles.rows[0].id, "own-vehicle"); assert.equal(data.vehicles.error, false);
});
