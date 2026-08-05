import { createSign } from "node:crypto";
import type { StoredLead } from "../ai/lead.ts";
import type { LeadAdapter, LeadAdapterResult, LeadMetadata } from "./adapter.ts";
import { LocalDevelopmentLeadAdapter } from "./local-development-adapter.ts";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const REQUEST_TIMEOUT_MS = 10_000;
export const LEADS_TAB_NAME = "Leads";
export const LEADS_APPEND_RANGE = `${LEADS_TAB_NAME}!A:O`;

export type GoogleSheetsAdapterConfig = {
  sheetId: string;
  serviceAccountEmail: string;
  privateKey: string;
  tabName?: string;
};

export type LeadStorageErrorCode =
  | "INVALID_PRIVATE_KEY"
  | "AUTHENTICATION_FAILED"
  | "API_NOT_ENABLED"
  | "SPREADSHEET_NOT_FOUND"
  | "PERMISSION_DENIED"
  | "LEADS_TAB_NOT_FOUND"
  | "APPEND_FAILED"
  | "REQUEST_TIMEOUT";

export class LeadStorageError extends Error {
  readonly code: LeadStorageErrorCode;
  readonly status?: number;

  constructor(code: LeadStorageErrorCode = "APPEND_FAILED", status?: number) {
    super("Lead storage is temporarily unavailable.");
    this.name = "LeadStorageError";
    this.code = code;
    this.status = status;
  }
}

function clean(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) return trimmed.slice(1, -1).trim();
  return trimmed;
}

export function normalizeGooglePrivateKey(value: string): string {
  const withoutJsonComma = clean(value).replace(/,\s*$/, "");
  const normalized = clean(withoutJsonComma).replace(/\\n/g, "\n");
  const begin = normalized.indexOf("-----BEGIN PRIVATE KEY-----");
  const endMarker = "-----END PRIVATE KEY-----";
  const end = normalized.indexOf(endMarker);
  return begin >= 0 && end >= begin ? normalized.slice(begin, end + endMarker.length) : normalized;
}

export function hasGoogleSheetsCredentials(environment: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(clean(environment.GOOGLE_SHEET_ID) && clean(environment.GOOGLE_SERVICE_ACCOUNT_EMAIL) && normalizeGooglePrivateKey(environment.GOOGLE_PRIVATE_KEY ?? ""));
}

export function escapeSpreadsheetFormula(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /^\s*[=+\-@]/.test(text) ? `'${text}` : text;
}

export function leadToSheetRow(lead: StoredLead): string[] {
  return [
    lead.createdAt, lead.name, lead.phone, lead.visitorType, lead.selectedLanguage, lead.classLevel,
    lead.stream, lead.studentGender, lead.preferredCampus, lead.preferredTiming, lead.mainQuestion,
    lead.conversationSummary, lead.sourcePage, lead.consent ? "Yes" : "No", lead.status,
  ].map(escapeSpreadsheetFormula);
}

