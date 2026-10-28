import test from "node:test";
import assert from "node:assert/strict";
import { createDirectEnquiryHandler, validateDirectEnquiry } from "./directEnquiry.js";

const env = {
  SMTP_HOST: "smtp.example.test",
  EMAIL_USER: "operations@example.test",
  EMAIL_PASS: "configured-secret",
};

const enquiry = {
  name: "Alex Driver",
  company: "Example Logistics",
  replyEmail: "alex@example.com",
  phone: "+44 1234 567890",
  origin: "Birmingham",
  destination: "Rotterdam",
  goods: "Two pallets, 800 kg, 120 x 100 x 100 cm",
  timing: "Collection next Tuesday",
};

function makeRequest({ body = enquiry, headers = {}, method = "POST", ip = "192.0.2.1" } = {}) {
  return {
    method,
    body,
    socket: { remoteAddress: ip },
    headers: {
      host: "haulsmart.example.test",
      origin: "https://haulsmart.example.test",
      "content-type": "application/json",
      "idempotency-key": "123e4567-e89b-42d3-a456-426614174000",
      ...headers,
    },
  };
}

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(key, value) { this.headers[key] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function makeHandler(options = {}) {
  const state = { submissions: new Map(), rates: new Map() };
  const sent = [];
  const handler = createDirectEnquiryHandler({
    env,
    state,
    sendMail: async (message) => { sent.push(message); return { accepted: ["help@haul-smart.com"] }; },
    ...options,
  });
  return { handler, sent, state };
}

test("validates, preserves all freight details, and sends only to the declared operations mailbox", async () => {
  const { handler, sent } = makeHandler();
  const response = makeResponse();
  await handler(makeRequest(), response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.code, "ENQUIRY_SENT");
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "help@haul-smart.com");
  assert.equal(sent[0].replyTo, enquiry.replyEmail);
  for (const value of Object.values(enquiry)) assert.match(sent[0].text, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("rejects invalid fields, bot honeypot submissions, and cross-origin requests", async () => {
  assert.equal(validateDirectEnquiry({ ...enquiry, replyEmail: "bad address" }).ok, false);
  assert.equal(validateDirectEnquiry({ ...enquiry, website: "spam" }).ok, false);

  const { handler, sent } = makeHandler();
  const bad = makeResponse();
  await handler(makeRequest({ body: { ...enquiry, replyEmail: "bad address" } }), bad);
  assert.equal(bad.statusCode, 400);
  assert.equal(sent.length, 0);

  const crossOrigin = makeResponse();
  await handler(makeRequest({ headers: { origin: "https://attacker.example" } }), crossOrigin);
  assert.equal(crossOrigin.statusCode, 403);
});

test("does not claim delivery when SMTP is unconfigured or rejects the message", async () => {
  const noConfig = createDirectEnquiryHandler({
    env: { EMAIL_USER: "operations@example.test", EMAIL_PASS: "secret" },
    state: { submissions: new Map(), rates: new Map() },
    sendMail: async () => ({ accepted: ["help@haul-smart.com"] }),
  });
  const unavailable = makeResponse();
  await noConfig(makeRequest(), unavailable);
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailable.body.code, "ENQUIRY_UNAVAILABLE");

  const failed = makeHandler({ sendMail: async () => { throw new Error("SMTP connection refused"); } });
  const failure = makeResponse();
  await failed.handler(makeRequest(), failure);
  assert.equal(failure.statusCode, 502);
  assert.equal(failure.body.code, "ENQUIRY_DELIVERY_FAILED");
  assert.equal(failed.sent.length, 0);
});

test("blocks a duplicate idempotency key and allows a retry after delivery failure", async () => {
  const { handler, sent } = makeHandler();
  const first = makeResponse();
  await handler(makeRequest(), first);
  const duplicate = makeResponse();
  await handler(makeRequest(), duplicate);
  assert.equal(first.statusCode, 200);
  assert.equal(duplicate.statusCode, 409);
  assert.equal(duplicate.body.code, "ENQUIRY_DUPLICATE");
  assert.equal(sent.length, 1);

  let attempts = 0;
  const retryHandler = createDirectEnquiryHandler({
    env,
    state: { submissions: new Map(), rates: new Map() },
    sendMail: async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("temporary SMTP issue");
      return { accepted: ["help@haul-smart.com"] };
    },
  });
  const failure = makeResponse();
  await retryHandler(makeRequest({ ip: "192.0.2.2" }), failure);
  const retry = makeResponse();
  await retryHandler(makeRequest({ ip: "192.0.2.2" }), retry);
  assert.equal(failure.statusCode, 502);
  assert.equal(retry.statusCode, 200);
  assert.equal(attempts, 2);
});

test("rate limits repeated requests from the same address", async () => {
  const { handler } = makeHandler();
  const responses = [];
  for (let index = 0; index < 6; index += 1) {
    const response = makeResponse();
    await handler(makeRequest({
      headers: { "idempotency-key": `123e4567-e89b-42d3-a456-42661417400${index}` },
    }), response);
    responses.push(response);
  }
  assert.equal(responses[5].statusCode, 429);
  assert.equal(responses[5].body.code, "RATE_LIMITED");
});
