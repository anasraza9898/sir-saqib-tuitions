import type { AssistantLanguage } from "./contracts.ts";

const injectionPatterns = [
  /\b(ignore|disregard|forget|override)\b[\s\S]{0,40}\b(previous|prior|above|system|developer|instructions?|rules?|prompt)\b/i,
  /\b(reveal|show|print|repeat|quote|display|leak|share)\b[\s\S]{0,45}\b(system|developer|hidden|internal|initial)\b[\s\S]{0,25}\b(prompt|instructions?|message|rules?)\b/i,
  /\b(system prompt|developer message|hidden instructions?|prompt injection|jailbreak|dan mode)\b/i,
  /<\/?(system|developer|assistant|instructions?)>/i,
  /\bact as\b[\s\S]{0,50}\b(without restrictions|unfiltered|developer|system)\b/i,
  /\b(api key|gemini_api_key|google_private_key|service account key)\b/i,
];

const abusivePatterns = [
  /\b(fuck|bitch|bastard|asshole|kill yourself)\b/i,
  /\b(hack|malware|ransomware|steal passwords?|credit card fraud)\b/i,
];

export function isPromptInjectionAttempt(input: string): boolean {
  const normalized = input.normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, " ");
  return injectionPatterns.some((pattern) => pattern.test(normalized));
}

export function isAbusiveOrDangerous(input: string): boolean {
  return abusivePatterns.some((pattern) => pattern.test(input));
}

export function promptDisclosureRefusal(language: AssistantLanguage): string {
  if (language === "roman-ur") {
    return "Main internal instructions ya secret information share nahin kar sakta. Jee, programmes, fees, campuses, timetables aur admission ke hawalay se guide kar sakta hoon.";
  }
  return "I can't share internal instructions or confidential configuration. I can help with Sir Saqib Tuitions programmes, fees, campuses, timetables and admissions.";
}
