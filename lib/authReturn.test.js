import test from "node:test";
import assert from "node:assert/strict";
import { getAuthReturnUrl } from "./authReturn.js";

test("keeps preview, canonical and apex sign-in on the initiating origin", () => {
  for (const origin of ["https://haulsmarteuro-preview.vercel.app", "https://www.haulsmart-europe.com", "https://haulsmart-europe.com", "http://localhost:3000"])
    assert.equal(getAuthReturnUrl(origin), `${origin}/login`);
});
test("rejects URLs that are not a safe origin", () => {
  for (const origin of [undefined, "", "javascript:alert(1)", "http://example.com", "https://user:pass@example.com", "https://example.com/path", "https://example.com?next=evil", "//example.com"])
    assert.equal(getAuthReturnUrl(origin), "https://www.haulsmart-europe.com/login");
});
