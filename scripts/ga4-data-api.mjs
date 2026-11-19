import { createSign } from "node:crypto";

/**
 * The Google Analytics Data API, read with a service account (N17's path,
 * docs/analytics.md): two secrets, nothing else.
 *
 *   GA4_SA_KEY       the service account's JSON key, as downloaded (or the
 *                    same in base64). The account is a Viewer on the property.
 *   GA4_PROPERTY_ID  the property's number (관리 > 속성 세부정보), not the
 *                    G- measurement ID.
 *
 * Without either, `readGa4Env` says so and the caller skips. The key never
 * leaves this module: it signs one JWT for a token with the read-only scope
 * and is not printed, not even in an error.
 */
export const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
export const TOKEN_URL = "https://oauth2.googleapis.com/token";
export const DATA_API = "https://analyticsdata.googleapis.com/v1beta";

/** { key, propertyId } or { missing: [names] }. A key that is not a service account's JSON is a thrown error. */
export function readGa4Env(env = {}) {
  const raw = String(env.GA4_SA_KEY ?? "").trim();
  const propertyId = String(env.GA4_PROPERTY_ID ?? "").trim().replace(/^properties\//, "");
  const missing = [...(raw ? [] : ["GA4_SA_KEY"]), ...(propertyId ? [] : ["GA4_PROPERTY_ID"])];
  if (missing.length) return { missing };
  if (!/^\d{4,15}$/.test(propertyId)) throw new Error("GA4_PROPERTY_ID must be the property's number (관리 > 속성 세부정보), not the G- measurement ID.");
  let key;
  try {
    key = JSON.parse(raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    throw new Error("GA4_SA_KEY is neither a service account's JSON key nor that JSON in base64.");
  }
  if (typeof key?.client_email !== "string" || typeof key?.private_key !== "string") {
    throw new Error("GA4_SA_KEY has no client_email or private_key: it is not a service account's key.");
  }
  return { key: { client_email: key.client_email, private_key: key.private_key }, propertyId };
}

const base64url = (value) => Buffer.from(value).toString("base64url");

/** The signed assertion a service account trades for a token (RFC 7523), good for ten minutes. */
export function serviceAccountJwt(key, now = Math.floor(Date.now() / 1000)) {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({ iss: key.client_email, scope: GA4_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 600 }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  return `${header}.${claims}.${signer.sign(key.private_key).toString("base64url")}`;
}

/** An error's message for a public log: the status and Google's own reason, cut short, no body echo. */
async function failure(what, response) {
  let reason = "";
  try {
    const body = await response.json();
    reason = String(body?.error?.message ?? body?.error_description ?? body?.error ?? "").slice(0, 160);
  } catch {
    // Not JSON.
  }
  const error = new Error(`${what}: HTTP ${response.status}${reason ? ` -- ${reason}` : ""}`);
  error.status = response.status;
  error.reason = reason;
  return error;
}

export async function accessToken(key, { fetch = globalThis.fetch, now } = {}) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: serviceAccountJwt(key, now) }).toString(),
  });
  if (!response.ok) throw await failure("GA token", response);
  const body = await response.json();
  if (typeof body?.access_token !== "string") throw new Error("GA token: no access_token in the answer.");
  return body.access_token;
}

/** One runReport (https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport). */
export async function runReport({ propertyId, token, request }, { fetch = globalThis.fetch } = {}) {
  const response = await fetch(`${DATA_API}/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw await failure("GA runReport", response);
  return response.json();
}

/** A report's rows as plain objects keyed by the header names: { eventName: "cp_lcp", eventCount: "3" }. */
export function rowsOf(report) {
  const dims = (report?.dimensionHeaders ?? []).map((header) => header.name);
  const mets = (report?.metricHeaders ?? []).map((header) => header.name);
  return (report?.rows ?? []).map((row) => ({
    ...Object.fromEntries(dims.map((name, index) => [name, row.dimensionValues?.[index]?.value ?? ""])),
    ...Object.fromEntries(mets.map((name, index) => [name, row.metricValues?.[index]?.value ?? "0"])),
  }));
}
