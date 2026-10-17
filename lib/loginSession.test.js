import test from "node:test";
import assert from "node:assert/strict";
import { observeLoginSession } from "./loginSession.js";

function fixture(getSession) {
  const actions = [];
  let emit;
  const stop = observeLoginSession({
    getSession,
    onAuthStateChange(callback) {
      emit = callback;
      return { data: { subscription: { unsubscribe: () => actions.push("unsubscribe") } } };
    },
  }, { onSignedIn: () => actions.push("portal"), onError: () => actions.push("retry") });
  return { actions, stop, emit: (...args) => emit(...args) };
}
const flush = () => new Promise((resolve) => setImmediate(resolve));
const signedIn = { data: { session: { user: { id: "synthetic-user" } } } };

test("a rejected startup session read is recoverable and does not redirect", async () => {
  const f = fixture(async () => { throw new TypeError("Failed to fetch"); });
  await flush();
  assert.deepEqual(f.actions, ["retry"]);
  f.stop();
});

test("a synchronous storage failure is caught too", async () => {
  const f = fixture(() => { throw new Error("storage unavailable"); });
  await flush();
  assert.deepEqual(f.actions, ["retry"]);
  f.stop();
});

test("an error response cannot redirect using a stale attached session", async () => {
  const f = fixture(async () => ({ ...signedIn, error: { status: 503 } }));
  await flush();
  assert.deepEqual(f.actions, ["retry"]);
  f.stop();
});

for (const outcome of [signedIn, new Error("late rejection")]) {
  test(`unmount ignores a pending ${outcome instanceof Error ? "failure" : "session"}`, async () => {
    let finish;
    const f = fixture(() => new Promise((resolve, reject) => { finish = () => outcome instanceof Error ? reject(outcome) : resolve(outcome); }));
    f.stop();
    finish();
    await flush();
    f.emit("SIGNED_IN", signedIn.data.session);
    assert.deepEqual(f.actions, ["unsubscribe"]);
  });
}

test("a sign-out event wins over an older successful startup read", async () => {
  let finish;
  const f = fixture(() => new Promise((resolve) => { finish = resolve; }));
  f.emit("SIGNED_OUT", null);
  finish(signedIn);
  await flush();
  assert.deepEqual(f.actions, []);
  f.stop();
});

test("a successful sign-in event wins over an older startup failure", async () => {
  let finish;
  const f = fixture(() => new Promise((resolve) => { finish = resolve; }));
  f.emit("SIGNED_IN", signedIn.data.session);
  finish({ error: { status: 503 } });
  await flush();
  assert.deepEqual(f.actions, ["portal"]);
  f.stop();
});

test("ordinary signed-in and signed-out startup states remain supported", async () => {
  const loggedIn = fixture(async () => signedIn);
  const loggedOut = fixture(async () => ({ data: { session: null } }));
  await flush();
  assert.deepEqual(loggedIn.actions, ["portal"]);
  assert.deepEqual(loggedOut.actions, []);
  loggedIn.stop(); loggedOut.stop();
});
