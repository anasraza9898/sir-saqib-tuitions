import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, ExternalLink, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Privacy Notice",
  "Read how the Phase 1 Sir Saqib Tuitions website handles enquiries and external WhatsApp and map links.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy notice" path="/privacy" description="A concise explanation of data handling in the current Phase 1 website." />
      <section className="section-pad bg-cream-50">
        <div className="container-shell max-w-4xl">
          <div className="space-y-5">
            <article className="rounded-md border border-navy-900/10 bg-white p-6"><Database className="text-gold-700" /><h2 className="mt-5 font-display text-2xl font-bold">No website lead storage</h2><p className="mt-3 text-sm leading-7 text-navy-600">The current enquiry form prepares a WhatsApp message in your browser. It does not send or store the entered information in a Sir Saqib Tuitions website database.</p></article>
            <article className="rounded-md border border-navy-900/10 bg-white p-6"><ExternalLink className="text-gold-700" /><h2 className="mt-5 font-display text-2xl font-bold">External services</h2><p className="mt-3 text-sm leading-7 text-navy-600">WhatsApp and Google Maps links open third-party services. Their privacy practices apply after you leave this website.</p></article>
            <article className="rounded-md border border-navy-900/10 bg-white p-6"><ShieldCheck className="text-gold-700" /><h2 className="mt-5 font-display text-2xl font-bold">Future integrations</h2><p className="mt-3 text-sm leading-7 text-navy-600">A future secure Gemini and Google Sheets phase will require its own server-side data handling, access controls and updated notice before any lead capture is enabled.</p></article>
          </div>
          <Link href="/contact" className="btn-secondary mt-8"><ArrowLeft size={16} /> Back to contact</Link>
        </div>
      </section>
    </>
  );
}
