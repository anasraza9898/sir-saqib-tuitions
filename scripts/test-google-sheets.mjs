import { createPrivateKey, createSign } from "node:crypto";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TAB_NAME = "Leads";
const APPEND_RANGE = "Leads!A:O";
const TIMEOUT_MS = 15_000;

function clean(value) {
  if (typeof value !== "string") return "";
  let result = value.trim().replace(/,\s*$/, "").trim();
  if (result.length >= 2 && ((result.startsWith('"') && result.endsWith('"')) || (result.startsWith("'") && result.endsWith("'")))) {
    result = result.slice(1, -1).trim();
  }
  return result;
}

const sheetId = clean(process.env.GOOGLE_SHEET_ID);
const serviceAccountEmail = clean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
const normalizedPrivateKey = clean(process.env.GOOGLE_PRIVATE_KEY).replace(/\\n/g, "\n");
const privateKeyBegin = normalizedPrivateKey.indexOf("-----BEGIN PRIVATE KEY-----");
const privateKeyEndMarker = "-----END PRIVATE KEY-----";
const privateKeyEnd = normalizedPrivateKey.indexOf(privateKeyEndMarker);
const privateKeyValue = privateKeyBegin >= 0 && privateKeyEnd >= privateKeyBegin
  ? normalizedPrivateKey.slice(privateKeyBegin, privateKeyEnd + privateKeyEndMarker.length)
  : normalizedPrivateKey;

console.log("Credential presence:", JSON.stringify({
  GOOGLE_SHEET_ID: Boolean(sheetId),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: Boolean(serviceAccountEmail),
  GOOGLE_PRIVATE_KEY: Boolean(privateKeyValue),
}));

function fail(code, status, phase = "configuration") {
  console.error(`Google Sheets smoke test: FAIL code=${code}${status ? ` httpStatus=${status}` : ""} phase=${phase}`);
  process.exitCode = 1;
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function assertion(email, privateKey) {
  const issuedAt = Math.floor(Date.now() / 1_000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: issuedAt, exp: issuedAt + 3_600 }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(privateKey, "base64url")}`;
}

async function fetchTimed(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function googleReason(response) {
  try {
    const payload = await response.json();
    const error = payload?.error;
    if (typeof error === "string") return error.toLowerCase();
    const reason = error?.errors?.[0]?.reason;
    const status = error?.status;
    const message = error?.message;
    return `${typeof reason === "string" ? reason : ""} ${typeof status === "string" ? status : ""} ${typeof message === "string" ? message : ""}`.toLowerCase();
  } catch {
    return "";
  }
}

function sheetsFailure(status, reason, fallback = "APPEND_FAILED") {
  if (/accessnotconfigured|api.+not.+enabled|sheets api.+disabled/.test(reason)) return "API_NOT_ENABLED";
  if (status === 404) return "SPREADSHEET_NOT_FOUND";
  if (status === 403) return "PERMISSION_DENIED";
  return fallback;
}

if (!sheetId) fail("MISSING_SHEET_ID");
else if (!serviceAccountEmail) fail("MISSING_SERVICE_ACCOUNT_EMAIL");
else if (!privateKeyValue) fail("MISSING_PRIVATE_KEY");
else {
  let signedAssertion = "";
  try {
    createPrivateKey(privateKeyValue);
    signedAssertion = assertion(serviceAccountEmail, privateKeyValue);
  } catch {
    fail("INVALID_PRIVATE_KEY");
  }

  if (signedAssertion) {
    let phase = "authentication";
    try {
      const tokenResponse = await fetchTimed(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: signedAssertion }),
      });
      if (!tokenResponse.ok) {
        const reason = await googleReason(tokenResponse);
        fail(reason.includes("invalid_grant") ? "INVALID_PRIVATE_KEY" : "PERMISSION_DENIED", tokenResponse.status, phase);
      } else {
        const tokenPayload = await tokenResponse.json();
        const accessToken = typeof tokenPayload?.access_token === "string" ? tokenPayload.access_token : "";
        if (!accessToken) fail("PERMISSION_DENIED", tokenResponse.status, phase);
        else {
          phase = "spreadsheet_access";
          const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}?fields=spreadsheetId%2Csheets.properties.title`;
          const metadataResponse = await fetchTimed(metadataUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
          if (!metadataResponse.ok) {
            const reason = await googleReason(metadataResponse);
            fail(sheetsFailure(metadataResponse.status, reason, "SPREADSHEET_NOT_FOUND"), metadataResponse.status, phase);
          } else {
            const metadata = await metadataResponse.json();
            const tabs = Array.isArray(metadata?.sheets) ? metadata.sheets.map((sheet) => sheet?.properties?.title).filter((title) => typeof title === "string") : [];
            if (!tabs.includes(TAB_NAME)) fail("LEADS_TAB_NOT_FOUND", undefined, phase);
            else {
              phase = "append";
              const marker = "TEST LEAD  DELETE ME";
              const row = [new Date().toISOString(), marker, "", "", "", "", "", "", "", "", "", "", "/scripts/test-google-sheets.mjs", "Yes", "TEST"];
              const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(APPEND_RANGE)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
              const appendResponse = await fetchTimed(endpoint, {
                method: "POST",
                headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
                body: JSON.stringify({ majorDimension: "ROWS", values: [row] }),
              });
              if (!appendResponse.ok) {
                const reason = await googleReason(appendResponse);
                const code = /unable to parse range|requested entity was not found/.test(reason)
                  ? "LEADS_TAB_NOT_FOUND"
                  : sheetsFailure(appendResponse.status, reason, "APPEND_FAILED");
                fail(code, appendResponse.status, phase);
              } else {
                console.log(`Spreadsheet access: OK; tab=${TAB_NAME}; appendRange=${APPEND_RANGE}`);
                console.log(`Google Sheets smoke test: OK marker="${marker}"`);
              }
            }
          }
        }
      }
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === "AbortError" || /timeout/i.test(error.message));
      fail(timedOut ? "APPEND_FAILED" : "APPEND_FAILED", undefined, phase);
    }
  }
}
