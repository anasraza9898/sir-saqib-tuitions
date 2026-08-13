import type { Metadata } from "next";
import { CalendarDays, MessageCircle } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { TimetableExplorer } from "@/components/timetable-explorer";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import { timetables } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Timetables",
  "Find the latest Grade IX, X, XI and XII timetable posters at Sir Saqib Tuitions Karachi.",
  "/timetables",
);

export default function TimetablesPage() {
  return (
    <>
      <PageHero title="Find your class timetable" path="/timetables" description="Select a grade and programme to view the latest timetable provided by Sir Saqib Tuitions." tone="paper" index="06">
        <div className="flex items-center gap-4 border-l border-gold pl-5"><CalendarDays className="text-girls" /><div><p className="font-display text-3xl text-ink">{timetables.length}</p><p className="text-xs font-bold uppercase text-muted">Poster options</p></div></div>
      </PageHero>

      <section className="section-space bg-cream">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-end">
            <SectionHeading eyebrow="Timetable finder" title="Choose the exact grade and programme." description="The finder shows only the approved timetable images supplied for Grades IX, X, XI and XII." />
            <div className="grid grid-cols-3 border-y border-cream-deep text-center">
              <div className="border-r border-cream-deep py-5"><p className="font-display text-2xl text-ink">IX-XII</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Grades</p></div>
              <div className="border-r border-cream-deep py-5"><p className="font-display text-2xl text-girls">3</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Programmes</p></div>
              <div className="py-5"><p className="font-display text-2xl text-ink">{timetables.length}</p><p className="mt-1 text-[10px] font-bold uppercase text-muted">Timetables</p></div>
            </div>
          </div>
          <div className="mt-10"><TimetableExplorer /></div>
          <div className="mt-6 flex flex-col gap-4 border-l-2 border-gold bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-muted"><strong className="text-ink">Need confirmation?</strong> Timetables can change. Check the current schedule with admissions before travelling.</p>
            <WhatsAppChooserButton message="Hello, I would like to confirm a timetable at Sir Saqib Tuitions." className="button-outline shrink-0"><MessageCircle size={16} /> Confirm on WhatsApp</WhatsAppChooserButton>
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
