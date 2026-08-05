import type { AssistantLanguage, AssistantStructuredResponse, ChatMessage, LeadUpdate } from "./contracts.ts";
import { noRecommendedAction } from "./contracts.ts";
import { extractConversationState } from "./context.ts";
import { monthlyFeeFor, selectRelevantKnowledge, verifiedFees } from "./knowledge.ts";
import { isAbusiveOrDangerous, isPromptInjectionAttempt, promptDisclosureRefusal } from "./safety.ts";

export type VisitorLanguage = AssistantLanguage;

export function detectVisitorLanguage(input: string): VisitorLanguage {
  const romanUrdu = /\b(jee|kya|kia|kaun|kahan|kidhar|mujhe|chahiye|batao|bataye|hain|hai|kaise|karna|karwana|dakhla|rabta|aap|beta|beti|ke liye|ki fee|mera naam|salam)\b/i;
  return romanUrdu.test(input) || /[\u0600-\u06FF]/.test(input) ? "roman-ur" : "en";
}

function money(value: number): string {
  return `PKR ${value.toLocaleString("en-US")}`;
}

function fallbackMessage(message: string, language: AssistantLanguage, state: LeadUpdate): string {
  const roman = language === "roman-ur";
  const context = selectRelevantKnowledge(message, state);
  const name = state.name ? ` ${state.name}` : "";

  switch (context.intent) {
    case "greeting":
      return roman
        ? "Wa Alaikum Assalam! Sir Saqib Tuitions mein khush aamdeed. Jee batayein, main kis academy maloomat mein madad karoon?"
        : "Wa Alaikum Assalam! Welcome to Sir Saqib Tuitions. How can I help with the academy today?";
    case "introduction":
      return roman
        ? `Wa Alaikum Assalam${name}! Sir Saqib Tuitions mein khush aamdeed. Jee batayein, aap kis class ya programme ke hawalay se maloomat chahte hain?`
        : `Welcome${name}! It is nice to meet you. Which class or programme would you like to ask about?`;
    case "fee": {
      const monthly = monthlyFeeFor(`${message} ${state.classLevel ?? ""}`);
      if (!monthly) return roman ? "Kis class ya programme ki monthly fee chahiye?" : "Which class or programme would you like the monthly fee for?";
      const starting = /\b(?:start|starting|first month|initial|total)\b/i.test(message);
      if (starting) return roman
        ? `Monthly fee ${money(monthly)} aur one-time admission fee ${money(verifiedFees.admission)} hai, is liye shuru mein total ${money(monthly + verifiedFees.admission)} banta hai.`
        : `The monthly fee is ${money(monthly)} and the one-time admission fee is ${money(verifiedFees.admission)}, so the initial total is ${money(monthly + verifiedFees.admission)}.`;
      return roman
        ? `Monthly fee ${money(monthly)} hai. One-time admission fee ${money(verifiedFees.admission)} hai.`
        : `The monthly fee is ${money(monthly)}. The one-time admission fee is ${money(verifiedFees.admission)}.`;
    }
    case "admission_fee":
      return roman ? `One-time admission fee ${money(verifiedFees.admission)} hai; koi alag registration ya processing charge nahin hai.` : `The one-time admission fee is ${money(verifiedFees.admission)}; there is no separate registration or processing charge.`;
    case "sibling_discount":
      return roman ? "Sibling discount monthly fees par 10% hai. Yeh one-time admission fee par apply nahin hota." : "The sibling discount is 10% on monthly fees. It does not apply to the one-time admission fee.";
    case "class_schedule":
    case "timetable":
      if (context.missingClarification.length) return roman
        ? `Jee, ${context.missingClarification.join(", ")} bata dein taake exact class timetable mil sake.`
        : `Please share ${context.missingClarification.join(", ")} so I can identify the exact class timetable.`;
      if (context.facts.length > 2 && !context.facts.some((fact) => fact.includes("not been safely transcribed"))) {
        return `${roman ? "Jee, verified schedule:" : "Here is the verified schedule:"}\n${context.facts.join("\n")}`;
      }
      return roman ? "Exact verified timetable poster neeche diye gaye action se khol sakte hain." : "You can open the exact verified timetable poster using the action below.";
    case "out_of_scope":
      return roman ? "Main medical, legal ya financial advice nahin de sakta. Academy ke admissions, classes ya campuses ke hawalay se zaroor madad kar sakta hoon." : "I cannot provide medical, legal or financial advice. I can help with the academy's admissions, classes or campuses.";
    case "lead_callback":
      return roman ? "Jee, contact form khol sakte hain. Details sirf valid form aur aapki explicit consent ke baad submit hongi." : "You can open the contact form. Details are submitted only after validation and your explicit consent.";
    case "casual_academy_conversation":
      return roman ? "Jee bilkul. Academy ke hawalay se aur kya maloomat chahiye?" : "Of course. What else would you like to know about the academy?";
    case "teacher_experience":
    case "teacher_qualification":
    case "faculty":
      return context.facts.filter((fact) => !fact.startsWith("The verified roster")).join(" ");
    case "curriculum_board":
      return context.facts[0]?.replace(/ Do not describe[\s\S]*$/, "") ?? "";
    case "results":
    case "media":
    case "programme_availability":
    case "subjects":
    case "campus_enquiry_hours":
    case "address":
    case "campus":
    case "documents":
    case "trial_class":
    case "van_service":
    case "online_classes":
    case "academy_benefits":
    case "seat_availability":
    case "phone_whatsapp":
    case "admission_process":
      return context.facts.filter((fact) => !/Do not |Never |must not be safely transcribed/i.test(fact)).slice(0, 2).join(" ");
    default:
      if (context.facts.length) return context.facts.slice(0, 2).join(" ");
      return roman
        ? "Assistant filhaal limited mode mein hai. Academy se mutaliq apna sawal thora wazeh likhein, ya Call/WhatsApp use karein."
        : "The assistant is currently in limited mode. Please restate your academy question briefly, or use Call/WhatsApp.";
  }
}

/**
 * Emergency-only response composer. The chat route calls this only for a
 * safety block, missing configuration, provider failure or infrastructure
 * error; it is never the ordinary admissions brain.
 */
export function getLocalAssistantResponse(
  message: string,
  history: string[] = [],
  language: AssistantLanguage = detectVisitorLanguage(message),
  suppliedState: LeadUpdate = {},
): AssistantStructuredResponse {
  const messages: ChatMessage[] = [...history, message].map((content) => ({ role: "user", content }));
  const state = extractConversationState(messages, suppliedState);
  const context = selectRelevantKnowledge(message, state);

  if (isPromptInjectionAttempt(message)) {
    return {
      message: promptDisclosureRefusal(language),
      language,
      intent: "out_of_scope",
      needsClarification: false,
      suggestions: [],
      leadUpdate: state,
      recommendedAction: noRecommendedAction(),
    };
  }

  if (isAbusiveOrDangerous(message)) {
    return {
      message: language === "roman-ur"
        ? "Main is request mein madad nahin kar sakta. Sir Saqib Tuitions ke admissions aur programmes ke hawalay se zaroor guide kar sakta hoon."
        : "I cannot help with that request. I can assist with Sir Saqib Tuitions admissions and programmes.",
      language,
      intent: "out_of_scope",
      needsClarification: false,
      suggestions: [],
      leadUpdate: state,
      recommendedAction: noRecommendedAction(),
    };
  }

  return {
    message: fallbackMessage(message, language, state),
    language,
    intent: context.intent,
    needsClarification: context.missingClarification.length > 0,
    suggestions: [],
    leadUpdate: state,
    recommendedAction: context.recommendedAction,
  };
}
