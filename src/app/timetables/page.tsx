import type { Metadata } from "next";
import { CalendarDays, MessageCircle } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { TimetableExplorer } from "@/components/timetable-explorer";
import { site, timetables } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { whatsappHref } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "Timetables",
  "Find real Boys and Girls campus timetable posters by class, stream and batch at Sir Saqib Tuitions Karachi.",
  "/timetables",
);

export default function TimetablesPage() {
  return (
    <>
      <PageHero title="Find the right timetable" path="/timetables" description="Filter the academy's published Boys and Girls timetable posters by class, stream and batch." tone="paper" index="06">
        <div className="flex items-center gap-4 border-l border-gold pl-5"><CalendarDays className="text-girls" /><div><p className="font-display text-3xl text-ink">{timetables.length}</p><p className="text-xs font-bold uppercase text-muted">Poster options</p></div></div>
      </PageHero>

      <section className="section-pad bg-cream">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-end">
            <SectionHeading eyebrow="Timetable finder" title="One selection. One clear poster." description="Your selection is reflected in the page URL, making the exact timetable easier to revisit or share." />
            <div className="grid grid-cols-3 border-y border-cream-deep text-center">
              <div className="border-r border-cream-deep py-5"><p className="font-display text-2xl text-ink">Boys</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Campus</p></div>
              <div className="border-r border-cream-deep py-5"><p className="font-display text-2xl text-girls">Girls</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Campus</p></div>
              <div className="py-5"><p className="font-display text-2xl text-ink">IX-XII</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Classes</p></div>
            </div>
          </div>
          <div className="mt-10"><TimetableExplorer /></div>
          <div className="mt-6 flex flex-col gap-4 border-l-2 border-gold bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-muted"><strong className="text-ink">Planning a visit?</strong> Timetables can change. Check the current schedule with the relevant campus before travelling.</p>
            <a href={whatsappHref(site.whatsapp, "Hello, I would like to confirm a timetable at Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="button-outline shrink-0"><MessageCircle size={16} /> Confirm on WhatsApp</a>
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
