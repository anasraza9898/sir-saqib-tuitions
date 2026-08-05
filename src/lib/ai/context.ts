import type { ChatMessage, LeadUpdate } from "./contracts.ts";
import { normalizePakistanPhone, sanitizeLeadUpdate } from "./lead.ts";

const romanNumerals: Record<string, string> = {
  "1": "I", "2": "II", "3": "III", "4": "IV", "5": "V", "6": "VI",
  "7": "VII", "8": "VIII", "9": "IX", "10": "X", "11": "XI", "12": "XII",
  i: "I", ii: "II", iii: "III", iv: "IV", v: "V", vi: "VI",
  vii: "VII", viii: "VIII", ix: "IX", x: "X", xi: "XI", xii: "XII",
};

export function inferClassLevel(text: string): string {
  if (/\b(o[ -]?levels?|olevels?|igcse|caie)\b/i.test(text)) return "O Levels";
  if (/\b(huffaz|hafiz)\b/i.test(text)) return "Huffaz Programme";
  const match = text.match(/\b(?:clas{1,2}|grade)\s*(1[0-2]|[1-9]|xii|xi|ix|x|viii|vii|vi|iv|v|iii|ii|i)(?:st|nd|rd|th)?\b/i)
    ?? text.match(/\b(1[0-2]|[1-9]|xii|xi|ix|x|viii|vii|vi|iv|v|iii|ii|i)\s+(?=ki\b|ka\b|science\b|general\b|commerce\b|fee\b|fees\b|timing\b|timetable\b|class\b)/i);
  const urduNumber = /[\u0600-\u06FF]/.test(text) ? text.match(/\b(1[0-2]|[1-9])\b/) : null;
  const resolved = match ?? urduNumber;
  if (!resolved) return "";
  const numeral = romanNumerals[resolved[1].toLowerCase()];
  return numeral ? `Grade ${numeral}` : "";
}

function extractName(text: string): string {
  const patterns = [
    /\bmy name is\s+([\p{L}][\p{L} .'-]{1,50}?)(?=\s+(?:and|aur|from|se|here)\b|[,.!?]|$)/iu,
    /\b(?:mera|meri)\s+naam\s+(?:is|hai|:)?\s*([\p{L}][\p{L} .'-]{1,50}?)(?=\s+(?:hai|aur|se)\b|[,.!?]|$)/iu,
    /\bnaam\s*:\s*([\p{L}][\p{L} .'-]{1,50}?)(?=[,.!?]|$)/iu,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

/** Extracts only explicit facts; later turns intentionally override earlier ones. */
export function extractConversationState(messages: ChatMessage[], supplied: LeadUpdate = {}): LeadUpdate {
  let state = sanitizeLeadUpdate(supplied);

  for (const message of messages) {
    if (message.role !== "user") continue;
    const text = message.content;
    const update: LeadUpdate = {};
    const classLevel = inferClassLevel(text);
    if (classLevel) update.classLevel = classLevel;

    if (/\bscience\b/i.test(text)) update.stream = "Science";
    else if (/\bgeneral\b/i.test(text)) update.stream = "General";
    else if (/\bcommerce\b/i.test(text)) update.stream = "Commerce";
    else if (/\bcomputer(?: science)?\b/i.test(text)) update.stream = "Computer Science";
    else if (/\bpre[ -]?engineering\b/i.test(text)) update.stream = "Pre-Engineering";
    else if (/\b(?:sindh board|matric board)\b/i.test(text)) update.stream = "Sindh Board";
    else if (/\b(?:caie|cambridge)\b/i.test(text)) update.stream = "Cambridge/CAIE";

    if (/\b(?:girls? campus|female campus|beti|daughter|larki|girl student)\b/i.test(text)) {
      update.studentGender = "Girl";
      if (/\bcampus\b/i.test(text)) update.preferredCampus = "Girls Campus";
    } else if (/\b(?:boys? campus|male campus|beta|son|larka|boy student)\b/i.test(text)) {
      update.studentGender = "Boy";
      if (/\bcampus\b/i.test(text)) update.preferredCampus = "Boys Campus";
    }
    if (/\bhill[ -]?park(?: campus)?\b/i.test(text)) update.preferredCampus = "Hill Park Campus";

    if (/\b(?:my son|my daughter|mera beta|meri beti|my child|mere bach)\b/i.test(text)) update.visitorType = "Parent";
    else if (/\b(?:i am a student|i'm a student|main student|mein student|meri class|my class)\b/i.test(text)) update.visitorType = "Student";

    if (/\b(?:morning|subah)\b/i.test(text)) update.preferredTiming = "Morning";
    else if (/\b(?:afternoon|dopahar)\b/i.test(text)) update.preferredTiming = "Afternoon";
    else if (/\b(?:evening|shaam)\b/i.test(text)) update.preferredTiming = "Evening";
    else if (/\b(?:flexible|koi bhi timing)\b/i.test(text)) update.preferredTiming = "Flexible";

    const name = extractName(text);
    if (name) update.name = name;
    const phone = text.match(/(?:\+?92|0)?3\d(?:[\s().-]*\d){8}/)?.[0];
    if (phone && normalizePakistanPhone(phone)) update.phone = phone;

    if (/\?|\b(?:fee|admission|campus|timing|class|programme|program|seat|document|van|online)\b/i.test(text)) {
      update.question = text;
    }
    state = { ...state, ...sanitizeLeadUpdate(update) };
  }

  return state;
}

export function compactConversationState(state: LeadUpdate): string[] {
  return [
    state.name ? `Visitor name: ${state.name}` : "",
    state.visitorType ? `Visitor type: ${state.visitorType}` : "",
    state.classLevel ? `Class/programme: ${state.classLevel}` : "",
    state.stream ? `Stream/group: ${state.stream}` : "",
    state.studentGender ? `Student gender: ${state.studentGender}` : "",
    state.preferredCampus ? `Selected campus: ${state.preferredCampus}` : "",
    state.preferredTiming ? `Timing preference: ${state.preferredTiming}` : "",
  ].filter(Boolean);
}
