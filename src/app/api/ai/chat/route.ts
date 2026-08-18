import { NextResponse } from "next/server";
import { chatRequestSchema, type ApiErrorResponse, type ChatSuccessResponse } from "@/lib/ai/contracts";
import { getLocalAssistantResponse } from "@/lib/ai/fallback";
import {
  classifyGroqProviderError,
  generateGroqReply,
  getConfiguredGroqModelForDiagnostics,
  hasGroqApiKey,
  logGroqDevelopmentDiagnostic,
} from "@/lib/ai/groq";
import { consumeRateLimit, getRequestClientId } from "@/lib/ai/rate-limit";
import { isAbusiveOrDangerous, isPromptInjectionAttempt } from "@/lib/ai/safety";
import { extractConversationBehavior, extractConversationState } from "@/lib/ai/context";
import { selectRelevantKnowledge } from "@/lib/ai/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 24_000;

function errorResponse(
  code: string,
  message: string,
  status: number,
  retryable = false,
  headers?: HeadersInit,
  details?: { diagnostic?: string; model?: string },
) {
  return NextResponse.json<ApiErrorResponse>(
    { ok: false, error: { code, message, retryable, ...details } },
    { status, headers },
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse("PAYLOAD_TOO_LARGE", "The conversation is too large.", 413);
  }

  const rateLimit = consumeRateLimit(`chat:${getRequestClientId(request)}`, 20, 60_000);
  if (!rateLimit.allowed) {
    return errorResponse(
      "RATE_LIMITED",
      "Too many messages. Please wait a moment and try again.",
      429,
      true,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_JSON", "Send a valid JSON request.", 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("INVALID_REQUEST", "The conversation format is invalid.", 400);
  }

  const latest = parsed.data.messages.at(-1)!.content;
  const history = parsed.data.messages
    .slice(0, -1)
    .filter((message) => message.role === "user")
    .map((message) => message.content);
  const conversationState = extractConversationState(parsed.data.messages, parsed.data.leadState);
  const behaviorState = extractConversationBehavior(parsed.data.messages, conversationState);
  const relevantKnowledge = selectRelevantKnowledge(latest, conversationState);
  const keyAvailable = hasGroqApiKey();
  const deterministic = getLocalAssistantResponse(latest, history, parsed.data.language, conversationState, parsed.data.messages);

  if (isPromptInjectionAttempt(latest) || isAbusiveOrDangerous(latest)) {
    return NextResponse.json<ChatSuccessResponse>({
      ok: true,
      data: { ...deterministic, mode: "demo" },
    });
  }

  if (!keyAvailable) {
    return NextResponse.json<ChatSuccessResponse>(
      { ok: true, data: { ...deterministic, mode: "demo" } },
      { headers: { "X-AI-Fallback": "missing-configuration" } },
    );
  }

  try {
    const result = await generateGroqReply(parsed.data.messages, parsed.data.language, deterministic, {
      conversationState,
      behaviorState,
      relevantKnowledge,
    });
    return NextResponse.json<ChatSuccessResponse>({
      ok: true,
      data: {
        ...result.response,
        mode: "ai",
      },
    }, process.env.NODE_ENV === "production" ? undefined : {
      headers: {
        "X-AI-Provider": "groq",
        "X-AI-Model": result.model,
        "X-AI-Structured": String(result.structured),
      },
    });
  } catch (error) {
    const context = {
      model: getConfiguredGroqModelForDiagnostics(),
      hasApiKey: keyAvailable,
    };
    const classified = classifyGroqProviderError(error, context);
    logGroqDevelopmentDiagnostic(error, context, classified.code);
    return NextResponse.json<ChatSuccessResponse>(
      { ok: true, data: { ...deterministic, mode: "demo" } },
      { headers: { "X-AI-Fallback": "backup-guidance", "X-AI-Fallback-Reason": classified.code } },
    );
  }
}
