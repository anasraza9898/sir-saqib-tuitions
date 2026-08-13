import { z } from "zod";
import type { AssistantLanguage, LeadUpdate } from "./contracts.ts";

export const LEAD_CLASS_LEVELS = [
  "Grade I",
  "Grade II",
  "Grade III",
  "Grade IV",
  "Grade V",
  "Grade VI",
  "Grade VII",
  "Grade VIII",
  "Grade IX",
  "Grade X",
  "Grade XI",
  "Grade XII",
  "Huffaz Programme",
  "O Levels",
  "Not sure",
] as const;

export const LEAD_STREAMS = [
  "Science",
  "General",
  "Commerce",
  "Pre-Medical",
  "General Science",
  "Pre-Engineering",
  "Sindh Board",
  "Cambridge/CAIE",
  "Huffaz",
  "Not sure",
] as const;

export const LEAD_GENDERS = ["Boy", "Girl", "Prefer not to say"] as const;
export const LEAD_CAMPUSES = ["Boys Campus", "Girls Campus", "Hill Park Campus", "Not sure"] as const;
export const LEAD_TIMINGS = ["Morning", "Afternoon", "Evening", "Flexible", "Not sure"] as const;
export const LEAD_VISITOR_TYPES = ["Parent", "Guardian", "Student", "Other"] as const;

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]).default("");

export function normalizePakistanPhone(input: string): string | null {
  const compact = input.trim().replace(/[\s().-]/g, "");
  if (!compact || /[^+\d]/.test(compact) || (compact.match(/\+/g)?.length ?? 0) > 1) return null;
  if (compact.includes("+") && !compact.startsWith("+")) return null;

  let digits = compact.replace(/^\+/, "");
  if (digits.startsWith("0092")) digits = digits.slice(2);
  if (digits.startsWith("92")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  if (!/^3\d{9}$/.test(digits)) return null;
  if (/(\d)\1{7,}/.test(digits) || new Set(digits).size < 3) return null;
  return `+92${digits}`;
}

export function containsSensitiveInformation(input: string): boolean {
  return /\b(cnic|national identity|password|passcode|pin code|credit card|debit card|cvv|card number)\b/i.test(input);
}

export const leadSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a name with at least 2 characters.").max(80),
    phone: z
      .string()
      .trim()
      .min(1, "Enter a Pakistan mobile number.")
      .max(30)
      .refine((value) => normalizePakistanPhone(value) !== null, "Enter a valid Pakistan mobile number."),
    visitorType: optionalEnum(LEAD_VISITOR_TYPES),
    selectedLanguage: z.enum(["en", "roman-ur"]),
    classLevel: z.enum(LEAD_CLASS_LEVELS, { error: "Choose the student's class or programme." }),
    stream: optionalEnum(LEAD_STREAMS),
    studentGender: optionalEnum(LEAD_GENDERS),
    preferredCampus: optionalEnum(LEAD_CAMPUSES),
    preferredTiming: optionalEnum(LEAD_TIMINGS),
    mainQuestion: z
      .string()
      .trim()
      .max(600, "Keep the question under 600 characters.")
      .refine((value) => !containsSensitiveInformation(value), "Do not include CNIC, passwords or payment card details.")
      .default(""),
    conversationSummary: z
      .string()
      .trim()
      .max(500)
      .refine((value) => !containsSensitiveInformation(value), "Sensitive information cannot be submitted.")
      .default(""),
    sourcePage: z.string().trim().max(200).regex(/^\/[\w\-/?=&.%]*$/, "Invalid source page.").default("/"),
    consent: z.boolean().refine((value) => value, "Consent is required before submission."),
    status: z.literal("New").default("New"),
  })
  .strict();

export const leadSubmissionSchema = leadSchema
  .safeExtend({
    website: z.string().max(200).optional().default(""),
    submissionId: z.string().uuid("Invalid submission identifier."),
  })
  .strict();

export type Lead = z.output<typeof leadSchema>;
export type StoredLead = Lead & { createdAt: string };
export type LeadDraft = Partial<z.input<typeof leadSchema>>;
export type LeadSubmission = z.output<typeof leadSubmissionSchema>;

export const REQUIRED_LEAD_FIELDS = ["name", "phone", "classLevel", "consent"] as const satisfies ReadonlyArray<keyof Lead>;

export function getMissingLeadFields(lead: LeadDraft): Array<(typeof REQUIRED_LEAD_FIELDS)[number]> {
  return REQUIRED_LEAD_FIELDS.filter((field) => {
    if (field === "consent") return lead.consent !== true;
    if (field === "phone") return !lead.phone || normalizePakistanPhone(lead.phone) === null;
    const value = lead[field];
    return typeof value !== "string" || value.trim().length === 0;
  });
}

