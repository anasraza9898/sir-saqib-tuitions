import {
  campuses,
  faculty,
  mediaItems,
  results2025,
  results2026,
  site,
  timetableSchedules,
  timetables,
} from "../../data/site.ts";
import type { AssistantIntent, LeadUpdate, RecommendedAction } from "./contracts.ts";
import { inferClassLevel, normalizeVisitorText } from "./context.ts";
import { resolveMediaResource, resolveResultResource, resolveTimetableResource } from "./resource-registry.ts";

export const academyRoutes = {
  timetables: "/timetables",
  results: "/results",
  media: "/media",
  contact: "/contact",
  campuses: "/campuses",
  courses: "/courses",
  faculty: "/faculty",
} as const;

export const verifiedFees = {
  admission: 1_000,
  gradesIVIII: 5_000,
  gradesIXX: 5_000,
  gradesXIXII: 6_000,
  huffaz: 5_000,
  oLevels: 8_000,
  siblingDiscountPercent: 10,
} as const;

export const enquiryHours = {
  days: "Monday to Saturday",
  boys: ["11:00 AM-1:00 PM", "4:00 PM-10:00 PM"],
  girls: ["3:00 PM-6:00 PM"],
  hillPark: ["4:00 PM-8:00 PM"],
  sunday: "Not confirmed",
} as const;

export const admissionsKnowledge = {
  identity: {
    name: site.name,
    tagline: site.tagline,
    admissionsPhone: site.admissionsPhone,
    whatsapp: site.whatsapp,
  },
  fees: verifiedFees,
  feePolicy: {
    sameAcrossCampuses: true,
    noSeparateCharges: ["registration", "admission form", "processing"],
    siblingDiscountAppliesTo: "monthly fees only",
    streamPricing: "Science, General and Commerce have the same monthly fee within the same class range.",
  },
  programmes: {
    gradesIVIII: "Available at all campuses",
    gradesIXX: ["Science", "General", "Sindh Board"],
    gradesXIXII: ["Pre-Medical", "Pre-Engineering", "General Science", "Commerce"],
    huffaz: "Available at all campuses",
    oLevels: "Available at all campuses; Cambridge/CAIE curriculum; all subjects offered",
    online: false,
    trialClasses: false,
  },
  admission: {
    completion: "A campus visit is required to complete admission.",
    documents: "There is no fixed confirmed document list.",
    seats: "Live seat availability must be confirmed.",
  },
  enquiryHours,
  campuses: campuses.map(({ id, name, phones, whatsapp, address }) => ({ id, name, phones: [...phones], whatsapp, address })),
  transport: {
    availability: "Van service is confirmed only in KAECHS.",
    charges: "Van charges and any other route must be confirmed from the campus.",
  },
  progress: "A weekly report is shared through parent meetings and a printed report.",
  strengths: [
    "qualified faculty", "high-yield notes", "secured environment", "good study space", "individual attention",
    "monthly assessments", "focused curriculum", "MTS system", "strict discipline", "mid-term examinations",
    "final-term examinations", "parent meetings", "preparation of compulsory subjects",
  ],
} as const;

export type IntentClassification = { intent: AssistantIntent; confidence: "high" | "medium" | "low" };

export type RelevantKnowledge = IntentClassification & {
  facts: string[];
  missingClarification: string[];
  recommendedAction: RecommendedAction;
};

function none(): RecommendedAction {
  return { type: "none", label: "", value: "" };
}

function route(label: string, value: string): RecommendedAction {
  return { type: "route", label, value };
}

function money(value: number): string {
  return `PKR ${value.toLocaleString("en-US")}`;
}

function gradeNumber(input: string): number | null {
  const classLevel = inferClassLevel(input);
  if (!classLevel.startsWith("Grade ")) return null;
  const roman: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };
  return roman[classLevel.slice(6)] ?? null;
}

export function monthlyFeeFor(input: string): number | null {
  const text = normalizeVisitorText(input);
  if (/\b(o[ -]?levels?|olevels?|igcse|caie|cambridge)\b/i.test(text)) return verifiedFees.oLevels;
  if (/\b(huffaz|hafiz|hifz)\b/i.test(text)) return verifiedFees.huffaz;
  const grade = gradeNumber(text);
  if (!grade) return null;
  if (grade <= 10) return verifiedFees.gradesIXX;
  return verifiedFees.gradesXIXII;
}

function hasIntroduction(input: string): boolean {
  if (/\b(?:my name(?: is)?|mera (?:naam|name)|meri (?:naam|name)|naam\s*:)\b/i.test(input)) return true;
  return /^(?:(?:hello|hi|sala+m|ass?alam)[,! ]+)?(?:i am|i'm)\s+[\p{L}][\p{L} .'-]{1,30}[.!]?$/iu.test(input)
    && !/\b(?:student|parent|guardian|interested|looking|asking)\b/i.test(input);
}

