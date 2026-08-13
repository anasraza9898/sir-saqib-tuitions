import type { Metadata } from "next";
import { ArrowDown, Award } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MotionReveal } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { PremiumVideo } from "@/components/premium-video";
import { ResultsShowcase } from "@/components/result-gallery";
import { SectionHeading } from "@/components/section-heading";
import { mediaItems } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Results",
  "View the latest 2026 Sir Saqib Tuitions Matric results and clearly separated 2025 academic highlights.",
  "/results",
);

export default function ResultsPage() {
  const resultsMedia = mediaItems.find((item) => item.id === "results-2026");

  return (
    <>
      <PageHero title="Achievement, year by year" path="/results" description="Explore Sir Saqib Tuitions academic results and student achievements across recent years, presented through official result posters from the academy." tone="ink" index="05">
        <a href="#result-gallery" className="button-light">View result gallery <ArrowDown size={16} /></a>
      </PageHero>

      <section id="result-gallery" className="section-space scroll-mt-28 bg-paper">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.64fr_1.36fr] lg:items-center">
            <SectionHeading eyebrow="2026 / Latest results" title="The latest result collection." description="Open any official poster from the current result collection, then switch years to view earlier academic highlights." />
            <div className="bg-cream p-6"><p className="font-display text-6xl text-ink">2026</p><p className="mt-3 text-xs font-bold uppercase text-muted">Latest academic year in the result collection</p></div>
          </div>
          <div className="mt-12"><ResultsShowcase /></div>
        </div>
      </section>

      <section className="section-space bg-cream">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <MotionReveal>
            <Award size={25} className="text-girls" />
            <p className="eyebrow mt-6 text-girls">2026 result film</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl">Matric Science high achievers.</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">Watch highlights celebrating the outstanding performance and academic achievements of our Matric Science students.</p>
          </MotionReveal>
          <PremiumVideo id="results-page-2026" src={resultsMedia?.src} poster={resultsMedia?.poster} title="2026 Matric Science high achievers" duration={resultsMedia?.duration} label="2026 Results" className="mx-auto aspect-[9/16] max-w-md" />
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
