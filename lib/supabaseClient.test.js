import test from "node:test";
import assert from "node:assert/strict";

let moduleNumber = 0;
async function fixture(t, url, key = "synthetic-public-key") {
  const names = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  const original = names.map((name) => process.env[name]);
  t.after(() => names.forEach((name, index) => {
    if (original[index] === undefined) delete process.env[name];
    else process.env[name] = original[index];
  }));
  for (const [index, value] of [url, key].entries()) {
    if (value === undefined) delete process.env[names[index]];
    else process.env[names[index]] = value;
  }
  return import(`./supabaseClient.js?case=${++moduleNumber}`);
}

for (const url of ["not-a-url", "ftp://example.invalid", "https://"]) {
  test(`invalid configured URL stays unavailable without throwing: ${url}`, async (t) => {
    const { getSupabaseClient } = await fixture(t, url);
    assert.equal(getSupabaseClient(), null);
    assert.equal(getSupabaseClient(), null);
  });
}

test("missing URL or key remains unavailable", async (t) => {
  const { getSupabaseClient } = await fixture(t, undefined);
  assert.equal(getSupabaseClient(), null);
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid";
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  assert.equal(getSupabaseClient(), null);
});

test("a failed construction does not poison a later valid client", async (t) => {
  const { getSupabaseClient } = await fixture(t, "not-a-url");
  assert.equal(getSupabaseClient(), null);
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid";
  const client = getSupabaseClient();
  t.after(() => client.auth.stopAutoRefresh());
  assert.equal(typeof client.auth.signInWithOtp, "function");
  assert.equal(getSupabaseClient(), client);
});
