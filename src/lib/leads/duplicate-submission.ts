type SubmissionRecord = { expiresAt: number };

const globalStore = globalThis as typeof globalThis & {
  __sirSaqibLeadSubmissions?: Map<string, SubmissionRecord>;
};

const submissions = globalStore.__sirSaqibLeadSubmissions ?? new Map<string, SubmissionRecord>();
globalStore.__sirSaqibLeadSubmissions = submissions;

export function claimLeadSubmission(submissionId: string, now = Date.now(), ttlMs = 10 * 60_000): boolean {
  const current = submissions.get(submissionId);
  if (current && current.expiresAt > now) return false;
  submissions.set(submissionId, { expiresAt: now + ttlMs });
  if (submissions.size > 1_000) {
    for (const [key, value] of submissions) {
      if (value.expiresAt <= now) submissions.delete(key);
    }
  }
  return true;
}

export function releaseLeadSubmission(submissionId: string): void {
  submissions.delete(submissionId);
}
