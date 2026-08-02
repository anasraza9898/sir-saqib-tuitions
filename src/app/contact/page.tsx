import type { Metadata } from "next";
import { ArrowDown, MessageCircle, Phone } from "lucide-react";
import { CampusContactSelector } from "@/components/campus-contact-selector";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { telHref, whatsappHref } from "@/lib/utils";

export const metadata: Metadata = createMetadata("Contact Admissions", "Contact Sir Saqib Tuitions admissions or reach the Boys, Girls and Hill Park campuses in Karachi.", "/contact");

export default function ContactPage() {
  return (
    <>
      <PageHero title="A clear next step for admissions" path="/contact" description="Choose a campus, call directly or prepare a detailed WhatsApp enquiry for Sir Saqib Tuitions." tone="cream" index="08">
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <a href={telHref(site.admissionsPhone)} className="button-ink"><Phone size={17} /> Call admissions</a>
          <a href={whatsappHref(site.whatsapp, "Hello, I would like admissions information for Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="button-outline"><MessageCircle size={17} /> WhatsApp</a>
        </div>
      </PageHero>
      <section className="section-pad bg-paper">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:items-end">
            <SectionHeading eyebrow="Campus contact" title="Start with the right location." description="Each campus has direct call, WhatsApp and map-search actions." />
            <a href="#enquiry" className="button-paper justify-self-start lg:justify-self-end">Build an enquiry <ArrowDown size={16} /></a>
          </div>
          <div className="mt-10"><CampusContactSelector /></div>
        </div>
      </section>
      <section className="section-pad scroll-mt-28 bg-cream" id="enquiry">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="WhatsApp enquiry" title="Give admissions the useful details first." description="Choose a campus and programme, then open a ready-to-send WhatsApp message." />
            <div className="mt-8 border-l-2 border-gold bg-paper p-5"><p className="text-sm leading-7 text-muted"><strong className="text-ink">Current-information note.</strong> Admissions will provide fees, exact timings, documents and availability. The website does not store this form.</p></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
