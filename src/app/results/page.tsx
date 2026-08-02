import type { Metadata } from "next";
import { ArrowDown, Award } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MotionReveal } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { PremiumVideo } from "@/components/premium-video";
import { ResultsShowcase } from "@/components/result-gallery";
import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Results",
  "View the latest 2026 Sir Saqib Tuitions Matric results and clearly separated 2025 academic highlights.",
  "/results",
);

export default function ResultsPage() {
  return (
    <>
      <PageHero title="Achievement, year by year" path="/results" description="Explore the academy's real result posters, with 2026 presented first and 2025 preserved as previous academic highlights." tone="ink" index="05">
        <a href="#result-gallery" className="button-light">View result gallery <ArrowDown size={16} /></a>
      </PageHero>

      <section id="result-gallery" className="section-pad scroll-mt-28 bg-paper">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-end">
            <SectionHeading eyebrow="2026 / Latest results" title="The latest result collection." description="Switch years, open any poster, then use keyboard or on-screen controls to move through the gallery." />
            <div className="border-l border-gold pl-6"><p className="font-display text-6xl text-ink">2026</p><p className="mt-2 text-xs font-bold uppercase text-muted">Latest academic year in the result collection</p></div>
          </div>
          <div className="mt-12"><ResultsShowcase /></div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <MotionReveal>
            <Award size={25} className="text-girls" />
            <p className="eyebrow mt-6 text-girls">2026 result film</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl">Matric Science high achievers.</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">Play the original academy result video on demand. Sound begins after your interaction, and other media pauses automatically.</p>
          </MotionReveal>
          <PremiumVideo id="results-page-2026" src="/assets/videos/results/matric-science-high-achievers-2026.mp4" poster="/assets/posters/video/results-2026.webp" title="2026 Matric Science high achievers" duration="0:15" label="2026 Results" className="mx-auto aspect-[9/16] max-w-md" />
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
