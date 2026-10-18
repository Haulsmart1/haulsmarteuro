import test from "node:test";
import assert from "node:assert/strict";
import { GoTrueClient } from "@supabase/auth-js";
import { observeLoginSession } from "../lib/loginSession.js";

const flush = () => new Promise((resolve) => setImmediate(resolve));
let fixtureNumber = 0;

// Exercise the installed Auth SDK's actual implicit callback parser. All URLs,
// storage and sessions are synthetic; any attempted HTTP request fails the test.
async function fixture(t, { expired = true, existing = false } = {}) {
  const original = { window: globalThis.window, document: globalThis.document };
  globalThis.window = {
    location: { href: `https://example.invalid/login${expired ? "#error=access_denied&error_code=otp_expired&error_description=Synthetic+expired+link" : ""}` },
    addEventListener() {}, removeEventListener() {},
  };
  globalThis.document = { visibilityState: "visible", addEventListener() {}, removeEventListener() {} };
  const session = { access_token: "synthetic-access", refresh_token: "synthetic-refresh", token_type: "bearer",
    expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: "synthetic-user" } };
  const storageKey = `synthetic-auth-${++fixtureNumber}`;
  const values = new Map(existing ? [[storageKey, JSON.stringify(session)]] : []);
  const auth = new GoTrueClient({
    url: "https://example.invalid/auth/v1", storageKey, autoRefreshToken: false,
    persistSession: true, detectSessionInUrl: true,
    storage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) },
    fetch: async () => assert.fail("No HTTP requests are permitted in this test"),
  });
  t.after(async () => {
    await auth.stopAutoRefresh();
    auth.broadcastChannel?.close();
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
  });
  return { auth, values, storageKey };
}

test("SDK callback failures are absent from getSession and must be observed separately", async (t) => {
  const { auth } = await fixture(t);
  assert.equal((await auth.initialize()).error.name, "AuthImplicitGrantRedirectError");
  assert.deepEqual(await auth.getSession(), { data: { session: null }, error: null });
});

test("expired email callbacks produce an actionable error through the login observer", async (t) => {
  const { auth } = await fixture(t);
  const actions = [];
  const stop = observeLoginSession(auth, { onSignedIn: () => actions.push("portal"), onError: (kind) => actions.push(kind) });
  t.after(stop);
  await flush(); await flush();
  assert.deepEqual(actions, ["invalid_link"]);
});

test("ordinary signed-out entry produces no callback error", async (t) => {
  const { auth } = await fixture(t, { expired: false });
  const actions = [];
  const stop = observeLoginSession(auth, { onSignedIn: () => actions.push("portal"), onError: (kind) => actions.push(kind) });
  t.after(stop);
  await flush(); await flush();
  assert.deepEqual(actions, []);
});

test("a failed email callback preserves an existing session and portal verification", async (t) => {
  const { auth, values, storageKey } = await fixture(t, { existing: true });
  const actions = [];
  const stop = observeLoginSession(auth, { onSignedIn: () => actions.push("portal"), onError: (kind) => actions.push(kind) });
  t.after(stop);
  await flush(); await flush();
  assert.deepEqual(actions, ["portal"]);
  assert.ok(values.has(storageKey));
});
