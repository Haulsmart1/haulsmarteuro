import test from "node:test";
import assert from "node:assert/strict";
import { checkPortalIdentity } from "./portalIdentity.js";

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