function base64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function createServiceAccountAssertion(email: string, privateKey: string, now = Date.now()): string {
  const issuedAt = Math.floor(now / 1_000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ iss: email, scope: GOOGLE_SHEETS_SCOPE, aud: GOOGLE_TOKEN_URL, iat: issuedAt, exp: issuedAt + 3_600 }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(privateKey, "base64url")}`;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function classifySheetsResponse(response: Response): Promise<LeadStorageError> {
  let reason = "";
  let message = "";
  try {
    const payload = (await response.json()) as { error?: { status?: unknown; message?: unknown; errors?: Array<{ reason?: unknown }> } | string };
    if (typeof payload.error === "string") reason = payload.error;
    else if (payload.error) {
      reason = typeof payload.error.errors?.[0]?.reason === "string" ? payload.error.errors[0].reason : typeof payload.error.status === "string" ? payload.error.status : "";
      message = typeof payload.error.message === "string" ? payload.error.message : "";
    }
  } catch {
    // HTTP status still produces a useful, secret-free code.
  }
  const normalized = `${reason} ${message}`.toLowerCase();
  if (/accessnotconfigured|api.+not.+enabled|sheets api.+disabled/.test(normalized)) return new LeadStorageError("API_NOT_ENABLED", response.status);
  if (/unable to parse range|requested entity was not found/.test(normalized)) return new LeadStorageError("LEADS_TAB_NOT_FOUND", response.status);
  if (response.status === 404) return new LeadStorageError("SPREADSHEET_NOT_FOUND", response.status);
  if (response.status === 403) return new LeadStorageError("PERMISSION_DENIED", response.status);
  return new LeadStorageError("APPEND_FAILED", response.status);
}

export class GoogleSheetsLeadAdapter implements LeadAdapter {
  private tokenCache: { value: string; expiresAt: number } | null = null;
  private readonly config: Required<GoogleSheetsAdapterConfig>;

  constructor(config: GoogleSheetsAdapterConfig) {
    this.config = {
      sheetId: clean(config.sheetId),
      serviceAccountEmail: clean(config.serviceAccountEmail),
      privateKey: normalizeGooglePrivateKey(config.privateKey),
      tabName: clean(config.tabName) || LEADS_TAB_NAME,
    };
  }

  private async accessToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now() + 60_000) return this.tokenCache.value;
    let assertion: string;
    try {
      assertion = createServiceAccountAssertion(this.config.serviceAccountEmail, this.config.privateKey);
    } catch {
      throw new LeadStorageError("INVALID_PRIVATE_KEY");
    }

    let response: Response;
    try {
      response = await fetchWithTimeout(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
      });
    } catch {
      throw new LeadStorageError("REQUEST_TIMEOUT");
    }
    if (!response.ok) {
      let errorName = "";
      try {
        const payload = (await response.json()) as { error?: unknown };
        errorName = typeof payload.error === "string" ? payload.error : "";
      } catch {
        // Do not expose the token endpoint response body.
      }
      throw new LeadStorageError(errorName === "invalid_grant" ? "INVALID_PRIVATE_KEY" : "AUTHENTICATION_FAILED", response.status);
    }
    const payload = (await response.json()) as { access_token?: unknown; expires_in?: unknown };
    if (typeof payload.access_token !== "string") throw new LeadStorageError("AUTHENTICATION_FAILED", response.status);
    const expiresIn = typeof payload.expires_in === "number" ? payload.expires_in : 3_600;
    this.tokenCache = { value: payload.access_token, expiresAt: Date.now() + expiresIn * 1_000 };
    return payload.access_token;
  }

  async submit(lead: StoredLead, metadata: LeadMetadata): Promise<LeadAdapterResult> {
    void metadata;
    const token = await this.accessToken();
    const range = encodeURIComponent(`${this.config.tabName}!A:O`);
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.config.sheetId)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
    let response: Response;
    try {
      response = await fetchWithTimeout(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ majorDimension: "ROWS", values: [leadToSheetRow(lead)] }),
      });
    } catch {
      throw new LeadStorageError("REQUEST_TIMEOUT");
    }
    if (!response.ok) throw await classifySheetsResponse(response);
    const payload = (await response.json()) as { updates?: { updatedRange?: unknown } };
    const referenceId = typeof payload.updates?.updatedRange === "string" ? payload.updates.updatedRange.slice(0, 120) : undefined;
    return { stored: true, provider: "google-sheets", ...(referenceId ? { referenceId } : {}) };
  }
}

export function createLeadAdapter(environment: NodeJS.ProcessEnv = process.env): { adapter: LeadAdapter; configured: boolean } {
  if (!hasGoogleSheetsCredentials(environment)) return { adapter: new LocalDevelopmentLeadAdapter(), configured: false };
  return {
    configured: true,
    adapter: new GoogleSheetsLeadAdapter({
      sheetId: environment.GOOGLE_SHEET_ID ?? "",
      serviceAccountEmail: environment.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "",
      privateKey: environment.GOOGLE_PRIVATE_KEY ?? "",
      tabName: LEADS_TAB_NAME,
    }),
  };
}
