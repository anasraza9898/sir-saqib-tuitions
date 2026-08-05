import { NextResponse } from "next/server";
import { buildConversationSummary, leadSubmissionSchema, normalizePakistanPhone, type Lead, type StoredLead } from "@/lib/ai/lead";
import { consumeRateLimit, getRequestClientId } from "@/lib/ai/rate-limit";
import { claimLeadSubmission, releaseLeadSubmission } from "@/lib/leads/duplicate-submission";
import { createLeadAdapter, LeadStorageError } from "@/lib/leads/google-sheets-adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_000;

type LeadErrorResponse = {
  ok: false;
  error: { code: string; message: string; retryable: boolean; fields?: Record<string, string>; developmentStatus?: "rejected" };
};

function developmentStatus<T extends "stored" | "demo" | "rejected">(status: T): { developmentStatus: T } | Record<string, never> {
  return process.env.NODE_ENV === "production" ? {} : { developmentStatus: status };
}

function errorResponse(
  code: string,
  message: string,
  status: number,
  retryable = false,
  fields?: Record<string, string>,
  headers?: HeadersInit,
) {
  return NextResponse.json<LeadErrorResponse>(
    { ok: false, error: { code, message, retryable, ...(fields ? { fields } : {}), ...developmentStatus("rejected") } },
    { status, headers },
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return errorResponse("PAYLOAD_TOO_LARGE", "The lead request is too large.", 413);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_JSON", "Send a valid JSON request.", 400);
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.trim().length > 0
  ) {
    return NextResponse.json({
      ok: true,
      data: { status: "rejected", stored: false, demo: true, message: "No storage action was performed.", ...developmentStatus("rejected") },
    });
  }

  const parsed = leadSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!fields[field]) fields[field] = issue.message;
    }
    return errorResponse("INVALID_LEAD", "Please review the highlighted details.", 400, false, fields);
  }

  if (!claimLeadSubmission(parsed.data.submissionId)) {
    return errorResponse("DUPLICATE_LEAD", "This admission enquiry has already been submitted.", 409);
  }

  const rateLimit = consumeRateLimit(`lead:${getRequestClientId(request)}`, 2, 60_000);
  if (!rateLimit.allowed) {
    releaseLeadSubmission(parsed.data.submissionId);
    return errorResponse(
      "LEAD_COOLDOWN",
      "Please wait before submitting another admission enquiry.",
      429,
      true,
      undefined,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  const normalizedPhone = normalizePakistanPhone(parsed.data.phone);
  if (!normalizedPhone) {
    releaseLeadSubmission(parsed.data.submissionId);
    return errorResponse("INVALID_LEAD", "Please enter a valid Pakistan mobile number.", 400, false, {
      phone: "Enter a valid Pakistan mobile number.",
    });
  }

  const { website, submissionId, ...validated } = parsed.data;
  void website;
  void submissionId;
  const lead: Lead = {
    ...validated,
    phone: normalizedPhone,
    conversationSummary: buildConversationSummary(validated),
    status: "New",
  };
  const storedLead: StoredLead = { ...lead, createdAt: new Date().toISOString() };
  const { adapter, configured } = createLeadAdapter();

  try {
    const result = await adapter.submit(storedLead, {
      source: "ai-admissions-assistant",
      submittedAt: storedLead.createdAt,
    });
    if (result.stored) {
      return NextResponse.json({
        ok: true,
        data: {
          status: "submitted",
          stored: true,
          demo: false,
          message: "Your admission enquiry was saved successfully. The admissions team can now follow up.",
          ...developmentStatus("stored"),
        },
      });
    }
    releaseLeadSubmission(parsed.data.submissionId);
    return NextResponse.json({
      ok: true,
      data: {
        status: "demo",
        stored: false,
        demo: true,
        message: "Your details are valid, but Google Sheets is not configured, so they were not stored. Please use WhatsApp for immediate follow-up.",
        ...developmentStatus("demo"),
      },
    });
  } catch (error) {
    releaseLeadSubmission(parsed.data.submissionId);
    if (process.env.NODE_ENV !== "production") {
      console.error("[Lead storage diagnostic]", {
        configured,
        code: error instanceof LeadStorageError ? error.code : "LEAD_STORAGE_FAILED",
        status: error instanceof LeadStorageError ? error.status ?? null : null,
      });
    }
    return errorResponse(
      "LEAD_STORAGE_FAILED",
      "We could not store your enquiry. Please try again or use WhatsApp for immediate follow-up.",
      502,
      true,
    );
  }
}
