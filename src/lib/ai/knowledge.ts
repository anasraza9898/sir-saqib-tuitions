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
import { inferClassLevel } from "./context.ts";

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
    gradesXIXII: ["Science", "Commerce", "Computer Science", "Pre-Engineering", "Sindh Board"],
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
  if (/\b(o[ -]?levels?|olevels?|igcse|caie)\b/i.test(input)) return verifiedFees.oLevels;
  if (/\b(huffaz|hafiz)\b/i.test(input)) return verifiedFees.huffaz;
  const grade = gradeNumber(input);
  if (!grade) return null;
  if (grade <= 10) return verifiedFees.gradesIXX;
  return verifiedFees.gradesXIXII;
}

function hasIntroduction(input: string): boolean {
  if (/\b(?:my name is|mera naam|meri naam|naam\s*:)\b/i.test(input)) return true;
  return /^(?:(?:hello|hi|sala+m|ass?alam)[,! ]+)?(?:i am|i'm)\s+[\p{L}][\p{L} .'-]{1,30}[.!]?$/iu.test(input)
    && !/\b(?:student|parent|guardian|interested|looking|asking)\b/i.test(input);
}

export function classifyAdmissionsIntent(input: string, state: LeadUpdate = {}): IntentClassification {
  const text = input.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
  if (hasIntroduction(text)) return { intent: "introduction", confidence: "high" };
  if (/\b(?:ass?alam|sala+m|hello|hi|hey|aoa)\b/i.test(text) || /(?:السلام|سلام)/u.test(text)) return { intent: "greeting", confidence: "high" };
  if (/\b(?:panadol|medicine|dawai|doctor|tabiyat|medical|legal advice|lawyer|investment advice|stock tip|crypto tip)\b/i.test(text) || /[\u0600-\u06ff].*(?:دوا|طبیعت|ڈاکٹر)/u.test(text)) return { intent: "out_of_scope", confidence: "high" };
  if (/\b(?:classroom|campus|academy|result|testimonial|sir saqib|introduction)\b.{0,30}\b(?:video|clip|recording|dikhao|show|watch)\b/i.test(text) || /\b(?:video|videos|media|testimonial)\b/i.test(text)) return { intent: "media", confidence: "high" };
  if (/\b(?:sibling|siblings|do bach|2 bach|discount|concession)\b/i.test(text)) return { intent: "sibling_discount", confidence: "high" };
  if (/\b(?:admission|dakhla)\s*(?:fee|fees|charges)|\bone[- ]?time fee\b/i.test(text)) return { intent: "admission_fee", confidence: "high" };
  if (/\b(?:fee+s?|fess|charges|price|cost|total|starting total|first month)\b/i.test(text) || /فیس/u.test(text)) return { intent: "fee", confidence: "high" };
  if (/\b(?:enquiry|inquiry|office)\b.{0,25}\b(?:hours?|timings?|tymings?|open|close)\b/i.test(text) || /\b(?:campus timing|opening hours?|kab khulta|kab band)\b/i.test(text)) return { intent: "campus_enquiry_hours", confidence: "high" };
  if (/\b(?:timetable|time table|class schedule|class timings?|class tymings?|batch timings?|group [ab]|batch [ab])\b/i.test(text) || ((/\b(?:timings?|tymings?|schedule|waqt)\b/i.test(text)) && Boolean(inferClassLevel(text) || state.classLevel))) return { intent: "class_schedule", confidence: "high" };
  if (/\b(?:qualification|qualified|degree|parhai)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_qualification", confidence: "high" };
  if (/\b(?:experience|tajurba|years? teaching|kitne saal)\b/i.test(text) && /\b(?:teacher|sir|miss|faculty|saqib|babar|armash|shahid|hanzala|ashhad|javeria|hassan|hasan)\b/i.test(text)) return { intent: "teacher_experience", confidence: "high" };
  if (/\b(?:faculty|teachers?|instructors?|who teaches|parhata|parhati)\b/i.test(text)) return { intent: "faculty", confidence: "high" };
  if (/\b(?:subjects?|mazameen)\b/i.test(text)) return { intent: "subjects", confidence: "high" };
  if (/\b(?:board|curriculum|syllabus|caie|cambridge|sindh board)\b/i.test(text)) return { intent: "curriculum_board", confidence: "high" };
  if (/\b(?:results?|marks|position|achievement|high achievers?)\b/i.test(text)) return { intent: "results", confidence: "high" };
  if (/\b(?:documents?|paperwork|b[- ]?form|bay form|kaghaz|papers?)\b/i.test(text)) return { intent: "documents", confidence: "high" };
  if (/\b(?:trial|demo class|free class)\b/i.test(text)) return { intent: "trial_class", confidence: "high" };
  if (/\b(?:van|transport|pick.?and.?drop|school bus|route service)\b/i.test(text)) return { intent: "van_service", confidence: "high" };
  if (/\b(?:online|remote|zoom)\b/i.test(text)) return { intent: "online_classes", confidence: "high" };
  if (/\b(?:seats?|vacanc(?:y|ies)|space available|full batch)\b/i.test(text)) return { intent: "seat_availability", confidence: "high" };
  if (/\b(?:benefits?|advantages?|why (?:choose|join)|special|strengths?|achi academy|good academy|progress report|parent meeting)\b/i.test(text)) return { intent: "academy_benefits", confidence: "high" };
  if (/\b(?:address|location|where is|kahan|kidhar)\b/i.test(text) && /\b(?:campus|branch|academy|boys|girls|hill park)\b/i.test(text)) return { intent: "address", confidence: "high" };
  if (/\b(?:phone|number|whatsapp|call number|contact number)\b/i.test(text)) return { intent: "phone_whatsapp", confidence: "high" };
  if (/\b(?:call me|callback|call back|contact me|admissions? team.{0,20}(?:contact|call)|admission form|apply now|rabta karein)\b/i.test(text)) return { intent: "lead_callback", confidence: "high" };
  if (/\b(?:admission process|how (?:do|to) (?:apply|enrol|enroll)|dakhla kaise|admission kaise|registration process)\b/i.test(text)) return { intent: "admission_process", confidence: "high" };
  if (/\b(?:o[ -]?levels?|olevels?|huffaz|hafiz|programme|program|course|available|offer|classes?|grades?|science|general|commerce|pre[ -]?engineering)\b/i.test(text)) return { intent: "programme_availability", confidence: "medium" };
  if (/\b(?:campus|campuses|branch|branches|boys campus|girls campus|hill park)\b/i.test(text)) return { intent: "campus", confidence: "medium" };
  if (/\b(?:thanks|thank you|shukriya|acha|theek|okay|ok|great|nice)\b/i.test(text)) return { intent: "casual_academy_conversation", confidence: "medium" };
  return { intent: "other", confidence: "low" };
}

function classText(state: LeadUpdate, input: string): string {
  return inferClassLevel(input) || state.classLevel || "";
}

function streamText(state: LeadUpdate, input: string): string {
  if (/\bscience\b/i.test(input)) return "Science";
  if (/\bgeneral\b/i.test(input)) return "General";
  if (/\bcommerce\b/i.test(input)) return "Commerce";
  return state.stream ?? "";
}

function selectedCampus(state: LeadUpdate, input: string): "boys" | "girls" | "hill-park" | "" {
  if (/\b(?:girls?|female|beti|larki)\b/i.test(input)) return "girls";
  if (/\b(?:boys?|male|beta|larka)\b/i.test(input)) return "boys";
  if (/\bhill[ -]?park\b/i.test(input)) return "hill-park";
  if (state.preferredCampus === "Boys Campus") return "boys";
  if (state.preferredCampus === "Girls Campus") return "girls";
  if (state.preferredCampus === "Hill Park Campus") return "hill-park";
  if (state.studentGender === "Boy") return "boys";
  if (state.studentGender === "Girl") return "girls";
  return "";
}

function timetableKnowledge(input: string, state: LeadUpdate): Pick<RelevantKnowledge, "facts" | "missingClarification" | "recommendedAction"> {
  const campus = selectedCampus(state, input);
  const classLevel = classText(state, input).replace(/^Grade /, "");
  const romanToNumber: Record<string, string> = { IX: "9", X: "10", XI: "11", XII: "12" };
  const classNumber = romanToNumber[classLevel] ?? "";
  const stream = streamText(state, input);
  const group = input.match(/\b(?:group|batch)\s*['\"]?([ab])\b/i)?.[1]?.toUpperCase() ?? "";
  const wantsMorning = /\b(?:morning|subah)\b/i.test(input);
  const wantsEvening = /\b(?:evening|shaam)\b/i.test(input);
  const missing: string[] = [];
  if (!classNumber) missing.push("class (IX, X, XI or XII)");
  if (!campus) missing.push("Boys or Girls Campus");
  if (!stream) missing.push("stream/group");
  if (campus === "hill-park") {
    return {
      facts: ["The verified website timetable index contains Boys and Girls Campus posters only; no Hill Park schedule may be invented."],
      missingClarification: [],
      recommendedAction: { type: "whatsapp", label: "Confirm Hill Park timetable", value: site.whatsapp },
    };
  }

  let candidates = timetables.filter((item) =>
    (!campus || item.campus === campus) &&
    (!classNumber || item.classLevel === classNumber) &&
    (!stream || item.stream.toLowerCase() === stream.toLowerCase()),
  );
  if (group) candidates = candidates.filter((item) => new RegExp(`(?:group|batch)\\s*${group}\\b`, "i").test(item.variant));
  if (wantsMorning) candidates = candidates.filter((item) => /morning/i.test(item.variant));
  if (wantsEvening) candidates = candidates.filter((item) => /evening|batch [ab]/i.test(item.variant));

  if (!missing.length && candidates.length > 1 && !group && !wantsMorning && !wantsEvening) {
    missing.push(`batch/timing (${candidates.map((item) => item.variant).join(" or ")})`);
  }
  if (!missing.length && candidates.length === 0) {
    return {
      facts: ["No verified timetable poster matches all supplied filters. Do not invent a schedule; offer the timetable finder or campus confirmation."],
      missingClarification: [],
      recommendedAction: route("Open timetable finder", academyRoutes.timetables),
    };
  }
  if (missing.length) {
    const known = [campus ? `${campus} campus` : "", classNumber ? `Class ${classNumber}` : "", stream].filter(Boolean).join(", ");
    const matchingOptions = candidates.length ? [...new Set(candidates.map((item) => item.variant))].join(", ") : "";
    return {
      facts: [
        known ? `Known timetable filters: ${known}.` : "The visitor is asking for a class timetable, not campus enquiry hours.",
        matchingOptions ? `Verified matching poster variants: ${matchingOptions}.` : "Published timetable posters are filtered by campus, class, stream and batch.",
      ],
      missingClarification: missing,
      recommendedAction: route("View timetables", academyRoutes.timetables),
    };
  }

  const selected = candidates[0];
  const query = new URLSearchParams({ campus: selected.campus, class: selected.classLevel, stream: selected.stream.toLowerCase(), batch: selected.id });
  const schedule = timetableSchedules[selected.id];
  const facts = [`Exact verified poster: ${selected.campus === "boys" ? "Boys" : "Girls"} Campus, Class ${selected.classLevel}, ${selected.stream}, ${selected.variant}.`];
  if (schedule) {
    facts.push(...schedule.map((day) => {
      const slots = day.slots.map((slot) => `${slot.start}-${slot.end} ${slot.subject}`).join("; ");
      return `${day.day}: ${slots || day.note}${slots && day.note ? `; ${day.note}` : ""}.`;
    }));
  } else {
    facts.push("The exact poster is verified, but its day/subject text has not been safely transcribed. Do not guess it; use the filtered timetable action.");
  }
  return {
    facts,
    missingClarification: [],
    recommendedAction: route("Open exact timetable", `${academyRoutes.timetables}?${query.toString()}`),
  };
}

function matchingCampus(input: string) {
  if (/\bgirls?\b/i.test(input)) return campuses.find((campus) => campus.id === "girls");
  if (/\bboys?\b/i.test(input)) return campuses.find((campus) => campus.id === "boys");
  if (/\bhill[ -]?park\b/i.test(input)) return campuses.find((campus) => campus.id === "hill-park");
  return undefined;
}

function matchingFaculty(input: string) {
  if (/\b(?:sir )?saqib\b/i.test(input)) return [faculty[0]];
  if (/\b(?:math|maths|mathematics)\b/i.test(input)) return faculty.filter((member) => member.field === "Mathematics");
  if (/\b(?:computer science|computing)\b/i.test(input)) return faculty.filter((member) => member.field === "Computer Science");
  if (/\b(?:commerce|accounting)\b/i.test(input)) return faculty.filter((member) => member.field === "Commerce");
  return faculty.filter((member) => {
    const tokens = member.name.toLowerCase().replace(/\b(?:sir|miss|eng)\.?\b/g, "").trim().split(/\s+/);
    return tokens.some((token) => token.length > 3 && input.toLowerCase().includes(token));
  });
}

export function selectRelevantKnowledge(input: string, state: LeadUpdate = {}): RelevantKnowledge {
  const classification = classifyAdmissionsIntent(input, state);
  const base = { ...classification, facts: [] as string[], missingClarification: [] as string[], recommendedAction: none() };
  const currentClass = classText(state, input);
  const combinedClass = `${input} ${currentClass}`;

  switch (classification.intent) {
    case "greeting":
    case "introduction":
    case "casual_academy_conversation":
      return base;
    case "fee": {
      const monthly = monthlyFeeFor(combinedClass);
      const starting = /\b(?:start|starting|first month|initial|total)\b/i.test(input);
      if (monthly) {
        base.facts.push(`Monthly fee for ${currentClass || "the selected programme"}: ${money(monthly)}.`);
        base.facts.push(`One-time admission fee: ${money(verifiedFees.admission)}.`);
        if (starting) base.facts.push(`Verified initial total: ${money(monthly + verifiedFees.admission)}; later months carry the monthly fee only.`);
      } else {
        const wantsClassClarification = /\b(?:a class|kisi class|for a class)\b/i.test(input) || input.split(/\s+/).length <= 3;
        if (wantsClassClarification) {
          base.facts.push(`One-time admission fee for every programme: ${money(verifiedFees.admission)}.`);
          base.missingClarification.push("class or programme for the monthly fee");
        } else {
          base.facts.push(`Monthly fees: Grades I-X ${money(verifiedFees.gradesIXX)}; Grades XI-XII ${money(verifiedFees.gradesXIXII)}; Huffaz ${money(verifiedFees.huffaz)}; O Levels ${money(verifiedFees.oLevels)}.`);
          base.facts.push(`One-time admission fee: ${money(verifiedFees.admission)}.`);
        }
      }
      if (/\b(?:same|different|campus|science|general|commerce|stream)\b/i.test(input)) {
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
    case "timetable":
      return { ...base, ...timetableKnowledge(input, state) };
    case "campus_enquiry_hours": {
      const campus = matchingCampus(input);
      if (/\b(?:sunday|itwar|aitwar)\b/i.test(input)) {
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
      if (/\b(?:o[ -]?levels?|olevels?|igcse|caie)\b/i.test(combinedClass)) base.facts.push("O Levels is available at all campuses with Cambridge/CAIE curriculum and all subjects offered.");
      else if (/\b(?:huffaz|hafiz)\b/i.test(combinedClass)) base.facts.push("The Huffaz Programme is available at all campuses.");
      else if (grade && grade <= 8) base.facts.push(`Grade ${grade} foundation tuition is available at all campuses.`);
      else if (grade && grade <= 10) base.facts.push(`Grade ${grade} offers Science, General and Sindh Board.`);
      else if (grade) base.facts.push(`Grade ${grade} offers Science, Commerce, Computer Science, Pre-Engineering and Sindh Board.`);
      else base.facts.push("Programmes: Grades I-VIII foundation and Huffaz at all campuses; Grades IX-X Science, General and Sindh Board; Grades XI-XII Science, Commerce, Computer Science, Pre-Engineering and Sindh Board; O Levels Cambridge/CAIE at all campuses.");
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
      else if ([11, 12].includes(gradeNumber(combinedClass) ?? 0)) base.facts.push("Grades XI-XII offer Science, Commerce, Computer Science, Pre-Engineering and Sindh Board.");
      else base.facts.push("Grades IX-X offer Science, General and Sindh Board; Grades XI-XII offer Science, Commerce, Computer Science, Pre-Engineering and Sindh Board. O Levels separately follows Cambridge/CAIE.");
      return base;
    case "faculty":
    case "teacher_qualification":
    case "teacher_experience": {
      const matched = matchingFaculty(input);
      const members = matched.length ? matched : faculty;
      base.facts.push(...members.map((member) => `${member.name}: ${member.qualification}; ${member.experience} years experience; verified field ${member.field}.`));
      base.facts.push("The verified roster gives fields, not specific class/subject assignments; do not invent teaching assignments.");
      base.recommendedAction = route("View faculty", academyRoutes.faculty);
      return base;
    }
    case "campus":
    case "address": {
      const campus = matchingCampus(input);
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
      if (/\b2025\b/.test(input)) base.facts.push(`Verified 2025 result poster categories: ${results2025.map((item) => item.title).join(", ")}.`);
      else base.facts.push(`Latest verified 2026 result poster categories: ${results2026.map((item) => item.title).join(", ")}.`);
      base.facts.push("Past results do not guarantee future marks or positions; no marks or ranking may be invented.");
      base.recommendedAction = route("View verified results", academyRoutes.results);
      return base;
    case "media": {
      const matched = mediaItems.filter((item) => {
        if (/\bclassroom\b/i.test(input)) return item.id === "classroom-learning" || item.id === "boys-campus";
        if (/\b(?:sir saqib|introduction|academy intro)\b/i.test(input)) return item.id === "academy-introduction";
        if (/\btestimonial|student voice\b/i.test(input)) return item.id === "student-voices";
        if (/\bresults?\b/i.test(input)) return item.id === "results-2026";
        if (/\bgirls?\b/i.test(input)) return item.id === "girls-campus";
        if (/\bboys?\b/i.test(input)) return item.id === "boys-campus";
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

export function formatRelevantKnowledge(context: RelevantKnowledge): string {
  const lines = [
    `Detected intent (context selection only): ${context.intent}; confidence: ${context.confidence}.`,
    ...context.facts.map((fact) => `- ${fact}`),
  ];
  if (context.missingClarification.length) {
    lines.push(`Smallest missing clarification: ${context.missingClarification.join(", ")}. Ask one compact question that covers only these missing discriminators.`);
  }
  if (!context.facts.length) lines.push("No academy fact block is needed for this conversational turn.");
  return lines.join("\n");
}
