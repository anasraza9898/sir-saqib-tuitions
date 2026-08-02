import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, ExternalLink, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Privacy Notice", "How the current Sir Saqib Tuitions website handles WhatsApp enquiries and external links.", "/privacy");

const notices = [
  { title: "No website lead storage", text: "The enquiry builder prepares a WhatsApp message in your browser. The current website does not send or store those details in a Sir Saqib Tuitions database.", icon: Database },
  { title: "External services", text: "WhatsApp and Google Maps links open third-party services. Their privacy practices apply after you leave this website.", icon: ExternalLink },
  { title: "Future integrations", text: "Any future AI or lead-capture integration will need secure server-side handling and an updated notice before it is enabled.", icon: ShieldCheck },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy, stated plainly" path="/privacy" description="A concise explanation of how enquiries and external services work on the current website." tone="paper" index="09" />
      <section className="section-pad bg-cream">
        <div className="container-wide max-w-5xl">
          <div className="border-y border-cream-deep">
            {notices.map(({ title, text, icon: Icon }, index) => (
              <article key={title} className="grid gap-5 border-b border-cream-deep bg-paper px-5 py-7 last:border-0 sm:grid-cols-[3rem_0.62fr_1.38fr] sm:items-start sm:px-7">
                <span className="font-display text-xl text-gold">0{index + 1}</span>
                <h2 className="flex items-center gap-3 font-display text-2xl text-ink"><Icon size={19} className="text-girls" />{title}</h2>
                <p className="text-sm leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>
          <Link href="/contact" className="button-outline mt-8"><ArrowLeft size={16} /> Back to contact</Link>
        </div>
      </section>
    </>
  );
}
