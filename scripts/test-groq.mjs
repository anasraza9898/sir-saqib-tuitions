import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const DEFAULT_MODEL = "openai/gpt-oss-20b";
const REQUEST_TIMEOUT_MS = 12_000;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function cleanEnvironmentValue(value, { removeWhitespace = false } = {}) {
  if (typeof value !== "string") return "";
  let cleaned = value.replace(/[\r\n]/g, "").trim();
  if (
    cleaned.length >= 2 &&
    ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'")))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return removeWhitespace ? cleaned.replace(/\s+/g, "") : cleaned;
}

function readStatus(error) {
  if (!error || typeof error !== "object") return undefined;
  for (const key of ["status", "statusCode", "code"]) {
    const value = error[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && /^\d{3}$/.test(value)) return Number(value);
  }
  return undefined;
}

function sanitizedCode(error) {
  const status = readStatus(error);
  const message = error instanceof Error ? error.message.toLowerCase() : String(error ?? "").toLowerCase();
  if (status === 401 || /invalid api key|authentication|unauthorized/.test(message)) return "INVALID_API_KEY";
  if (status === 403 || /permission|forbidden|not authorized/.test(message)) return "MODEL_PERMISSION_DENIED";
  if (status === 404 || /model.+not found|not found.+model|model.+unavailable|does not exist/.test(message)) return "MODEL_NOT_FOUND";
  if (status === 429 || /rate limit|too many requests/.test(message)) return "RATE_LIMITED";
  if (status === 408 || /timeout|timed out|aborterror|aborted/.test(message)) return "TIMEOUT";
  if (status && status >= 500) return "PROVIDER_UNAVAILABLE";
  return "INVALID_RESPONSE";
}

function debugFailure(stage, error, extra = "") {
  if (process.env.SST_GROQ_DEBUG !== "1") return;
  console.error(`debug stage=${stage} status=${readStatus(error) ?? "none"} code=${sanitizedCode(error)}${extra}`);
}

async function chatCompletion({ apiKey, model, messages, responseFormat }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages,
        response_format: responseFormat,
        reasoning_effort: "low",
        max_completion_tokens: 180,
        temperature: 0,
        stream: false,
      }),
    });
    if (!response.ok) {
      let details = response.statusText;
      try {
        const payload = await response.json();
        details = [payload?.error?.code, payload?.error?.type, payload?.error?.message].filter(Boolean).join(" ");
      } catch {
        // Status alone is enough for sanitized output.
      }
      throw Object.assign(new Error(details), { status: response.status, stage: "http" });
    }
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) throw Object.assign(new Error("Empty completion content."), { stage: "empty-content" });
    return content.trim();
  } finally {
    clearTimeout(timeout);
  }
}

const apiKey = cleanEnvironmentValue(process.env.GROQ_API_KEY, { removeWhitespace: true });
const model = cleanEnvironmentValue(process.env.GROQ_MODEL) || DEFAULT_MODEL;

console.log(`GROQ_API_KEY detected: ${Boolean(apiKey)}`);

if (!apiKey) {
  console.error("Groq API: FAIL INVALID_API_KEY");
  process.exitCode = 1;
} else {
  try {
    const text = await chatCompletion({
      apiKey,
      model,
      messages: [
        { role: "system", content: "Reply with exactly OK." },
        { role: "user", content: "Health check" },
      ],
    });
    if (!/ok/i.test(text)) throw Object.assign(new Error("Unexpected health-check response."), { stage: "health-content" });

    const structured = await chatCompletion({
      apiKey,
      model,
      responseFormat: { type: "json_object" },
      messages: [
        { role: "system", content: 'Return only a JSON object. Use exactly: {"message":"...","language":"en","intent":"other","needsClarification":false}.' },
        { role: "user", content: "Reply in JSON: Class 9 fee health check." },
      ],
    });
    const parsed = JSON.parse(structured);
    const debugShape = process.env.SST_GROQ_DEBUG === "1"
      ? ` keys=${Object.keys(parsed ?? {}).join(",")} messageType=${typeof parsed?.message} languageType=${typeof parsed?.language} intentType=${typeof parsed?.intent} clarificationType=${typeof parsed?.needsClarification}`
      : "";
    if (
      typeof parsed?.message !== "string" ||
      !parsed.message.trim() ||
      (parsed.language !== undefined && !["en", "roman-ur"].includes(parsed.language)) ||
      (parsed.intent !== undefined && typeof parsed.intent !== "string") ||
      (parsed.needsClarification !== undefined && typeof parsed.needsClarification !== "boolean")
    ) {
      throw Object.assign(new Error("Structured response did not match the expected shape."), { stage: "structured-shape", debugShape });
    }

    console.log("Groq API: OK");
    console.log(`Model: ${model}`);
    console.log("Structured response: OK");
  } catch (error) {
    debugFailure(error?.stage ?? "unknown", error, error?.debugShape ?? "");
    console.error(`Groq API: FAIL ${sanitizedCode(error)}`);
    process.exitCode = 1;
  }
}
