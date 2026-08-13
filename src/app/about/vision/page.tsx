import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, Telescope } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MotionStagger, MotionStaggerItem } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { missionVision } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Our Vision",
  "The vision of Sir Saqib Tuitions: a disciplined learning environment where students build knowledge, confidence and long-term academic progress.",
  "/about/vision",
);

const visionPoints = [
  { title: "Long-term progress", text: "Students develop habits and understanding that support more than a single exam cycle.", icon: Telescope },
  { title: "Academic confidence", text: "Knowledge, discipline and consistent practice help students approach each stage with clarity.", icon: GraduationCap },
  { title: "Focused environment", text: "A structured setting supports attention, study discipline and serious academic preparation.", icon: ShieldCheck },
] as const;

export default function VisionPage() {
  return (
    <>
      <PageHero title="Our Vision" path="/about/vision" description={missionVision.vision.body} tone="ink" index="">
        <div className="border-l border-gold/50 pl-5 text-white"><p className="font-display text-5xl text-gold-light">3</p><p className="mt-1 text-xs font-bold uppercase text-white/50">Campuses</p></div>
      </PageHero>

      <section className="section-space bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Vision statement" title={missionVision.vision.title} description={missionVision.vision.body} />
            <Link href="/about/mission" className="button-paper mt-7">Our Mission <ArrowRight size={16} /></Link>
          </div>
          <MotionStagger className="border-y border-cream-deep">
            {visionPoints.map(({ title, text, icon: Icon }, index) => (
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
