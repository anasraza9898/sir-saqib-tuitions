import type { ChatMessage, LeadUpdate } from "./contracts.ts";
import { normalizePakistanPhone, sanitizeLeadUpdate } from "./lead.ts";

const romanNumerals: Record<string, string> = {
  "1": "I", "2": "II", "3": "III", "4": "IV", "5": "V", "6": "VI",
  "7": "VII", "8": "VIII", "9": "IX", "10": "X", "11": "XI", "12": "XII",
  i: "I", ii: "II", iii: "III", iv: "IV", v: "V", vi: "VI",
  vii: "VII", viii: "VIII", ix: "IX", x: "X", xi: "XI", xii: "XII",
};

const wordNumbers: Record<string, string> = {
  one: "1", first: "1",
  two: "2", second: "2",
  three: "3", third: "3",
  four: "4", fourth: "4",
  five: "5", fifth: "5",
  six: "6", sixth: "6",
  seven: "7", seventh: "7",
  eight: "8", eighth: "8",
  nine: "9", ninth: "9",
  ten: "10", tenth: "10",
  eleven: "11", eleventh: "11",
  twelve: "12", twelfth: "12",
};

export function normalizeVisitorText(text: string): string {
  let normalized = text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  normalized = normalized
    .replace(/\b(?:clss?|clas|cls|kls)\b/g, "class")
    .replace(/\b(?:fe+|fees|fess|fis|fesss)\b/g, "fee")
    .replace(/\b(?:tymings?|timngs?|timming|timeing)\b/g, "timing")
    .replace(/\b(?:schdule|shedule|schedul)\b/g, "schedule")
    .replace(/\b(?:boyz|boiz)\b/g, "boys")
    .replace(/\b(?:girlz|gurls)\b/g, "girls")
    .replace(/\b(?:camp|campas|campuss)\b/g, "campus")
    .replace(/\b(?:kaechs|kachs|kdaechs|k a e c h s)\b/g, "kaechs")
    .replace(/\b(?:btado|btao|bta do|btana|batado|batana|batae|batayein)\b/g, "batao")
    .replace(/\b(?:hy|hei|hn|hain|he)\b/g, "hai")
    .replace(/\b(?:exp|experiance|exprience)\b/g, "experience")
    .replace(/\b(?:whats app|watsapp|whatsap)\b/g, "whatsapp")
    .replace(/\b(?:dakhla|daakhla)\b/g, "admission");

  normalized = normalized.replace(
    /\b(one|first|two|second|three|third|four|fourth|five|fifth|six|sixth|seven|seventh|eight|eighth|nine|ninth|ten|tenth|eleven|eleventh|twelve|twelfth)\b/g,
    (value) => wordNumbers[value] ?? value,
  );

  const urduAliases = [
    [/السلام|سلام/u, " salam "],
    [/کلاس|جماعت/u, " class "],
    [/فیس|فیسیں/u, " fee "],
    [/داخلہ/u, " admission "],
    [/وقت|اوقات|ٹائم|ٹائمنگ|شیڈول/u, " timing "],
    [/کہاں|کدھر/u, " kahan "],
    [/لڑکا|بیٹا/u, " boy beta "],
    [/لڑکی|بیٹی/u, " girl beti "],
    [/سائنس/u, " science "],
    [/جنرل/u, " general "],
    [/کامرس/u, " commerce "],
    [/استاد|ٹیچر|فیکلٹی/u, " teacher faculty "],
    [/تجربہ/u, " experience "],
    [/قابلیت|تعلیم/u, " qualification "],
    [/نتیجہ|رزلٹ/u, " result "],
    [/ویڈیو/u, " video "],
    [/وین|ٹرانسپورٹ/u, " van transport "],
    [/آن لائن|آن لائن/u, " online "],
    [/رعایت|ڈسکاؤنٹ/u, " discount "],
    [/فون|نمبر|واٹس ایپ/u, " phone whatsapp "],
    [/دستاویز|کاغذات/u, " documents "],
    [/اتوار|سنڈے/u, " sunday "],
  ] as const;
  const aliases = urduAliases.flatMap(([pattern, alias]) => pattern.test(normalized) ? [alias] : []);
  return `${normalized} ${aliases.join(" ")}`.replace(/\s+/g, " ").trim();
}

