import { mediaItems, results2025, results2026, timetables } from "../../data/site.ts";
import type { LeadUpdate, RecommendedAction } from "./contracts.ts";
import { normalizeVisitorText } from "./context.ts";

export type ResourceType = "result" | "timetable" | "video" | "page";
export type ResourceStatus = "EXACT_RESOURCE_AVAILABLE" | "CATEGORY_RESOURCE_AVAILABLE" | "NO_VERIFIED_RESOURCE";

export type VerifiedResource = {
  type: ResourceType;
  title: string;
  route: string;
  assetPath?: string;
  year?: 2025 | 2026;
  classLevels?: string[];
  streams?: string[];
  campus?: string;
  group?: string;
  verified: true;
};

export type ResourceResolution = {
  status: ResourceStatus;
  requestType: ResourceType;
  exact?: VerifiedResource;
  category?: VerifiedResource;
  facts: string[];
  recommendedAction: RecommendedAction;
};

const none = (): RecommendedAction => ({ type: "none", label: "", value: "" });
const route = (label: string, value: string): RecommendedAction => ({ type: "route", label, value });

function resultCampus(title: string): string | undefined {
  if (/boys/i.test(title)) return "Boys Campus";
  if (/girls/i.test(title)) return "Girls Campus";
  return undefined;
}

function resultClassLevels(title: string): string[] {
  if (/\bIX-X\b|Matric/i.test(title)) return ["IX", "X"];
  if (/\bXI-XII\b/i.test(title)) return ["XI", "XII"];
  return [];
}

function resultStreams(title: string): string[] {
  const streams: string[] = [];
  if (/Science/i.test(title)) streams.push("Science");
  if (/General/i.test(title)) streams.push("General");
  if (/Commerce/i.test(title)) streams.push("Commerce");
  if (/Groups/i.test(title)) streams.push("Pre-Medical", "Pre-Engineering", "General Science", "Commerce");
  return streams;
}

export const verifiedResourceRegistry: VerifiedResource[] = [
  ...results2025.map((item): VerifiedResource => ({
    type: "result",
    year: 2025,
    classLevels: resultClassLevels(item.title),
    streams: resultStreams(item.title),
    campus: resultCampus(item.title),
    title: item.title,
    route: "/results",
    assetPath: item.src,
    verified: true,
  })),
  ...results2026.map((item): VerifiedResource => ({
    type: "result",
    year: 2026,
    classLevels: resultClassLevels(item.title),
    streams: resultStreams(item.title),
    campus: resultCampus(item.title),
    title: item.title,
    route: "/results",
    assetPath: item.src,
    verified: true,
  })),
  ...mediaItems.map((item): VerifiedResource => ({
    type: "video",
    title: item.title,
    route: "/media",
    assetPath: item.src,
    campus: /Boys/i.test(item.category) ? "Boys Campus" : /Girls/i.test(item.category) ? "Girls Campus" : undefined,
    verified: true,
  })),
  ...timetables.map((item): VerifiedResource => ({
    type: "timetable",
    title: item.label,
    route: `/timetables?class=${encodeURIComponent(item.classLevel)}&stream=${encodeURIComponent(item.stream.toLowerCase())}&batch=${encodeURIComponent(item.id)}`,
    assetPath: item.src,
    classLevels: [item.grade],
    streams: [item.stream],
    group: item.variant.startsWith("Group ") ? item.variant : undefined,
    verified: true,
  })),
  { type: "page", title: "Results", route: "/results", verified: true },
  { type: "page", title: "Media", route: "/media", verified: true },
  { type: "page", title: "Timetables", route: "/timetables", verified: true },
  { type: "page", title: "Faculty", route: "/faculty", verified: true },
  { type: "page", title: "Campus Details", route: "/campuses", verified: true },
];

function requestedYear(text: string): 2025 | 2026 | undefined {
  if (/\b2025\b|previous|last year|pichl/i.test(text)) return 2025;
  if (/\b2026\b|latest|new|current/i.test(text)) return 2026;
  return undefined;
}

