import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { checkPortalIdentity } from "../lib/portalIdentity.js";

function fixture() {
  const calls = [];
  let finish;
  let stall = true;
  const user = { id: "verified-account", email: "verified@example.invalid" };
  const client = createClient("https://identity.example.invalid", "synthetic-public-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      headers: { Authorization: "Bearer synthetic-test-token" },
      fetch: async (input, init) => {
        const path = new URL(input).pathname;
        calls.push({ path, method: init.method });
        assert.equal(path, "/auth/v1/user");
        if (stall) await new Promise((resolve) => { finish = resolve; });
        return new Response(JSON.stringify(user), { status: 200 });
      },
    },
  });
  return { client, calls, user, release() { stall = false; finish?.(); } };
}

test("a stalled verified identity request offers retry instead of loading indefinitely", async () => {
  const f = fixture();
  let timer;
  const sentinel = Symbol("still-pending");
  const outcome = await Promise.race([
    checkPortalIdentity(f.client.auth, { timeoutMs: 25 }),
    new Promise((resolve) => { timer = setTimeout(() => resolve(sentinel), 150); }),
  ]);
  clearTimeout(timer);
  f.release();
  assert.notEqual(outcome, sentinel, "identity remained pending beyond its deadline");
  assert.deepEqual(outcome, { status: "retry", user: null });
  assert.deepEqual(f.calls, [{ path: "/auth/v1/user", method: "GET" }]);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(outcome, { status: "retry", user: null }, "late success must not expose identity");
});

test("a fresh check can verify after the slow request settles", async () => {
  const f = fixture();
  const first = checkPortalIdentity(f.client.auth, { timeoutMs: 25 });
  const sentinel = Symbol("still-pending");
  let timer;
  const outcome = await Promise.race([first, new Promise((resolve) => { timer = setTimeout(() => resolve(sentinel), 150); })]);
  clearTimeout(timer);
  f.release();
  assert.notEqual(outcome, sentinel);
  assert.deepEqual(outcome, { status: "retry", user: null });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(await checkPortalIdentity(f.client.auth, { timeoutMs: 100 }), { status: "authenticated", user: f.user });
});

test("deadline does not sign out, trust cached data, or classify outage as missing session", async () => {
  let finish;
  const auth = {
    getUser: () => new Promise((resolve) => { finish = resolve; }),
    getSession: () => assert.fail("cached session is not verified identity"),
    signOut: () => assert.fail("timeout is not session revocation"),
  };
  let timer;
  const sentinel = Symbol("still-pending");
  const outcome = await Promise.race([
    checkPortalIdentity(auth, { timeoutMs: 25 }),
    new Promise((resolve) => { timer = setTimeout(() => resolve(sentinel), 150); }),
  ]);
  clearTimeout(timer);
  finish({ data: { user: { id: "late-account" } } });
  assert.notEqual(outcome, sentinel);
  assert.deepEqual(outcome, { status: "retry", user: null });
});