export function inferClassLevel(text: string): string {
  const normalized = normalizeVisitorText(text);
  if (/\b(o[ -]?levels?|olevels?|igcse|caie|cambridge)\b/i.test(normalized)) return "O Levels";
  if (/\b(huffaz|hafiz|hifz)\b/i.test(normalized)) return "Huffaz Programme";
  if (/\bmatric\s+(?:first|1st|1)\s+year\b/i.test(normalized)) return "Grade IX";
  if (/\bmatric\s+(?:second|2nd|2)\s+year\b/i.test(normalized)) return "Grade X";
  if (/\b(?:inter|intermediate)\s+(?:first|1st|1)\s+year\b/i.test(normalized)) return "Grade XI";
  if (/\b(?:inter|intermediate)\s+(?:second|2nd|2)\s+year\b/i.test(normalized)) return "Grade XII";
  const match = normalized.match(/\b(?:class|grade|standard)\s*(1[0-2]|[1-9]|xii|xi|ix|x|viii|vii|vi|iv|v|iii|ii|i)(?:st|nd|rd|th)?\b/i)
    ?? normalized.match(/\b(1[0-2]|[1-9]|xii|xi|ix|x|viii|vii|vi|iv|v|iii|ii|i)(?:st|nd|rd|th)?\s+(?=me\b|mein\b|ki\b|ka\b|ke\b|science\b|general\b|commerce\b|fee\b|timing\b|timetable\b|schedule\b|class\b|student\b|hai\b)/i);
  const looseAcademicNumber = /\b(?:fee|timing|timetable|schedule|class|student|science|general|commerce)\b/i.test(normalized)
    ? normalized.match(/\b(1[0-2]|[1-9]|xii|xi|ix|x|viii|vii|vi|iv|iii|ii)(?:st|nd|rd|th)?\b/i)
    : null;
  const urduNumber = /[\u0600-\u06FF]/.test(text) ? normalized.match(/\b(1[0-2]|[1-9])(?:st|nd|rd|th)?\b/) : null;
  const resolved = match ?? looseAcademicNumber ?? urduNumber;
  if (!resolved) return "";
  const numeral = romanNumerals[resolved[1].toLowerCase()];
  return numeral ? `Grade ${numeral}` : "";
}

export type ConversationBehaviorState = {
  greeted: boolean;
  assistantGreetingCount: number;
  visitorNameAcknowledged: boolean;
  visitorNameUseCount: number;
};

