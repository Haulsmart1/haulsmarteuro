import test from "node:test";
import assert from "node:assert/strict";
import handler, { config } from "../pages/api/ask.js";

function response() {
  return {
    headers: {}, statusCode: null, payload: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(value) { this.statusCode = value; return this; },
    json(value) { this.payload = value; return this; },
  };
}

test("public requests cannot activate AI using a prompt or claimed entitlement", () => {
  const req = { method: "POST", headers: { authorization: "Bearer unverified" } };
  Object.defineProperty(req, "body", { get() { throw new Error("Do not inspect untrusted prompts while disabled"); } });
  const res = response();
  handler(req, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.payload.code, "AI_NOT_ENABLED");
  assert.equal(res.headers["Cache-Control"], "no-store");
});

test("unsupported methods do not invoke work and advertise POST only", () => {
  for (const method of ["GET", "HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const res = response();
    handler({ method }, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.Allow, "POST");
    assert.equal(res.headers["Cache-Control"], "no-store");
  }
});

test("disabled endpoint avoids parsing or buffering a request payload", () => {
  assert.equal(config.api.bodyParser, false);
});
