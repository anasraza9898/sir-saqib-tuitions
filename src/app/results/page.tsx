import type { Metadata } from "next";
import { Award, CalendarCheck } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MediaPlayer } from "@/components/media-player";
import { PageHero } from "@/components/page-hero";
import { ResultGallery } from "@/components/result-gallery";
import { SectionHeading } from "@/components/section-heading";
import { results2025, results2026 } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Results",
  "View the latest 2026 Sir Saqib Tuitions Matric results and previous 2025 academic highlights.",
  "/results",
);

export default function ResultsPage() {
  return (
    <>
      <PageHero title="Academic results" path="/results" description="Published result highlights organized accurately by academic year, with 2026 presented as the latest results." />
      <section className="section-pad bg-cream-50">
        <div className="container-shell">
          <div className="flex items-start gap-4 border-l-2 border-gold-500 bg-white p-5">
            <CalendarCheck size={23} className="shrink-0 text-burgundy-700" />
            <p className="text-sm leading-6 text-navy-600"><strong className="text-navy-950">Year labels are preserved.</strong> The posters below are grouped by the year printed in the supplied result assets. No percentage or success claim has been added by the website.</p>
          </div>
          <div className="mt-12"><SectionHeading eyebrow="Latest results" title="2026 Matric highlights." description="Published results from Boys and Girls campuses." /></div>
          <div className="mt-10"><ResultGallery items={results2026} /></div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <Award size={28} className="text-gold-700" />
            <SectionHeading eyebrow="2026 video" title="Matric Science high achievers." description="A real academy result video. Play it on demand; it does not autoplay or load its full media payload initially." />
          </div>
          <MediaPlayer src="/assets/videos/results/matric-science-high-achievers-2026.mp4" poster="/assets/results/boys-matric-science-general-2026.webp" title="2026 Matric Science high achievers result video" className="aspect-video rounded-md" />
        </div>
      </section>
      <section className="section-pad border-t border-navy-900/10 bg-cream-50">
        <div className="container-shell">
          <SectionHeading eyebrow="Previous academic highlights" title="2025 results." description="Previous-year posters remain clearly separated from the latest 2026 result collection." />
          <div className="mt-10"><ResultGallery items={results2025} initialCount={2} /></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
