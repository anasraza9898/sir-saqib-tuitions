import type { Metadata } from "next";
import { AdmissionsCta } from "@/components/admissions-cta";
import { PageHero } from "@/components/page-hero";
import { ProgramExplorer } from "@/components/program-explorer";
import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata("Courses", "Explore Grades I-VIII foundation tuition, Matric, Intermediate Pre-Medical, Pre-Engineering, General Science, Commerce and Huffaz programmes in Karachi.", "/courses");

export default function CoursesPage() {
  return (
    <>
      <PageHero title="Academic pathways with a clear next step" path="/courses" description="From Grades I-VIII foundation tuition to Matric, Intermediate and formal education support for Huffaz." tone="cream" index="02">
        <div className="border-l border-gold pl-5"><p className="font-display text-3xl text-ink">4 pathways</p><p className="mt-2 text-xs font-bold uppercase text-muted">Foundation to Intermediate</p></div>
      </PageHero>
      <section className="border-b border-cream-deep bg-paper py-10">
        <div className="container-wide grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Focused curriculum", "High-yield notes", "Monthly assessments", "Individual attention"].map((item, index) => <div key={item} className="flex items-center gap-4 border-r border-cream-deep py-3 last:border-r-0"><span className="font-display text-2xl text-gold">0{index + 1}</span><p className="text-sm font-bold text-ink">{item}</p></div>)}
        </div>
      </section>
      <section className="section-space bg-cream">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end"><SectionHeading eyebrow="Program finder" title="Start with a level. Compare the available programs." /><p className="body-lead max-w-2xl lg:justify-self-end">Select a pathway to review its programs and focus areas. Admissions can guide you on current timings and placement.</p></div>
          <div className="mt-10"><ProgramExplorer sticky /></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
