// AI requests stay closed until verified account entitlements and usage limits
// are implemented. Do not instantiate a paid provider from this public route.
export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  return res.status(503).json({
    error: "AI assistance is not available yet.",
    code: "AI_NOT_ENABLED",
  });
}
