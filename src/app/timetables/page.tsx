import type { Metadata } from "next";
import { CalendarDays, Info, MessageCircle } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { TimetableExplorer } from "@/components/timetable-explorer";
import { site, timetables } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { whatsappHref } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "Timetables",
  "Filter the real Sir Saqib Tuitions Boys and Girls timetable posters by class, stream and batch.",
  "/timetables",
);

export default function TimetablesPage() {
  return (
    <>
      <PageHero title="Class timetables" path="/timetables" description="Browse the supplied Boys and Girls timetable posters by class, group and batch without fabricated schedule text." />
      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="bg-white p-5"><CalendarDays size={21} className="text-gold-700" /><p className="mt-4 font-display text-2xl font-bold">{timetables.length} posters</p><p className="mt-1 text-sm text-navy-600">Structured from the supplied optimized files.</p></div>
            <div className="bg-white p-5"><p className="text-xs font-bold uppercase text-burgundy-700">Campuses</p><p className="mt-4 font-display text-2xl font-bold">Boys & Girls</p><p className="mt-1 text-sm text-navy-600">Separate campus selections.</p></div>
            <div className="bg-white p-5"><p className="text-xs font-bold uppercase text-burgundy-700">Classes</p><p className="mt-4 font-display text-2xl font-bold">IX-XII</p><p className="mt-1 text-sm text-navy-600">Science, General and Commerce where published.</p></div>
          </div>
          <div className="mt-12"><SectionHeading eyebrow="Timetable finder" title="Select the poster you need." description="Only the selected image is rendered. This keeps the page light on mobile devices." /></div>
          <div className="mt-8"><TimetableExplorer /></div>
          <div className="mt-6 flex flex-col gap-4 rounded-sm border border-navy-900/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex max-w-2xl gap-3 text-sm leading-6 text-navy-600"><Info size={18} className="mt-0.5 shrink-0 text-burgundy-700" />Timetable details can change. Confirm any last-minute update with the relevant campus before travelling.</p>
            <a href={whatsappHref(site.whatsapp, "Hello, I would like to confirm a timetable at Sir Saqib Tuitions.")} target="_blank" rel="noreferrer" className="btn-secondary shrink-0"><MessageCircle size={16} /> Confirm timetable</a>
          </div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