function requestedClass(text: string, state: LeadUpdate): string | undefined {
  const value = `${text} ${state.classLevel ?? ""}`;
  if (/\b(?:class|grade)?\s*9\b|\bix\b/i.test(value)) return "IX";
  if (/\b(?:class|grade)?\s*10\b|\bx\b/i.test(value)) return "X";
  if (/\b(?:class|grade)?\s*11\b|\bxi\b/i.test(value)) return "XI";
  if (/\b(?:class|grade)?\s*12\b|\bxii\b/i.test(value)) return "XII";
  return undefined;
}

function requestedStream(text: string, state: LeadUpdate): string | undefined {
  const value = `${text} ${state.stream ?? ""}`;
  if (/pre[ -]?medical/i.test(value)) return "Pre-Medical";
  if (/pre[ -]?engineering/i.test(value)) return "Pre-Engineering";
  if (/general science|computer/i.test(value)) return "General Science";
  if (/commerce/i.test(value)) return "Commerce";
  if (/general/i.test(value)) return "General";
  if (/science/i.test(value)) return "Science";
  return undefined;
}

function requestedGroup(text: string, state: LeadUpdate): string | undefined {
  const group = text.match(/\b(?:group|batch)\s*['"]?([ab])\b/i)?.[1]?.toUpperCase();
  if (group === "A" || group === "B") return `Group ${group}`;
  return state.group;
}

function includesAll(value: string[] | undefined, requested: string | undefined): boolean {
  return !requested || Boolean(value?.includes(requested));
}

function resultFacts(status: ResourceStatus, resource: VerifiedResource | undefined, request: { year?: number; classLevel?: string; stream?: string }): string[] {
  if (status === "EXACT_RESOURCE_AVAILABLE" && resource) {
    return [
      `RESOURCE_STATUS: EXACT_RESOURCE_AVAILABLE.`,
      `Verified result resource: ${resource.title}.`,
      `Resource route: ${resource.route}.`,
      resource.assetPath ? `Resource asset: ${resource.assetPath}.` : "",
    ].filter(Boolean);
  }
  if (status === "CATEGORY_RESOURCE_AVAILABLE" && resource) {
    const requested = [request.year, request.classLevel ? `Class ${request.classLevel}` : "", request.stream].filter(Boolean).join(", ");
    if (resource.type === "page") {
      return [
        `RESOURCE_STATUS: CATEGORY_RESOURCE_AVAILABLE.`,
        `Verified ${request.year ?? ""} Results section is available.`.replace(/\s+/g, " "),
        `Resource route: ${resource.route}.`,
        "Use the verified route action; do not suggest another website or a campus visit to access these results.",
      ];
    }
    return [
      `RESOURCE_STATUS: CATEGORY_RESOURCE_AVAILABLE.`,
      requested ? `Exact requested result is not individually mapped for: ${requested}.` : "Exact requested result is not individually mapped.",
      `Broader verified result category: ${resource.title}.`,
      `Resource route: ${resource.route}.`,
      resource.assetPath ? `Category asset: ${resource.assetPath}.` : "",
      "Do not say this exact result is unavailable if a broader verified category is available; explain the category action instead.",
    ].filter(Boolean);
  }
  return [
    `RESOURCE_STATUS: NO_VERIFIED_RESOURCE.`,
    "No matching verified website result resource was found. Do not invent result availability, marks, boards, posters, or another website.",
  ];
}

export function resolveResultResource(input: string, state: LeadUpdate = {}): ResourceResolution {
  const text = normalizeVisitorText(`${input} ${state.question ?? ""}`);
  const year = requestedYear(text) ?? 2025;
  const classLevel = requestedClass(text, state);
  const stream = requestedStream(text, state);
  const campus = state.preferredCampus;
  const candidates = verifiedResourceRegistry.filter((resource) => resource.type === "result" && resource.year === year);
  const broadResultsSection: VerifiedResource = { type: "page", title: `${year} Results`, route: "/results", year, verified: true };
  const exact = candidates.find((resource) =>
    resource.classLevels?.length === 1 &&
    includesAll(resource.classLevels, classLevel) &&
    includesAll(resource.streams, stream) &&
    (!campus || resource.campus === campus),
  );
  if (exact) {
    return {
      status: "EXACT_RESOURCE_AVAILABLE",
      requestType: "result",
      exact,
      facts: resultFacts("EXACT_RESOURCE_AVAILABLE", exact, { year, classLevel, stream }),
      recommendedAction: route(`View ${exact.title}`, exact.route),
    };
  }

  if (!classLevel && !stream && !campus) {
    return {
      status: "CATEGORY_RESOURCE_AVAILABLE",
      requestType: "result",
      category: broadResultsSection,
      facts: resultFacts("CATEGORY_RESOURCE_AVAILABLE", broadResultsSection, { year, classLevel, stream }),
      recommendedAction: route(year === 2025 ? "Open 2025 Results" : "Open Latest Results", broadResultsSection.route),
    };
  }

  const category = candidates.find((resource) =>
    includesAll(resource.classLevels, classLevel) &&
    (!stream || !resource.streams?.length || includesAll(resource.streams, stream)) &&
    (!campus || resource.campus === campus),
  ) ?? candidates[0];
  if (category) {
    return {
      status: "CATEGORY_RESOURCE_AVAILABLE",
      requestType: "result",
      category,
      facts: resultFacts("CATEGORY_RESOURCE_AVAILABLE", category, { year, classLevel, stream }),
      recommendedAction: route(year === 2025 ? "Open 2025 Results" : "Open Latest Results", category.route),
    };
  }

  return {
    status: "NO_VERIFIED_RESOURCE",
    requestType: "result",
    facts: resultFacts("NO_VERIFIED_RESOURCE", undefined, { year, classLevel, stream }),
    recommendedAction: none(),
  };
}

export function resolveTimetableResource(input: string, state: LeadUpdate = {}): ResourceResolution | null {
  const text = normalizeVisitorText(input);
  const classLevel = requestedClass(text, state);
  const stream = requestedStream(text, state);
  const group = requestedGroup(text, state);
  if (!classLevel || !stream || !group) return null;

  const exact = verifiedResourceRegistry.find((resource) =>
    resource.type === "timetable" &&
    resource.classLevels?.includes(classLevel) &&
    resource.streams?.includes(stream) &&
    resource.group === group,
  );
  if (!exact) return null;
  return {
    status: "EXACT_RESOURCE_AVAILABLE",
    requestType: "timetable",
    exact,
    facts: [
      "RESOURCE_STATUS: EXACT_RESOURCE_AVAILABLE.",
      `Verified timetable resource: ${exact.title}.`,
      `Resource route: ${exact.route}.`,
      exact.assetPath ? `Resource asset: ${exact.assetPath}.` : "",
      "Use the verified route action; do not suggest a campus visit or another website to access this timetable.",
    ].filter(Boolean),
    recommendedAction: route(`Open ${group} Timetable`, exact.route),
  };
}

export function resolveMediaResource(input: string, state: LeadUpdate = {}): ResourceResolution | null {
  const text = normalizeVisitorText(`${input} ${state.question ?? ""}`);
  let exact = verifiedResourceRegistry.find((resource) => resource.type === "video" && /classroom/i.test(resource.title) && /classroom/i.test(text));
  if (!exact && /testimonial|student voice/i.test(text)) exact = verifiedResourceRegistry.find((resource) => resource.type === "video" && /testimonial/i.test(resource.title));
  if (!exact && /girls/i.test(text)) exact = verifiedResourceRegistry.find((resource) => resource.type === "video" && resource.campus === "Girls Campus");
  if (!exact && /boys/i.test(text)) exact = verifiedResourceRegistry.find((resource) => resource.type === "video" && resource.campus === "Boys Campus");
  if (!exact && /sir saqib|introduction|academy/i.test(text)) exact = verifiedResourceRegistry.find((resource) => resource.type === "video" && /academy introduction/i.test(resource.title));
  if (!exact && /result/i.test(text)) exact = verifiedResourceRegistry.find((resource) => resource.type === "video" && /results/i.test(resource.title));
  if (!exact) return null;
  return {
    status: "EXACT_RESOURCE_AVAILABLE",
    requestType: "video",
    exact,
    facts: [
      "RESOURCE_STATUS: EXACT_RESOURCE_AVAILABLE.",
      `Verified video resource: ${exact.title}.`,
      `Resource route: ${exact.route}.`,
      exact.assetPath ? `Resource asset: ${exact.assetPath}.` : "",
    ].filter(Boolean),
    recommendedAction: route(/classroom/i.test(exact.title) ? "Watch Classroom Video" : `Watch ${exact.title}`, exact.route),
  };
}
