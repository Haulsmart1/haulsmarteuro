import test from "node:test";
import assert from "node:assert/strict";
import { checkPortalIdentity, handlePortalAuthChange } from "./portalIdentity.js";

test("only returns an identity verified by getUser", async () => {
  const user = { id: "account-a", email: "a@example.com" };
  assert.deepEqual(await checkPortalIdentity({ getUser: async () => ({ data: { user } }) }), { status: "authenticated", user });
  assert.deepEqual(await checkPortalIdentity({ getUser: async () => ({ data: { user }, error: { status: 503 } }) }), { status: "retry", user: null });
});
test("missing and revoked sessions require sign-in", async () => {
  for (const error of [null, { name: "AuthSessionMissingError" }, { code: "refresh_token_not_found" }, { code: "session_not_found" }, { code: "bad_jwt" }]) {
    assert.equal((await checkPortalIdentity({ getUser: async () => ({ data: { user: null }, error }) })).status, "missing");
  }
});
test("offline, rate limit and service failure offer retry without exposing user", async () => {
  for (const error of [{ name: "AuthRetryableFetchError", status: 0 }, { status: 429 }, { status: 500 }, { code: "request_timeout" }]) {
    assert.deepEqual(await checkPortalIdentity({ getUser: async () => ({ error }) }), { status: "retry", user: null });
  }
  assert.deepEqual(await checkPortalIdentity({ getUser: async () => { throw new TypeError("Failed to fetch"); } }), { status: "retry", user: null });
});

for (const event of ["SIGNED_IN", "USER_UPDATED", "SIGNED_OUT"]) {
  test(`${event} clears old records immediately and rejects a late previous-account response`, async () => {
    let active = true;
    let visible = { account: "account-a", loads: ["private-load-a"], vehicles: ["private-vehicle-a"] };
    let finish;
    const pending = new Promise((resolve) => { finish = resolve; });
    const lateRead = pending.then((result) => { if (active) visible = result; });
    const actions = [];
    handlePortalAuthChange(event, {
      invalidate: () => { active = false; actions.push("invalidate"); },
      clear: () => { visible = null; actions.push("clear"); },
      recheck: () => actions.push("verify-again"),
      signIn: () => actions.push("sign-in"),
    });
    assert.equal(visible, null, "records must clear before the next effect or network response");
    assert.deepEqual(actions, ["invalidate", "clear", event === "SIGNED_OUT" ? "sign-in" : "verify-again"]);
    finish({ account: "account-a", loads: ["late-private-load-a"], vehicles: ["late-private-vehicle-a"] });
    await lateRead;
    assert.equal(visible, null, "late reads cannot repopulate the cleared workspace");
  });
}

test("token refresh does not trust an event payload or replace the verified account", () => {
  const unexpected = () => assert.fail("routine token refresh must not change visible identity");
  handlePortalAuthChange("TOKEN_REFRESHED", { invalidate: unexpected, clear: unexpected, recheck: unexpected, signIn: unexpected });
});
