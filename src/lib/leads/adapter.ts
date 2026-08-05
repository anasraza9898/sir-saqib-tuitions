import type { StoredLead } from "../ai/lead.ts";

export type LeadMetadata = {
  submittedAt: string;
  source: "ai-admissions-assistant";
};

export type LeadAdapterResult = {
  stored: boolean;
  provider: "local-development" | "google-sheets";
  referenceId?: string;
};

export interface LeadAdapter {
  submit(lead: StoredLead, metadata: LeadMetadata): Promise<LeadAdapterResult>;
}
