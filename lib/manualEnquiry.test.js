import test from "node:test";
import assert from "node:assert/strict";
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