function classifyAdmissionsIntentLegacy(input: string, state: LeadUpdate = {}): IntentClassification {
  const text = input.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
  if (hasIntroduction(text)) return { intent: "introduction", confidence: "high" };
  if (/\b(?:ass?alam|sala+m|hello|hi|hey|aoa)\b/i.test(text) || /(?:السلام|سلام)/u.test(text)) return { intent: "greeting", confidence: "high" };
  if (/\b(?:panadol|medicine|dawai|doctor|tabiyat|medical|legal advice|lawyer|investment advice|stock tip|crypto tip)\b/i.test(text) || /[\u0600-\u06ff].*(?:دوا|طبیعت|ڈاکٹر)/u.test(text)) return { intent: "out_of_scope", confidence: "high" };
  if (/\bresult\b.{0,30}\b(?:video|clip|recording|watch)\b/i.test(text) || /\b(?:classroom|campus|academy|testimonial|sir saqib|introduction)\b.{0,30}\b(?:video|clip|recording|dikhao|show|watch)\b/i.test(text) || /\b(?:video|videos|media|testimonial)\b/i.test(text) || /\b(?:girls?|boys?|academy|campus)\b.{0,25}\bintroduction\b/i.test(text)) return { intent: "media", confidence: "high" };
  if (/\b(?:sibling|siblings|do bach|2 bach|discount|concession)\b/i.test(text)) return { intent: "sibling_discount", confidence: "high" };
  if (/\b(?:admission|dakhla|registration)\s*(?:fee|fees|charges)|\bone[- ]?time fee\b/i.test(text)) return { intent: "admission_fee", confidence: "high" };
  if (/\b(?:fee+s?|fess|charges|price|cost|total|starting total|first month)\b/i.test(text) || /فیس/u.test(text)) return { intent: "fee", confidence: "high" };
  if (/\b(?:enquiry|inquiry|office)\b.{0,25}\b(?:hours?|timings?|tymings?|open|close)\b/i.test(text) || /\b(?:campus timing|opening hours?|kab khulta|kab band)\b/i.test(text)) return { intent: "campus_enquiry_hours", confidence: "high" };
  if (/\b(?:timetable|time table|class schedule|class timings?|class tymings?|batch timings?|group [ab]|batch [ab])\b/i.test(text) || ((/\b(?:timings?|tymings?|schedule|waqt)\b/i.test(text)) && Boolean(inferClassLevel(text) || state.classLevel))) return { intent: "class_schedule", confidence: "high" };
  if (state.classLevel && /\b(?:boys?|girls?|hill[ -]?park|science|general|commerce|pre[ -]?medical|pre[ -]?engineering|batch [ab]|group [ab]|morning|evening|subah|shaam)\b/i.test(text)) return { intent: "class_schedule", confidence: "medium" };
  if (/\b(?:qualification|qualified|degree|parhai)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_qualification", confidence: "high" };
  if (/\b(?:experience|tajurba|years? teaching|kitne saal)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_experience", confidence: "high" };
  if (/\b(?:faculty|teachers?|instructors?|who teaches|parhata|parhati)\b/i.test(text)) return { intent: "faculty", confidence: "high" };
  if (/\b(?:subjects?|mazameen)\b/i.test(text)) return { intent: "subjects", confidence: "high" };
  if (/\b(?:board|curriculum|syllabus|caie|cambridge|sindh board)\b/i.test(text)) return { intent: "curriculum_board", confidence: "high" };
  if (/\b(?:results?|marks|position|achievement|high achievers?)\b/i.test(text)) return { intent: "results", confidence: "high" };
  if (/\b(?:documents?|paperwork|b[- ]?form|bay form|kaghaz|papers?)\b/i.test(text)) return { intent: "documents", confidence: "high" };
  if (/\b(?:trial|demo|free class)\b/i.test(text)) return { intent: "trial_class", confidence: "high" };
  if (/\b(?:van|transport|pick.?and.?drop|school bus|route service)\b/i.test(text)) return { intent: "van_service", confidence: "high" };
  if (/\b(?:route|gulshan|kaechs|kachs|area|ati|aati)\b/i.test(text) && state.question && /\b(?:van|transport|pick.?and.?drop|school bus|route service)\b/i.test(normalizeVisitorText(state.question))) return { intent: "van_service", confidence: "high" };
  if (/\b(?:online|remote|zoom)\b/i.test(text)) return { intent: "online_classes", confidence: "high" };
  if (/\b(?:seats?|vacanc(?:y|ies)|space available|full batch)\b/i.test(text)) return { intent: "seat_availability", confidence: "high" };
  if (/\b(?:benefits?|advantages?|why (?:choose|join)|special|strengths?|achi academy|good academy|progress report|parent meeting)\b/i.test(text)) return { intent: "academy_benefits", confidence: "high" };
  if (/\b(?:address|location|where is|kahan|kidhar)\b/i.test(text) && /\b(?:campus|branch|academy|boys|girls|hill park)\b/i.test(text)) return { intent: "address", confidence: "high" };
  if (/\b(?:phone|number|whatsapp|call number|contact number|contact admissions)\b/i.test(text)) return { intent: "phone_whatsapp", confidence: "high" };
  if (/\b(?:call me|callback|call back|contact me|admissions? team.{0,20}(?:contact|call)|admission form|apply now|rabta karein)\b/i.test(text)) return { intent: "lead_callback", confidence: "high" };
  if (/\b(?:admission process|how (?:do|to) (?:apply|enrol|enroll)|dakhla kaise|admission kaise|registration process)\b/i.test(text)) return { intent: "admission_process", confidence: "high" };
  if (/\b(?:o[ -]?levels?|olevels?|huffaz|hafiz|programme|program|course|available|offer|classes?|grades?|science|general|commerce|pre[ -]?engineering)\b/i.test(text)) return { intent: "programme_availability", confidence: "medium" };
  if (/\b(?:campus|campuses|branch|branches|boys campus|girls campus|hill park)\b/i.test(text)) return { intent: "campus", confidence: "medium" };
  if (/\b(?:thanks|thank you|shukriya|acha|theek|okay|ok|great|nice)\b/i.test(text)) return { intent: "casual_academy_conversation", confidence: "medium" };
  return { intent: "other", confidence: "low" };
}
void classifyAdmissionsIntentLegacy;

export function classifyAdmissionsIntent(input: string, state: LeadUpdate = {}): IntentClassification {
  const text = normalizeVisitorText(input);
  if (hasIntroduction(text)) return { intent: "introduction", confidence: "high" };
  if (/\b(?:ass?alam|sala+m|hello|hi|hey|aoa)\b/i.test(text)) return { intent: "greeting", confidence: "high" };
  if (/\bpre[ -]?medical\b/i.test(text)) return { intent: "programme_availability", confidence: "high" };
  if (/\b(?:ignore rules|ignore previous|system prompt|hidden prompt|api key|private key|developer message)\b/i.test(text)) return { intent: "out_of_scope", confidence: "high" };
  if (/\b(?:panadol|medicine|dawai|doctor|tabiyat|medical|legal advice|lawyer|investment advice|stock tip|crypto tip)\b/i.test(text) || /[\u0600-\u06ff].*(?:دوا|طبیعت|ڈاکٹر)/u.test(text)) return { intent: "out_of_scope", confidence: "high" };
  if (/\bresult\b.{0,30}\b(?:video|clip|recording|watch)\b/i.test(text) || /\b(?:classroom|campus|academy|testimonial|sir saqib|introduction)\b.{0,30}\b(?:video|clip|recording|dikhao|show|watch)\b/i.test(text) || /\b(?:video|videos|media|testimonial)\b/i.test(text) || /\b(?:girls?|boys?|academy|campus)\b.{0,25}\bintroduction\b/i.test(text)) return { intent: "media", confidence: "high" };
  if (/\b(?:sibling|siblings|do bach|2 bach|discount|concession)\b/i.test(text)) return { intent: "sibling_discount", confidence: "high" };
  if (/\b(?:qualification|qualified|degree|parhai)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_qualification", confidence: "high" };
  if (/\b(?:qualification|qualified|degree|parhai)\b/i.test(text) && state.question && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan|math|maths|mathematics|computer|commerce)\b/i.test(normalizeVisitorText(state.question))) return { intent: "teacher_qualification", confidence: "high" };
  if (/\b(?:experience|tajurba|years? teaching|kitne saal)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_experience", confidence: "high" };
  if (/\b(?:experience|tajurba|years? teaching|kitne saal)\b/i.test(text) && state.question && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan|math|maths|mathematics|computer|commerce)\b/i.test(normalizeVisitorText(state.question))) return { intent: "teacher_experience", confidence: "high" };
  if (/\b(?:faculty|teachers?|instructors?|who teaches|kon parhata|kaun parhata|parhata|parhati|teacher kon|kis sir)\b/i.test(text) || /\b(?:computer|math|maths|mathematics|commerce)\b.{0,30}\b(?:sir|teacher|faculty)\b/i.test(text)) return { intent: "faculty", confidence: "high" };
  if (/\b(?:admission|dakhla|registration)\s*(?:fee|fees|charges)|\bone[- ]?time fee\b/i.test(text)) return { intent: "admission_fee", confidence: "high" };
  if (/\b(?:fee|charges?|price|cost|total|starting total|first month|monthly|mahina|mahine|kitna|kitni|kitne|lete ho|charge)\b/i.test(text)) return { intent: "fee", confidence: "high" };
  if (/\b(?:yahi|dikhao|dikha|show|open|dekhna|dekhao)\b/i.test(text) && state.question && /\b(?:result|results|marks|position|achievement|high achievers?|topper)\b/i.test(normalizeVisitorText(state.question))) return { intent: "results", confidence: "high" };
  if (/\b(?:2025|2026|last year|previous|latest|wala)\b/i.test(text) && state.question && /\b(?:result|results|marks|position|achievement|high achievers?|topper)\b/i.test(normalizeVisitorText(state.question))) return { intent: "results", confidence: "high" };
  if (/\b(?:results?|marks|position|achievement|high achievers?|topper)\b/i.test(text)) return { intent: "results", confidence: "high" };
  if (/\b(?:sunday|itwar|aitwar)\b.{0,25}\b(?:open|khula|khulta|band|timing|hours?)\b/i.test(text) || /\b(?:enquiry|inquiry|office)\b.{0,25}\b(?:hours?|timing|open|close)\b/i.test(text) || /\b(?:campus timing|opening hours?|kab khulta|kab band)\b/i.test(text)) return { intent: "campus_enquiry_hours", confidence: "high" };
  if (/^(?:timing|schedule|time|waqt)\??$/i.test(text) || /\b(?:timetable|time table|class schedule|class timing|batch timing|batch ka time|batch kab|group [ab]|batch [ab]|kab class|class kab|kis waqt|waqt|schedule)\b/i.test(text) || /\b(?:uska|iska|same)\s+(?:timing|schedule|time|waqt)\b/i.test(text) || ((/\b(?:timing|schedule|time|waqt|kab)\b/i.test(text)) && Boolean(inferClassLevel(text) || state.classLevel))) return { intent: "class_schedule", confidence: "high" };
  if (state.classLevel && /\b(?:boys?|girls?|hill[ -]?park|science|general|commerce|pre[ -]?medical|pre[ -]?engineering|batch [ab]|group [ab]|morning|evening|subah|shaam|timing|kab)\b/i.test(text)) return { intent: "class_schedule", confidence: "medium" };
  if (/\b(?:qualification|qualified|degree|parhai)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_qualification", confidence: "high" };
  if (/\b(?:experience|tajurba|years? teaching|kitne saal)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_experience", confidence: "high" };
  if (/\b(?:faculty|teachers?|instructors?|who teaches|kon parhata|kaun parhata|parhata|parhati|teacher kon)\b/i.test(text)) return { intent: "faculty", confidence: "high" };
  if (/\b(?:subjects?|mazameen)\b/i.test(text)) return { intent: "subjects", confidence: "high" };
  if (/\b(?:board|curriculum|syllabus|caie|cambridge|sindh board)\b/i.test(text)) return { intent: "curriculum_board", confidence: "high" };
  if (/\b(?:yahi|dikhao|dikha|show|open|dekhna|dekhao)\b/i.test(text) && state.question && /\b(?:result|results|marks|position|achievement|high achievers?|topper)\b/i.test(normalizeVisitorText(state.question))) return { intent: "results", confidence: "high" };
  if (/\b(?:2025|2026|last year|previous|latest|wala)\b/i.test(text) && state.question && /\b(?:result|results|marks|position|achievement|high achievers?|topper)\b/i.test(normalizeVisitorText(state.question))) return { intent: "results", confidence: "high" };
  if (/\b(?:results?|marks|position|achievement|high achievers?|topper)\b/i.test(text)) return { intent: "results", confidence: "high" };
  if (/\b(?:documents?|paperwork|b[- ]?form|bay form|kaghaz|papers?)\b/i.test(text)) return { intent: "documents", confidence: "high" };
  if (/\b(?:trial|demo|free class)\b/i.test(text)) return { intent: "trial_class", confidence: "high" };
  if (/\b(?:van|transport|pick.?and.?drop|school bus|route service)\b/i.test(text)) return { intent: "van_service", confidence: "high" };
  if (/\b(?:route|gulshan|kaechs|kachs|area|ati|aati)\b/i.test(text) && state.question && /\b(?:van|transport|pick.?and.?drop|school bus|route service)\b/i.test(normalizeVisitorText(state.question))) return { intent: "van_service", confidence: "high" };
  if (/\b(?:online|remote|zoom)\b/i.test(text)) return { intent: "online_classes", confidence: "high" };
  if (/\b(?:seats?|vacanc(?:y|ies)|space available|full batch)\b/i.test(text)) return { intent: "seat_availability", confidence: "high" };
  if (/\b(?:benefits?|advantages?|why (?:choose|join)|special|strengths?|achi academy|good academy|progress report|parent meeting|report milti|tests hote|discipline)\b/i.test(text)) return { intent: "academy_benefits", confidence: "high" };
  if (state.preferredCampus && /\b(?:address|location|where|kahan|kidhar)\b/i.test(text)) return { intent: "address", confidence: "high" };
  if (/\b(?:address|location|where is|kahan|kidhar)\b/i.test(text) && /\b(?:campus|branch|academy|boys|girls|hill park)\b/i.test(text)) return { intent: "address", confidence: "high" };
  if (/\b(?:phone|number|whatsapp|call number|contact number|contact admissions)\b/i.test(text)) return { intent: "phone_whatsapp", confidence: "high" };
  if (/\b(?:call me|callback|call back|contact me|contact karwa|admissions? team.{0,20}(?:contact|call)|admission form|apply now|join karna|seat book|rabta karein)\b/i.test(text)) return { intent: "lead_callback", confidence: "high" };
  if (/\b(?:admission process|how (?:do|to) (?:apply|enrol|enroll)|dakhla kaise|admission kaise|registration process)\b/i.test(text)) return { intent: "admission_process", confidence: "high" };
  if (/\b(?:o[ -]?levels?|olevels?|huffaz|hafiz|programme|program|course|available|offer|classes?|grades?|science|general|commerce|pre[ -]?engineering)\b/i.test(text)) return { intent: "programme_availability", confidence: "medium" };
  if (/\b(?:boys?|girls?|wali|wala)\b/i.test(text) && state.question && /\b(?:video|media|testimonial|classroom|campus)\b/i.test(normalizeVisitorText(state.question))) return { intent: "media", confidence: "medium" };
  if ((state.studentGender || state.preferredCampus) && /\b(?:campus|branch)\b/i.test(text)) return { intent: "campus", confidence: "medium" };
  if (/\b(?:campus|campuses|branch|branches|boys campus|girls campus|hill park)\b/i.test(text)) return { intent: "campus", confidence: "medium" };
  if (/\b(?:thanks|thank you|shukriya|acha|theek|okay|ok|great|nice|samajh gaya)\b/i.test(text)) return { intent: "casual_academy_conversation", confidence: "medium" };
  return { intent: "other", confidence: "low" };
}

function classText(state: LeadUpdate, input: string): string {
  return inferClassLevel(input) || state.classLevel || "";
}

function streamText(state: LeadUpdate, input: string): string {
  const text = normalizeVisitorText(input);
  if (/\bpre[ -]?medical\b/i.test(text)) return "Pre-Medical";
  if (/\bpre[ -]?engineering\b/i.test(text)) return "Pre-Engineering";
  if (/\bgeneral science|computer(?: science)?|computing\b/i.test(text)) return "General Science";
  if (/\bcommerce\b/i.test(text)) return "Commerce";
  if (/\bgeneral\b/i.test(text)) return "General";
  if (/\bscience\b/i.test(text)) return "Science";
  return state.stream ?? "";
}

function timetableKnowledge(input: string, state: LeadUpdate): Pick<RelevantKnowledge, "facts" | "missingClarification" | "recommendedAction"> {
  const text = normalizeVisitorText(input);
  const classLevel = classText(state, input).replace(/^Grade /, "");
  const romanToNumber: Record<string, string> = { IX: "9", X: "10", XI: "11", XII: "12" };
  const classNumber = romanToNumber[classLevel] ?? "";
  const stream = streamText(state, input);
  const campusKnown = Boolean(state.preferredCampus) || /\b(?:boys?|girls?|hill[ -]?park)\b/i.test(text);
  const group = text.match(/\b(?:group|batch)\s*['\"]?([ab])\b/i)?.[1]?.toUpperCase() ?? "";
  const stateGroup = state.group?.match(/\b([AB])\b/)?.[1] ?? "";
  const selectedGroup = group || stateGroup;
  const wantsMorning = /\b(?:morning|subah)\b/i.test(text);
  const wantsEvening = /\b(?:evening|shaam)\b/i.test(text);
  const missing: string[] = [];
  if (!classNumber) missing.push("class (IX, X, XI or XII)");
  if (classNumber && !campusKnown && !stream && !group && !wantsMorning && !wantsEvening) missing.push("campus/gender (Boys or Girls)");
  if (!stream) missing.push("programme (General, Science or Commerce)");

  let candidates = timetables.filter((item) =>
    (!classNumber || item.classLevel === classNumber) &&
    (!stream || item.stream.toLowerCase() === stream.toLowerCase()),
  );
  if (selectedGroup) candidates = candidates.filter((item) => item.variant.toLowerCase() === `group ${selectedGroup.toLowerCase()}`);
  if (wantsMorning) candidates = candidates.filter((item) => /morning/i.test(item.variant));
  if (wantsEvening) candidates = candidates.filter((item) => /evening/i.test(item.variant));

  if (!missing.length && candidates.length > 1 && !selectedGroup && !wantsMorning && !wantsEvening) {
    missing.push(`batch/timing (${candidates.map((item) => item.variant).join(" or ")})`);
  }
  if (!missing.length && candidates.length === 0) {
    return {
      facts: ["No verified current timetable slot matches all supplied filters. Do not invent a schedule; offer campus confirmation."],
      missingClarification: [],
      recommendedAction: route("Open timetable finder", academyRoutes.timetables),
    };
  }
  if (missing.length) {
    const known = [classNumber ? `Class ${classNumber}` : "", state.preferredCampus, stream].filter(Boolean).join(", ");
    const matchingOptions = candidates.length ? [...new Set(candidates.map((item) => item.variant))].join(", ") : "";
    return {
      facts: [
        known ? `Known timetable filters: ${known}.` : "The visitor is asking for a class timetable, not campus enquiry hours.",
        matchingOptions ? `Matching official timetable variants: ${matchingOptions}.` : "Official timetable posters are filtered by class, programme and available variant.",
      ],
      missingClarification: missing,
      recommendedAction: route("View timetables", academyRoutes.timetables),
    };
  }

  const selected = candidates[0];
  const query = new URLSearchParams({ class: selected.classLevel, stream: selected.stream.toLowerCase(), batch: selected.id });
  const schedule = timetableSchedules[selected.id];
  const facts = [`Official timetable poster: Grade ${selected.grade}, ${selected.stream}, ${selected.variant}.`];
  if (schedule) {
    facts.push(...schedule.map((day) => {
      const slots = day.slots.map((slot) => `${slot.start}-${slot.end} ${slot.subject}`).join("; ");
      return `${day.day}: ${slots || day.note}${slots && day.note ? `; ${day.note}` : ""}.`;
    }));
  } else {
    facts.push("Updated structured timetable text has not been installed. Do not quote old timing information or infer timings from images.");
  }
  return {
    facts,
    missingClarification: [],
    recommendedAction: route(selected.variant.startsWith("Group ") ? `Open ${selected.variant} Timetable` : "Open exact timetable", `${academyRoutes.timetables}?${query.toString()}`),
  };
}

function matchingCampus(input: string) {
  const text = normalizeVisitorText(input);
  if (/\bgirls?\b/i.test(text)) return campuses.find((campus) => campus.id === "girls");
  if (/\bboys?\b/i.test(text)) return campuses.find((campus) => campus.id === "boys");
  if (/\bhill[ -]?park\b/i.test(text)) return campuses.find((campus) => campus.id === "hill-park");
  return undefined;
}

function requestedUnknownFacultySubject(input: string): string {
  const text = normalizeVisitorText(input);
  const subjects = ["physics", "chemistry", "biology", "english", "urdu", "islamiat", "pakistan studies"];
  return subjects.find((subject) => text.includes(subject)) ?? "";
}

function matchingFaculty(input: string) {
  const text = normalizeVisitorText(input);
  if (/\b(?:sir )?saqib\b/i.test(text)) return [faculty[0]];
  if (/\b(?:math|maths|mathematics)\b/i.test(text)) return faculty.filter((member) => member.field === "Mathematics");
  if (/\b(?:computer science|computing)\b/i.test(text)) return faculty.filter((member) => member.field === "Computer Science");
  if (/\b(?:commerce|accounting)\b/i.test(text)) return faculty.filter((member) => member.field === "Commerce");
  return faculty.filter((member) => {
    const tokens = member.name.toLowerCase().replace(/\b(?:sir|miss|eng)\.?\b/g, "").trim().split(/\s+/);
    return tokens.some((token) => token.length > 3 && text.includes(token));
  });
}

function selectSingleRelevantKnowledge(input: string, state: LeadUpdate = {}): RelevantKnowledge {
  const text = normalizeVisitorText(input);
  const classification = classifyAdmissionsIntent(input, state);
  const base = { ...classification, facts: [] as string[], missingClarification: [] as string[], recommendedAction: none() };
  const currentClass = classText(state, input);
  const combinedClass = `${text} ${currentClass}`;

  switch (classification.intent) {
    case "greeting":
    case "introduction":
    case "casual_academy_conversation":
      return base;
    case "fee": {
      const monthly = monthlyFeeFor(combinedClass);
      const starting = /\b(?:start|starting|first month|initial|total)\b/i.test(text);
      if (monthly) {
        base.facts.push(`Monthly fee for ${currentClass || "the selected programme"}: ${money(monthly)}.`);
        base.facts.push(`One-time admission fee: ${money(verifiedFees.admission)}.`);
        if (starting) base.facts.push(`Verified initial total: ${money(monthly + verifiedFees.admission)}; later months carry the monthly fee only.`);
      } else {
        const wantsClassClarification = /\b(?:a class|kisi class|for a class)\b/i.test(text) || text.split(/\s+/).length <= 3;
        if (wantsClassClarification) {
          base.facts.push(`One-time admission fee for every programme: ${money(verifiedFees.admission)}.`);
          base.missingClarification.push("class or programme for the monthly fee");
        } else {
          base.facts.push(`Monthly fees: Grades I-X ${money(verifiedFees.gradesIXX)}; Grades XI-XII ${money(verifiedFees.gradesXIXII)}; Huffaz ${money(verifiedFees.huffaz)}; O Levels ${money(verifiedFees.oLevels)}.`);
          base.facts.push(`One-time admission fee: ${money(verifiedFees.admission)}.`);
        }
      }
      if (/\b(?:same|different|campus|science|general|commerce|stream)\b/i.test(text)) {
        base.facts.push("Fees are the same at every campus; Science, General and Commerce cost the same within a class range.");
      }
      return base;
    }
    case "admission_fee":
      base.facts.push(`One-time admission fee: ${money(verifiedFees.admission)}. There is no separate registration, admission-form or processing charge.`);
      return base;
    case "sibling_discount":
      base.facts.push("Sibling discount is 10% on monthly fees only; it does not apply to the one-time admission fee.");
      return base;
    case "class_schedule":
    case "timetable": {
      const resource = resolveTimetableResource(input, state);
      if (resource) {
        return {
          ...base,
          facts: resource.facts,
          missingClarification: [],
          recommendedAction: resource.recommendedAction,
        };
      }
      return { ...base, ...timetableKnowledge(input, state) };
    }
    case "campus_enquiry_hours": {
      const campus = matchingCampus(input);
      if (/\b(?:sunday|itwar|aitwar)\b/i.test(text)) {
        base.facts.push("Sunday enquiry hours are not confirmed and must be checked with the campus.");
        base.recommendedAction = { type: "whatsapp", label: "Confirm Sunday hours", value: site.whatsapp };
      } else if (campus?.id === "boys") base.facts.push("Boys Campus enquiry hours Monday-Saturday: 11:00 AM-1:00 PM and 4:00 PM-10:00 PM.");
      else if (campus?.id === "girls") base.facts.push("Girls Campus enquiry hours Monday-Saturday: 3:00 PM-6:00 PM.");
      else if (campus?.id === "hill-park") base.facts.push("Hill Park Campus enquiry hours Monday-Saturday: 4:00 PM-8:00 PM.");
      else base.facts.push("Monday-Saturday enquiry hours: Boys 11:00 AM-1:00 PM and 4:00 PM-10:00 PM; Girls 3:00 PM-6:00 PM; Hill Park 4:00 PM-8:00 PM. Sunday is not confirmed.");
      return base;
    }
    case "programme_availability": {
      const grade = gradeNumber(combinedClass);
      if (/\b(?:o[ -]?levels?|olevels?|igcse|caie|cambridge)\b/i.test(combinedClass)) base.facts.push("O Levels is available at all campuses with Cambridge/CAIE curriculum and all subjects offered.");
      else if (/\b(?:huffaz|hafiz|hifz)\b/i.test(combinedClass)) base.facts.push("The Huffaz Programme is available at all campuses.");
      else if (grade && grade <= 8) base.facts.push(`Grade ${grade} foundation tuition is available at all campuses.`);
      else if (grade && grade <= 10) base.facts.push(`Grade ${grade} offers Science, General and Sindh Board.`);
      else if (grade) base.facts.push(`Grade ${grade} offers XI-XII Pre-Medical, Pre-Engineering, General Science and Commerce pathways.`);
      else base.facts.push("Programmes: Grades I-VIII foundation and Huffaz at all campuses; Grades IX-X Science and General; Grades XI-XII Pre-Medical, Pre-Engineering, General Science and Commerce.");
      base.recommendedAction = route("Explore programmes", academyRoutes.courses);
      return base;
    }
    case "subjects":
      if (/\b(?:o[ -]?levels?|caie|cambridge)\b/i.test(combinedClass)) base.facts.push("All subjects are offered for O Levels under Cambridge/CAIE.");
      else base.facts.push("The verified programme data names stream/group coverage but does not provide a complete subject-by-class list. Do not invent individual subjects; refer to the Courses page or admissions.");
      base.recommendedAction = route("View courses", academyRoutes.courses);
      return base;
    case "curriculum_board":
      if (/\b(?:o[ -]?levels?|caie|cambridge)\b/i.test(combinedClass)) base.facts.push("O Levels follows Cambridge/CAIE and all subjects are offered.");
      else if ([9, 10].includes(gradeNumber(combinedClass) ?? 0)) base.facts.push("Grades IX-X offer Science, General and Sindh Board; this is not the Cambridge/CAIE O Levels programme.");
      else if ([11, 12].includes(gradeNumber(combinedClass) ?? 0)) base.facts.push("Grades XI-XII offer Pre-Medical, Pre-Engineering, General Science and Commerce.");
      else base.facts.push("Grades IX-X offer Science and General; Grades XI-XII offer Pre-Medical, Pre-Engineering, General Science and Commerce. O Levels separately follows Cambridge/CAIE.");
      return base;
    case "faculty":
    case "teacher_qualification":
    case "teacher_experience": {
      const facultyContext = `${input} ${state.question ?? ""}`;
      const matched = matchingFaculty(facultyContext);
      const unknownSubject = matched.length ? "" : requestedUnknownFacultySubject(facultyContext);
      const members = matched.length ? matched : unknownSubject ? [] : faculty;
      if (unknownSubject) {
        base.facts.push(`No verified teacher assignment is available for ${unknownSubject}. Do not invent who teaches it; offer admissions or the Faculty page for confirmation.`);
      }
      base.facts.push(...members.map((member) => `${member.name}: ${member.qualification}; ${member.experience} years experience; verified field ${member.field}.`));
      base.facts.push("The verified roster gives fields, not specific class/subject assignments; do not invent teaching assignments.");
      base.recommendedAction = route("View faculty", academyRoutes.faculty);
      return base;
    }
    case "campus":
    case "address": {
      const campus = matchingCampus(input) ?? campuses.find((item) => item.name === state.preferredCampus);
      const selected = campus ? [campus] : campuses;
      base.facts.push(...selected.map((item) => `${item.name}: ${item.address}. Phones: ${item.phones.join(" / ")}.`));
      base.recommendedAction = route("View campus details", academyRoutes.campuses);
      return base;
    }
    case "phone_whatsapp":
      base.facts.push(`Main admissions Call/WhatsApp: ${site.admissionsPhone}. Campus-specific numbers are available on the Campuses page.`);
      base.recommendedAction = { type: "whatsapp", label: "WhatsApp admissions", value: site.whatsapp };
      return base;
    case "admission_process":
      base.facts.push("Admission completion requires a campus visit. Do not imply that admission is completed entirely in chat or online.");
      base.recommendedAction = route("View contact options", academyRoutes.contact);
      return base;
    case "documents":
      base.facts.push("There is no fixed confirmed admission document list. Current requirements must be confirmed through WhatsApp or a campus visit.");
      base.recommendedAction = { type: "whatsapp", label: "Confirm documents", value: site.whatsapp };
      return base;
    case "trial_class":
      base.facts.push("Trial and demo classes are not available.");
      return base;
    case "van_service":
      base.facts.push("Van service is confirmed only within KAECHS. Gulshan or any other route, and all van charges, must be confirmed with the campus.");
      base.recommendedAction = { type: "whatsapp", label: "Confirm van route", value: site.whatsapp };
      return base;
    case "online_classes":
      base.facts.push("Online classes are not available; classes are held on campus.");
      return base;
    case "results":
      {
        const resource = resolveResultResource(input, state);
        base.facts.push(...resource.facts);
        base.recommendedAction = resource.recommendedAction;
      }
      if (/\b2025\b/.test(text)) base.facts.push(`Verified 2025 result poster categories: ${results2025.map((item) => item.title).join(", ")}.`);
      else base.facts.push(`Latest verified 2026 result poster categories: ${results2026.map((item) => item.title).join(", ")}.`);
      base.facts.push("Past results do not guarantee future marks or positions; no marks or ranking may be invented.");
      return base;
    case "media": {
      const resource = resolveMediaResource(input, state);
      if (resource) {
        base.facts.push(...resource.facts);
        base.recommendedAction = resource.recommendedAction;
        return base;
      }
      const mediaText = normalizeVisitorText(`${input} ${state.question ?? ""}`);
      const matched = mediaItems.filter((item) => {
        if (/\bclassroom\b/i.test(mediaText)) return item.id === "classroom-learning" || item.id === "boys-campus";
        if (/\b(?:sir saqib|introduction|academy intro)\b/i.test(mediaText)) return item.id === "academy-introduction";
        if (/\btestimonial|student voice\b/i.test(mediaText)) return item.id === "student-voices";
        if (/\bresults?\b/i.test(mediaText)) return item.id === "results-2026";
        if (/\bgirls?\b/i.test(mediaText)) return item.id === "girls-campus";
        if (/\bboys?\b/i.test(mediaText)) return item.id === "boys-campus";
        return true;
      });
      base.facts.push(...matched.map((item) => `Available media: ${item.title} (${item.category}, ${item.duration}) on the Media page.`));
      base.recommendedAction = route("Watch media", academyRoutes.media);
      return base;
    }
    case "academy_benefits":
      base.facts.push(`Verified academy strengths: ${admissionsKnowledge.strengths.join(", ")}.`);
      base.facts.push(admissionsKnowledge.progress);
      return base;
    case "seat_availability":
      base.facts.push("Seat availability is live and must be confirmed; never claim that a seat is available.");
      base.recommendedAction = { type: "whatsapp", label: "Confirm seat availability", value: site.whatsapp };
      return base;
    case "lead_callback":
      base.facts.push("A guided contact form may be offered. It may only submit after valid required fields and explicit consent; chat text alone is never stored as a lead.");
      base.recommendedAction = { type: "lead_form", label: "Open contact form", value: "" };
      return base;
    case "out_of_scope":
      base.facts.push("Do not provide medical, legal or financial advice. Briefly decline and offer academy-related help.");
      return base;
    default:
      return base;
  }
}

function addUnique(target: string[], items: string[]): void {
  for (const item of items) {
    if (item && !target.includes(item)) target.push(item);
  }
}

function mergeSecondaryContext(base: RelevantKnowledge, input: string, state: LeadUpdate): RelevantKnowledge {
  const text = normalizeVisitorText(input);
  const result: RelevantKnowledge = {
    ...base,
    facts: [...base.facts],
    missingClarification: [...base.missingClarification],
    recommendedAction: base.recommendedAction,
  };
  const setActionIfEmpty = (action: RecommendedAction) => {
    if (result.recommendedAction.type === "none" && action.type !== "none") result.recommendedAction = action;
  };
  const primary = base.intent;

  if (primary !== "fee" && /\b(?:fee|charges?|price|cost|monthly|kitna|kitni|kitne|first month|total)\b/i.test(text)) {
    const monthly = monthlyFeeFor(`${text} ${state.classLevel ?? ""}`);
    if (monthly) {
      addUnique(result.facts, [
        `Monthly fee for ${classText(state, input) || "the selected programme"}: ${money(monthly)}.`,
        `One-time admission fee: ${money(verifiedFees.admission)}.`,
      ]);
    } else {
      addUnique(result.missingClarification, ["class or programme for the monthly fee"]);
    }
  }

  if (primary !== "admission_fee" && /\b(?:admission|dakhla)\s*(?:fee|charges?)|\bone[- ]?time fee\b/i.test(text)) {
    addUnique(result.facts, [`One-time admission fee: ${money(verifiedFees.admission)}. There is no separate registration, admission-form or processing charge.`]);
  }

  if (primary !== "class_schedule" && primary !== "timetable" && /\b(?:timetable|time table|class timing|batch timing|group [ab]|batch [ab]|schedule|waqt|kis waqt|kab class)\b/i.test(text)) {
    const timetable = timetableKnowledge(input, state);
    addUnique(result.facts, timetable.facts);
    addUnique(result.missingClarification, timetable.missingClarification);
    setActionIfEmpty(timetable.recommendedAction);
  }

  if (primary !== "van_service" && /\b(?:van|transport|pick.?and.?drop|school bus|route service)\b/i.test(text)) {
    addUnique(result.facts, ["Van service is confirmed only within KAECHS. Gulshan or any other route, and all van charges, must be confirmed with the campus."]);
    setActionIfEmpty({ type: "whatsapp", label: "Confirm van route", value: site.whatsapp });
  }

  if (primary !== "online_classes" && /\b(?:online|remote|zoom)\b/i.test(text)) {
    addUnique(result.facts, ["Online classes are not available; classes are held on campus."]);
  }

  if (primary !== "sibling_discount" && /\b(?:sibling|siblings|do bach|2 bach|discount|concession)\b/i.test(text)) {
    addUnique(result.facts, ["Sibling discount is 10% on monthly fees only; it does not apply to the one-time admission fee."]);
  }

  if (primary !== "documents" && /\b(?:documents?|paperwork|b[- ]?form|bay form|kaghaz|papers?)\b/i.test(text)) {
    addUnique(result.facts, ["There is no fixed confirmed admission document list. Current requirements must be confirmed through WhatsApp or a campus visit."]);
    setActionIfEmpty({ type: "whatsapp", label: "Confirm documents", value: site.whatsapp });
  }

  return result;
}

export function selectRelevantKnowledge(input: string, state: LeadUpdate = {}): RelevantKnowledge {
  return mergeSecondaryContext(selectSingleRelevantKnowledge(input, state), input, state);
}

export function formatRelevantKnowledge(context: RelevantKnowledge): string {
  const lines = [
    `Detected intent (context selection only): ${context.intent}; confidence: ${context.confidence}.`,
    ...context.facts.map((fact) => `- ${fact}`),
  ];
  if (context.missingClarification.length) {
    lines.push(`Smallest missing clarification: ${context.missingClarification.join(", ")}. Ask one compact question that covers only these missing discriminators.`);
  }
  if (context.recommendedAction.type !== "none") {
    lines.push(`Verified recommended action: type=${context.recommendedAction.type}; label="${context.recommendedAction.label}"; value="${context.recommendedAction.value}".`);
  }
  if (!context.facts.length) lines.push("No academy fact block is needed for this conversational turn.");
  return lines.join("\n");
}