function extractName(text: string): string {
  const patterns = [
    /\bmy name is\s+([\p{L}][\p{L} .'-]{1,50}?)(?=\s+(?:and|aur|from|se|here)\b|[,.!?]|$)/iu,
    /\bmy name\s+([\p{L}][\p{L} .'-]{1,50}?)(?=\s+(?:is|hai|hay|and|aur|from|se|here)\b|[,.!?]|$)/iu,
    /\b(?:mera|meri)\s+(?:naam|name)\s+(?:is|hai|hay|:)?\s*([\p{L}][\p{L} .'-]{1,50}?)(?=\s+(?:hai|hay|aur|se)\b|[,.!?]|$)/iu,
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
    const normalized = normalizeVisitorText(text);
    const update: LeadUpdate = {};
    const classLevel = inferClassLevel(text);
    if (classLevel) update.classLevel = classLevel;

    if (/\bpre[ -]?medical\b/i.test(normalized)) update.stream = "Pre-Medical";
    else if (/\bpre[ -]?engineering\b/i.test(normalized)) update.stream = "Pre-Engineering";
    else if (/\bgeneral science|computer(?: science)?|computing\b/i.test(normalized)) update.stream = "General Science";
    else if (/\bcommerce\b/i.test(normalized)) update.stream = "Commerce";
    else if (/\bgeneral\b/i.test(normalized)) update.stream = "General";
    else if (/\bscience\b/i.test(normalized)) update.stream = "Science";
    else if (/\b(?:sindh board|matric board)\b/i.test(normalized)) update.stream = "Sindh Board";
    else if (/\b(?:caie|cambridge)\b/i.test(normalized)) update.stream = "Cambridge/CAIE";

    if (/\b(?:girls? campus|girls?|female campus|beti|daughter|larki|girl student)\b/i.test(normalized)) {
      update.studentGender = "Girl";
      if (/\bcampus\b/i.test(normalized) || /^girls?\.?$/i.test(normalized.trim())) update.preferredCampus = "Girls Campus";
    } else if (/\b(?:boys? campus|boys?|male campus|beta|son|larka|boy student)\b/i.test(normalized)) {
      update.studentGender = "Boy";
      if (/\bcampus\b/i.test(normalized) || /^boys?\.?$/i.test(normalized.trim())) update.preferredCampus = "Boys Campus";
    }
    if (/\bhill[ -]?park(?: campus)?\b/i.test(normalized)) update.preferredCampus = "Hill Park Campus";

    if (/\b(?:my son|my daughter|mera beta|meri beti|my child|mere bach)\b/i.test(normalized)) update.visitorType = "Parent";
    else if (/\b(?:i am a student|i'm a student|main student|mein student|meri class|my class)\b/i.test(normalized)) update.visitorType = "Student";

    if (/\b(?:morning|subah)\b/i.test(normalized)) update.preferredTiming = "Morning";
    else if (/\b(?:afternoon|dopahar)\b/i.test(normalized)) update.preferredTiming = "Afternoon";
    else if (/\b(?:evening|shaam)\b/i.test(normalized)) update.preferredTiming = "Evening";
    else if (/\b(?:flexible|koi bhi timing)\b/i.test(normalized)) update.preferredTiming = "Flexible";

    const group = normalized.match(/\b(?:group|batch)\s*['"]?([ab])\b/i)?.[1]?.toUpperCase();
    if (group === "A" || group === "B") update.group = `Group ${group}`;

    const name = extractName(text);
    if (name) update.name = name;
    const phone = text.match(/(?:\+?92|0)?3\d(?:[\s().-]*\d){8}/)?.[0];
    if (phone && normalizePakistanPhone(phone)) update.phone = phone;

    const bareTeacherFollowUp = /\b(?:experience|qualification)\b/i.test(normalized)
      && !/\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(normalized);
    if (!bareTeacherFollowUp && (/\?|\b(?:fee|admission|campus|timing|class|programme|program|seat|document|van|online|teacher|faculty|sir saqib|qualification|experience|result|results|video|media|testimonial)\b/i.test(normalized))) {
      update.question = text;
    }
    state = { ...state, ...sanitizeLeadUpdate(update) };
  }

  return state;
}

export function extractConversationBehavior(messages: ChatMessage[], state: LeadUpdate = {}): ConversationBehaviorState {
  const assistantMessages = messages.filter((message) => message.role === "assistant").map((message) => message.content);
  const assistantGreetingCount = assistantMessages.filter((content) =>
    /\b(?:ass?alam|sala+m|welcome|khush aamdeed)\b/i.test(normalizeVisitorText(content)),
  ).length;
  const visitorName = state.name?.trim();
  const visitorNameUseCount = visitorName
    ? assistantMessages.filter((content) => new RegExp(`\\b${visitorName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(content)).length
    : 0;

  return {
    greeted: assistantGreetingCount > 0,
    assistantGreetingCount,
    visitorNameAcknowledged: visitorNameUseCount > 0,
    visitorNameUseCount,
  };
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
    state.group ? `Selected group/batch: ${state.group}` : "",
  ].filter(Boolean);
}

export function compactConversationBehavior(state: ConversationBehaviorState): string[] {
  return [
    `Already greeted by assistant: ${state.greeted ? "yes" : "no"}`,
    `Assistant greeting count: ${state.assistantGreetingCount}`,
    `Visitor name already acknowledged: ${state.visitorNameAcknowledged ? "yes" : "no"}`,
    `Assistant visitor-name use count: ${state.visitorNameUseCount}`,
  ];
}
