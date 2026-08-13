import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Target, UsersRound } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MotionStagger, MotionStaggerItem } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { missionVision } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Our Mission",
  "The mission of Sir Saqib Tuitions: focused, disciplined and accessible academic support through clear instruction, assessment and individual attention.",
  "/about/mission",
);

const missionPoints = [
  { title: "Focused instruction", text: "Clear teaching keeps students connected to their curriculum and academic pathway.", icon: Target },
  { title: "Regular assessment", text: "Assessments make progress visible and help families understand the next academic step.", icon: ClipboardCheck },
  { title: "Individual attention", text: "Disciplined support helps students strengthen foundations and build confidence.", icon: UsersRound },
] as const;

export default function MissionPage() {
  return (
    <>
      <PageHero title="Our Mission" path="/about/mission" description={missionVision.mission.body} tone="cream" index="">
        <div className="border-l border-gold pl-5"><p className="font-display text-4xl text-ink sm:text-5xl">Academic Support</p><p className="mt-1 text-xs font-bold uppercase text-muted">Structured student guidance</p></div>
      </PageHero>

      <section className="section-space bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Mission statement" title={missionVision.mission.title} description={missionVision.mission.body} />
            <Link href="/about/vision" className="button-paper mt-7">Our Vision <ArrowRight size={16} /></Link>
          </div>
          <MotionStagger className="border-y border-cream-deep">
            {missionPoints.map(({ title, text, icon: Icon }, index) => (
              <MotionStaggerItem key={title} className="grid gap-4 border-b border-cream-deep bg-paper px-3 py-6 last:border-b-0 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:items-start sm:px-5">
                <span className="font-display text-2xl text-gold">0{index + 1}</span>
                <div><Icon size={20} className="text-girls" /><h2 className="mt-4 font-display text-2xl text-ink">{title}</h2><p className="mt-3 text-sm leading-7 text-muted">{text}</p></div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      <AdmissionsCta />
    </>
  );
}
