import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildManualEnquiryMailto, MANUAL_ENQUIRY_EMAIL } from "./manualEnquiry.js";

test("builds an explicit manual email draft with the required freight details", () => {
  const href = buildManualEnquiryMailto({
    name: "Alex Driver",
    company: "Example Logistics",
    replyEmail: "alex@example.com",
    phone: "01234 567890",
    origin: "Birmingham",
    destination: "Rotterdam",
    goods: "Two standard pallets",
    timing: "Collection next Tuesday",
  });

  assert.ok(href.startsWith(`mailto:${MANUAL_ENQUIRY_EMAIL}?`));
  const query = new URLSearchParams(href.split("?")[1]);
  assert.equal(query.get("subject"), "Freight enquiry: Birmingham to Rotterdam");
  assert.match(query.get("body"), /Company: Example Logistics/);
  assert.match(query.get("body"), /Goods: Two standard pallets/);
  assert.match(query.get("body"), /Timing: Collection next Tuesday/);
});

test("normalises input and bounds the generated draft", () => {
  const href = buildManualEnquiryMailto({
    name: "  Alex\r\nDriver  ",
    company: "HaulSmart",
    replyEmail: "alex@example.com",
    origin: "Leeds\r\n",
    destination: "Paris",
    goods: "x".repeat(800),
  });

  const query = new URLSearchParams(href.split("?")[1]);
  assert.equal(query.get("subject"), "Freight enquiry: Leeds to Paris");
  assert.match(query.get("body"), /Name: Alex\nDriver/);
  assert.doesNotMatch(query.get("body"), /x{501}/);
  assert.match(query.get("body"), /Phone: Not provided/);
  assert.match(query.get("body"), /Timing: Not specified/);
});


test("public homepage promises only the manual freight enquiry", async () => {
  const home = await readFile(new URL("../pages/index.js", import.meta.url), "utf8");
  assert.doesNotMatch(home, /href="\/register"/);
  assert.doesNotMatch(home, /Create account|Clear account access|Everything begins with a clear account/);
  assert.match(home, /Request a freight quote/);
  assert.match(home, /manual quote and direct follow-up/i);
  assert.match(home, /does not create an automated booking, invoice or payment/i);
  assert.match(home, /Existing customer login/);
});


test("public manual-enquiry page separates existing-customer access", async () => {
  const contact = await readFile(new URL("../pages/contact.js", import.meta.url), "utf8");
  assert.doesNotMatch(contact, /href="\/register"|Create account/);
  assert.match(contact, /Existing customer login/);
  assert.match(contact, /onSubmit={submitEnquiry}/);
  assert.ok(contact.includes('fetch("/api/enquiry"'));
  assert.match(contact, /does not create an automated booking, price, invoice or payment/i);
  assert.match(contact, /Use email app instead/);
  assert.match(contact, /idempotency-key/i);
  assert.match(contact, /same collection, delivery, goods and timing details/i);
  assert.match(contact, /MANUAL_ENQUIRY_EMAIL/);
});
