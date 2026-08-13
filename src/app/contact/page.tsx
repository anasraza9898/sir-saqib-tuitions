import type { Metadata } from "next";
import { ArrowDown, MessageCircle, Phone } from "lucide-react";
import { CampusContactSelector } from "@/components/campus-contact-selector";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import { site } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = createMetadata("Contact Admissions", "Contact Sir Saqib Tuitions admissions or reach the Boys, Girls and Hill Park campuses in Karachi.", "/contact");

export default function ContactPage() {
  return (
    <>
      <PageHero title="A clear next step for admissions" path="/contact" description="Choose the campus most relevant to the student, then connect directly through call, WhatsApp or map for admission guidance." tone="cream" index="08">
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <a href={telHref(site.admissionsPhone)} className="button-ink"><Phone size={17} /> Call admissions</a>
          <WhatsAppChooserButton message="Hello, I would like admissions information for Sir Saqib Tuitions." className="button-outline"><MessageCircle size={17} /> WhatsApp</WhatsAppChooserButton>
        </div>
      </PageHero>
      <section className="section-space bg-paper">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:items-end">
            <SectionHeading eyebrow="Campus contact" title="Start with the right location." description="Choose the campus most relevant to the student, then connect directly through call, WhatsApp or map for admission guidance." />
            <a href="#enquiry" className="button-paper justify-self-start lg:justify-self-end">Build an enquiry <ArrowDown size={16} /></a>
          </div>
          <div className="mt-12"><CampusContactSelector /></div>
        </div>
      </section>
      <section className="section-space scroll-mt-28 bg-cream" id="enquiry">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="WhatsApp enquiry" title="Prepare your admission enquiry." description="Select the relevant programme and preferred campus, then review a ready-to-send WhatsApp message for the admissions team." />
            <div className="mt-8 border-l-2 border-gold bg-paper p-5"><p className="text-sm leading-7 text-muted">For current seat availability, admission documents and batch timing, the admissions team can confirm the latest information.</p></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
