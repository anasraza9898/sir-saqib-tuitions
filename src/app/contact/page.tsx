import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { CampusCard } from "@/components/campus-card";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { campuses, site } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { telHref, whatsappHref } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "Contact",
  "Contact Sir Saqib Tuitions admissions or reach the Boys, Girls and Hill Park campuses in Karachi.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact admissions" path="/contact" description="Call, WhatsApp or prepare an enquiry for the appropriate Sir Saqib Tuitions campus in Karachi.">
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <a href={telHref(site.admissionsPhone)} className="btn-gold"><Phone size={17} />{site.admissionsPhone}</a>
          <a href={whatsappHref(site.whatsapp, "Hello, I would like admissions information for Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="btn-outline-light"><MessageCircle size={17} />WhatsApp</a>
        </div>
      </PageHero>
      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <SectionHeading eyebrow="Campus contacts" title="Reach the right location directly." description="Each address, phone number and map search link is based on the verified information supplied for this build." />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">{campuses.map((campus) => <CampusCard key={campus.id} campus={campus} />)}</div>
        </div>
      </section>
      <section className="section-pad scroll-mt-28 bg-white" id="enquiry">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Enquiry" title="Prepare your admissions message." description="The form opens WhatsApp with the details you provide. This Phase 1 website has no database and does not store your submission." />
            <div className="mt-7 space-y-4 text-sm leading-6 text-navy-600">
              <p className="flex gap-3"><Phone size={17} className="mt-1 shrink-0 text-gold-700" /><span><strong className="text-navy-950">Call for current information</strong><br />Confirm fees, exact timings, documents and availability directly.</span></p>
              <p className="flex gap-3"><MapPin size={17} className="mt-1 shrink-0 text-gold-700" /><span><strong className="text-navy-950">Choose a campus</strong><br />Your message is routed to the selected campus number.</span></p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
