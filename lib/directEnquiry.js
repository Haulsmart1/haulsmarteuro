import { randomUUID } from "node:crypto";

export const MANUAL_ENQUIRY_EMAIL = "help@haul-smart.com";

const fieldLimits = {
  name: 120,
  company: 160,
  replyEmail: 254,
  phone: 80,
  origin: 120,
  destination: 120,
  goods: 1000,
  timing: 200,
};

const requiredFields = ["name", "company", "replyEmail", "origin", "destination", "goods"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

function clean(value, limit) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, limit);
}

export function validateDirectEnquiry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Please check the enquiry details and try again." };
  }

  const values = Object.fromEntries(
    Object.entries(fieldLimits).map(([key, limit]) => [key, clean(input[key], limit)]),
  );

  for (const key of requiredFields) {
    if (!values[key] || values[key].length < 2) {
      return { ok: false, error: "Please complete all required enquiry details." };
    }
  }

  if (!emailPattern.test(values.replyEmail)) {
    return { ok: false, error: "Enter a valid reply email address." };
  }

  if (String(input.website ?? "").trim()) {
    return { ok: false, error: "We could not submit this enquiry. Please try again." };
  }

  return { ok: true, value: values };
}

function createState() {
  return { submissions: new Map(), rates: new Map() };
}

function getSharedState() {
  if (!globalThis.__haulsmartDirectEnquiryState) {
    globalThis.__haulsmartDirectEnquiryState = createState();
  }
  return globalThis.__haulsmartDirectEnquiryState;
}

function pruneState(state, now) {
  for (const [key, record] of state.submissions) {
    if (record.expiresAt <= now) state.submissions.delete(key);
  }
  for (const [key, record] of state.rates) {
    if (record.startedAt + RATE_WINDOW_MS <= now) state.rates.delete(key);
  }
  if (state.submissions.size > 10000) state.submissions.clear();
  if (state.rates.size > 10000) state.rates.clear();
}

function ipAddress(req) {
  const value = req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
  return String(value).split(",")[0].trim().slice(0, 100) || "unknown";
}

function configured(env) {
  return Boolean(
    env.SMTP_HOST
      && /^[a-zA-Z0-9.-]+$/.test(env.SMTP_HOST)
      && env.EMAIL_USER
      && env.EMAIL_PASS
  );
}

function reply(res, status, body) {
  return res.status(status).json(body);
}

export function createDirectEnquiryHandler({
  env = process.env,
  sendMail,
  now = () => Date.now(),
  state = getSharedState(),
} = {}) {
  return async function handleDirectEnquiry(req, res) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return reply(res, 405, { ok: false, code: "METHOD_NOT_ALLOWED", message: "Method not allowed." });
    }

    const contentType = String(req.headers["content-type"] ?? "").toLowerCase();
    if (!contentType.startsWith("application/json")) {
      return reply(res, 415, { ok: false, code: "JSON_REQUIRED", message: "Please submit the form again." });
    }

    const requestHost = String(req.headers.host ?? "").toLowerCase();
    const origin = req.headers.origin;
    if (origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host.toLowerCase() !== requestHost || originUrl.protocol !== "https:") {
          return reply(res, 403, { ok: false, code: "ORIGIN_REJECTED", message: "Please reload the page and try again." });
        }
      } catch {
        return reply(res, 403, { ok: false, code: "ORIGIN_REJECTED", message: "Please reload the page and try again." });
      }
    }
    if (req.headers["sec-fetch-site"] === "cross-site") {
      return reply(res, 403, { ok: false, code: "ORIGIN_REJECTED", message: "Please reload the page and try again." });
    }

    if (!configured(env) || typeof sendMail !== "function") {
      return reply(res, 503, {
        ok: false,
        code: "ENQUIRY_UNAVAILABLE",
        message: "Website submission is temporarily unavailable. Please use the email option below.",
      });
    }

    const idempotencyKey = String(req.headers["idempotency-key"] ?? "");
    if (!uuidPattern.test(idempotencyKey)) {
      return reply(res, 400, { ok: false, code: "INVALID_REQUEST_ID", message: "Please refresh the page and try again." });
    }

    const validation = validateDirectEnquiry(req.body);
    if (!validation.ok) {
      return reply(res, 400, { ok: false, code: "INVALID_ENQUIRY", message: validation.error });
    }

    const timestamp = now();
    pruneState(state, timestamp);
    const ip = ipAddress(req);
    const rateRecord = state.rates.get(ip);
    if (rateRecord && rateRecord.count >= RATE_LIMIT) {
      return reply(res, 429, {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many attempts. Please wait a little while or use the email option below.",
      });
    }
    if (rateRecord) rateRecord.count += 1;
    else state.rates.set(ip, { startedAt: timestamp, count: 1 });

    const submissionKey = idempotencyKey;
    const previous = state.submissions.get(submissionKey);
    if (previous) {
      return reply(res, 409, {
        ok: false,
        code: "ENQUIRY_DUPLICATE",
        message: "This enquiry has already been submitted. If you need help, use the email option below.",
      });
    }

    state.submissions.set(submissionKey, { status: "sending", expiresAt: timestamp + IDEMPOTENCY_TTL_MS });
    const values = validation.value;
    const subject = `Freight enquiry: ${values.origin.replace(/[\r\n]+/g, " ")} to ${values.destination.replace(/[\r\n]+/g, " ")}`;
    const text = [
      "New freight enquiry from the HaulSmart Europe website",
      "",
      `Name: ${values.name}`,
      `Company: ${values.company}`,
      `Reply email: ${values.replyEmail}`,
      `Phone: ${values.phone || "Not provided"}`,
      `Collection: ${values.origin}`,
      `Delivery: ${values.destination}`,
      `Goods: ${values.goods}`,
      `Timing: ${values.timing || "Not specified"}`,
    ].join("\n");

    try {
      const result = await sendMail({
        to: MANUAL_ENQUIRY_EMAIL,
        replyTo: values.replyEmail,
        subject,
        text,
      });
      if (!Array.isArray(result?.accepted) || !result.accepted.some((address) => String(address).toLowerCase() === MANUAL_ENQUIRY_EMAIL)) {
        throw new Error("SMTP did not accept the configured operations recipient.");
      }
      state.submissions.set(submissionKey, {
        status: "sent",
        expiresAt: timestamp + IDEMPOTENCY_TTL_MS,
      });
      return reply(res, 200, {
        ok: true,
        code: "ENQUIRY_SENT",
        message: "Your enquiry was sent to our operations team. They will review it and reply to you.",
      });
    } catch (error) {
      state.submissions.delete(submissionKey);
      console.error("Freight enquiry delivery failed", {
        name: error?.name || "Error",
        code: error?.code || "SMTP_DELIVERY_FAILED",
      });
      return reply(res, 502, {
        ok: false,
        code: "ENQUIRY_DELIVERY_FAILED",
        message: "We could not send your enquiry just now. Your details are still here; please try again or use the email option below.",
      });
    }
  };
}

export function createIdempotencyKey() {
  return randomUUID();
}
