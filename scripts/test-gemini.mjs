import nextEnv from "@next/env";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const DEFAULT_MODEL = "gemini-3.6-flash";
const REQUEST_TIMEOUT_MS = 15_000;

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

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

function sanitizeMessage(error) {
  const raw = error instanceof Error ? error.message : String(error ?? "Unknown provider error");
  return raw
    .replace(/AIza[\w-]+/g, "[REDACTED_API_KEY]")
    .replace(/([?&](?:key|api_key)=)[^&\s]+/gi, "$1[REDACTED]")
    .replace(/(api[-_ ]?key\s*[:=]\s*)[^\s,;]+/gi, "$1[REDACTED]")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

function classify(error) {
  const status = readStatus(error);
  const message = sanitizeMessage(error).toLowerCase();
  if (status === 429 || /quota|resource_exhausted|rate limit/.test(message)) return "QUOTA_EXCEEDED";
  if (/api[_ -]?key[_ -]?invalid|invalid api key|api key not valid|authentication/.test(message)) return "INVALID_API_KEY";
  if (status === 401 || status === 403) return "INVALID_API_KEY";
  if (status === 408 || /timeout|timed out|aborterror/.test(message)) return "REQUEST_TIMEOUT";
  if (status === 404 || /model.+not found|not found.+model|not supported.+method|unsupported.+method/.test(message)) return "MODEL_NOT_FOUND";
  if (status && status >= 500) return "PROVIDER_UNAVAILABLE";
  return "PROVIDER_UNAVAILABLE";
}

function printFailure(api, model, error) {
  const status = readStatus(error);
  const statusText = status ? ` status=${status}` : "";
  console.error(`${api}: FAIL model=${model} code=${classify(error)}${statusText} message=${sanitizeMessage(error)}`);
}

function summarizeInteractionShape(response) {
  const steps = Array.isArray(response?.steps) ? response.steps : [];
  return JSON.stringify({
    status: typeof response?.status === "string" ? response.status : "unknown",
    outputTextType: typeof response?.output_text,
    stepTypes: steps.map((step) => (typeof step?.type === "string" ? step.type : "unknown")),
    contentTypes: steps.flatMap((step) =>
      Array.isArray(step?.content)
        ? step.content.map((content) => (typeof content?.type === "string" ? content.type : "unknown"))
        : [],
    ),
  });
}

const apiKey = cleanEnvironmentValue(process.env.GEMINI_API_KEY, { removeWhitespace: true });
const configuredModel = cleanEnvironmentValue(process.env.GEMINI_MODEL);
const model = configuredModel || DEFAULT_MODEL;

if (!apiKey) {
  console.error(`Gemini smoke test: FAIL model=${model} code=INVALID_CONFIGURATION message=GEMINI_API_KEY was not detected.`);
  process.exitCode = 1;
} else {
  const client = new GoogleGenAI({ apiKey, httpOptions: { timeout: REQUEST_TIMEOUT_MS } });
  let interactionSucceeded = false;
  let generateContentSucceeded = false;

  try {
    const response = await client.interactions.create(
      {
        model,
        input: "Reply with OK",
        system_instruction: "Reply only with OK.",
        store: false,
        generation_config: { max_output_tokens: 256, thinking_level: "minimal" },
      },
      { timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 },
    );
    interactionSucceeded = Boolean(response.output_text?.trim());
    if (interactionSucceeded) console.log(`Interactions: OK model=${model}`);
    else console.error(`Interactions: FAIL model=${model} code=PROVIDER_UNAVAILABLE message=Provider returned no text. shape=${summarizeInteractionShape(response)}`);
  } catch (error) {
    printFailure("Interactions", model, error);
  }

  try {
    const response = await client.models.generateContent({
      model,
      contents: "Reply with OK",
      config: {
        systemInstruction: "Reply only with OK.",
        maxOutputTokens: 256,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      },
    });
    generateContentSucceeded = Boolean(response.text?.trim());
    if (generateContentSucceeded) console.log(`generateContent: OK model=${model}`);
    else console.error(`generateContent: FAIL model=${model} code=PROVIDER_UNAVAILABLE message=Provider returned no text.`);
  } catch (error) {
    printFailure("generateContent", model, error);
  }

  if (!interactionSucceeded && !generateContentSucceeded) process.exitCode = 1;
}