export function getLeadCompletionPercentage(lead: LeadDraft): number {
  const complete = REQUIRED_LEAD_FIELDS.length - getMissingLeadFields(lead).length;
  return Math.round((complete / REQUIRED_LEAD_FIELDS.length) * 100);
}

export function validateLead(input: unknown) {
  return leadSchema.safeParse(input);
}

export function prepareValidatedLead(input: unknown): Lead | null {
  const result = leadSchema.safeParse(input);
  if (!result.success) return null;
  const phone = normalizePakistanPhone(result.data.phone);
  if (!phone) return null;
  return { ...result.data, phone };
}

function findEnum<T extends readonly string[]>(value: string, allowed: T): T[number] | "" {
  const match = allowed.find((option) => option.toLowerCase() === value.trim().toLowerCase());
  return match ?? "";
}

export function sanitizeLeadUpdate(update: LeadUpdate): LeadUpdate {
  const clean: LeadUpdate = {};
  const visitorType = findEnum(update.visitorType ?? "", LEAD_VISITOR_TYPES);
  const classLevel = findEnum(update.classLevel ?? "", LEAD_CLASS_LEVELS);
  const stream = findEnum(update.stream ?? "", LEAD_STREAMS);
  const studentGender = findEnum(update.studentGender ?? "", LEAD_GENDERS);
  const preferredCampus = findEnum(update.preferredCampus ?? "", LEAD_CAMPUSES);
  const preferredTiming = findEnum(update.preferredTiming ?? "", LEAD_TIMINGS);
  if (visitorType) clean.visitorType = visitorType;
  if (update.name && /^[\p{L}][\p{L} .'-]{1,79}$/u.test(update.name)) clean.name = update.name.trim();
  if (update.phone && normalizePakistanPhone(update.phone)) clean.phone = update.phone.trim();
  if (classLevel) clean.classLevel = classLevel;
  if (stream) clean.stream = stream;
  if (studentGender) clean.studentGender = studentGender;
  if (preferredCampus) clean.preferredCampus = preferredCampus;
  if (preferredTiming) clean.preferredTiming = preferredTiming;
  if (update.question && !containsSensitiveInformation(update.question)) clean.question = update.question.trim().slice(0, 600);
  return clean;
}

export function mergeLeadDraft(current: LeadDraft, update: LeadUpdate): LeadDraft {
  const clean = sanitizeLeadUpdate(update);
  const next = { ...current };
  for (const [key, value] of Object.entries(clean)) {
    if (!value) continue;
    const target = key === "question" ? "mainQuestion" : key;
    (next as Record<string, unknown>)[target] = value;
  }
  return next;
}

export function buildConversationSummary(lead: Pick<Lead, "classLevel" | "stream" | "studentGender" | "preferredCampus" | "preferredTiming" | "visitorType" | "mainQuestion">): string {
  const parts = [
    lead.visitorType ? `Visitor: ${lead.visitorType}` : "",
    `Programme: ${lead.classLevel}`,
    lead.stream ? `Stream: ${lead.stream}` : "",
    lead.studentGender ? `Student: ${lead.studentGender}` : "",
    lead.preferredCampus ? `Campus: ${lead.preferredCampus}` : "",
    lead.preferredTiming ? `Timing: ${lead.preferredTiming}` : "",
    lead.mainQuestion ? `Question: ${lead.mainQuestion}` : "",
  ].filter(Boolean);
  return parts.join("; ").slice(0, 500);
}

export type WhatsAppLeadDetails = {
  name?: string;
  classLevel?: string;
  stream?: string;
  preferredCampus?: string;
  preferredTiming?: string;
  mainQuestion?: string;
};

export function buildWhatsAppLeadMessage(language: AssistantLanguage, details: WhatsAppLeadDetails): string {
  const roman = language === "roman-ur";
  const lines = [
    roman
      ? "Assalamualaikum, mujhe Sir Saqib Tuitions mein admission ke hawalay se maloomat chahiye."
      : "Assalamualaikum, I would like admission information from Sir Saqib Tuitions.",
    details.name ? `${roman ? "Naam" : "Name"}: ${details.name}` : "",
    details.classLevel ? `${roman ? "Class/Programme" : "Class/Programme"}: ${details.classLevel}` : "",
    details.stream ? `${roman ? "Stream" : "Stream"}: ${details.stream}` : "",
    details.preferredCampus ? `${roman ? "Preferred Campus" : "Preferred Campus"}: ${details.preferredCampus}` : "",
    details.preferredTiming ? `${roman ? "Preferred Timing" : "Preferred Timing"}: ${details.preferredTiming}` : "",
    details.mainQuestion ? `${roman ? "Sawal" : "Question"}: ${details.mainQuestion}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
