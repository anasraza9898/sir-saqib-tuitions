import { z } from "zod";

export const CHAT_MESSAGE_MAX_LENGTH = 700;
export const CHAT_MAX_TURNS = 16;

export const assistantLanguageSchema = z.enum(["en", "roman-ur"]);
export type AssistantLanguage = z.infer<typeof assistantLanguageSchema>;

export const chatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(CHAT_MESSAGE_MAX_LENGTH),
  })
  .strict();

const leadFieldSchemas = {
  visitorType: z.string().trim().max(30),
  name: z.string().trim().max(80),
  phone: z.string().trim().max(30),
  classLevel: z.string().trim().max(40),
  stream: z.string().trim().max(40),
  studentGender: z.string().trim().max(30),
  preferredCampus: z.string().trim().max(40),
  preferredTiming: z.string().trim().max(40),
  group: z.string().trim().max(20),
  question: z.string().trim().max(600),
} as const;

/**
 * Conversation state is deterministic memory supplied by the client. Every
 * field is optional so the model is never forced to invent lead information.
 */
export const leadUpdateSchema = z.object({
  visitorType: leadFieldSchemas.visitorType.optional(),
  name: leadFieldSchemas.name.optional(),
  phone: leadFieldSchemas.phone.optional(),
  classLevel: leadFieldSchemas.classLevel.optional(),
  stream: leadFieldSchemas.stream.optional(),
  studentGender: leadFieldSchemas.studentGender.optional(),
  preferredCampus: leadFieldSchemas.preferredCampus.optional(),
  preferredTiming: leadFieldSchemas.preferredTiming.optional(),
  group: leadFieldSchemas.group.optional(),
  question: leadFieldSchemas.question.optional(),
}).strict();

export const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(CHAT_MAX_TURNS),
    language: assistantLanguageSchema,
    leadState: leadUpdateSchema.optional().default({}),
  })
  .strict()
  .superRefine(({ messages }, context) => {
    if (messages.at(-1)?.role !== "user") {
      context.addIssue({
        code: "custom",
        message: "The final conversation message must be from the visitor.",
        path: ["messages"],
      });
    }

    for (let index = 1; index < messages.length; index += 1) {
      if (messages[index - 1].role === messages[index].role) {
        context.addIssue({
          code: "custom",
          message: "Conversation roles must alternate.",
          path: ["messages", index, "role"],
        });
      }
    }
  });

export const assistantIntentSchema = z.enum([
  "greeting",
  "introduction",
  "casual_academy_conversation",
  "fee",
  "admission_fee",
  "sibling_discount",
  "timetable",
  "class_schedule",
  "campus_enquiry_hours",
  "programme_availability",
  "subjects",
  "curriculum_board",
  "faculty",
  "teacher_qualification",
  "teacher_experience",
  "campus",
  "address",
  "phone_whatsapp",
  "admission_process",
  "documents",
  "trial_class",
  "van_service",
  "online_classes",
  "results",
  "media",
  "academy_benefits",
  "seat_availability",
  "lead_callback",
  "out_of_scope",
  "other",
]);

export const recommendedActionSchema = z
  .object({
    type: z.enum(["none", "route", "call", "whatsapp", "lead_form"]),
    label: z.string().trim().max(60).optional().default(""),
    value: z.string().trim().max(700).optional().default(""),
  })
  .strict();

/** AI providers may omit every metadata field that is not useful for this turn. */
export const assistantStructuredResponseSchema = z
  .object({
    message: z.string().trim().min(1).max(1_200),
    language: assistantLanguageSchema.optional(),
    intent: assistantIntentSchema.optional(),
    needsClarification: z.boolean().optional(),
    suggestions: z.array(z.string().trim().min(1).max(70)).max(3).optional(),
    leadUpdate: leadUpdateSchema.optional(),
    recommendedAction: recommendedActionSchema.optional(),
  })
  .strict();

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type AssistantIntent = z.infer<typeof assistantIntentSchema>;
export type LeadUpdate = z.infer<typeof leadUpdateSchema>;
export type RecommendedAction = z.infer<typeof recommendedActionSchema>;

export type AssistantStructuredResponse = {
  message: string;
  language: AssistantLanguage;
  intent: AssistantIntent;
  needsClarification: boolean;
  suggestions: string[];
  leadUpdate: LeadUpdate;
  recommendedAction: RecommendedAction;
};

export type AssistantMode = "ai" | "demo" | "gemini";

export type ChatSuccessResponse = {
  ok: true;
  data: AssistantStructuredResponse & {
    mode: AssistantMode;
    model?: string;
    provider?: "groq" | "interactions" | "generateContent";
  };
};

export type ApiErrorResponse = {
  ok: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
    diagnostic?: string;
    model?: string;
  };
};

export function emptyLeadUpdate(): LeadUpdate {
  return {};
}

export function noRecommendedAction(): RecommendedAction {
  return { type: "none", label: "", value: "" };
}
