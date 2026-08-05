import type { LeadAdapter, LeadAdapterResult, LeadMetadata } from "./adapter.ts";
import type { StoredLead } from "../ai/lead.ts";

export class LocalDevelopmentLeadAdapter implements LeadAdapter {
  async submit(lead: StoredLead, metadata: LeadMetadata): Promise<LeadAdapterResult> {
    void lead;
    void metadata;
    // Intentionally does not write lead data to disk, logs, or an external service.
    return { stored: false, provider: "local-development" };
  }
}
