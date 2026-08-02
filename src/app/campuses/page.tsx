import type { Metadata } from "next";
import Image from "next/image";
import { Bus, MapPinned, ShieldCheck } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { CampusCard } from "@/components/campus-card";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { campuses } from "@/data/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Campuses",
  "Find Boys, Girls and Hill Park campuses of Sir Saqib Tuitions in Karachi with verified addresses, phone numbers and map links.",
  "/campuses",
);

const posters = [
  { src: "/assets/posters/admission-boys-campus.webp", alt: "Sir Saqib Tuitions Boys Campus admissions poster" },
  { src: "/assets/posters/admission-girls-campus.webp", alt: "Sir Saqib Tuitions Girls Campus admissions poster" },
  { src: "/assets/posters/admission-hill-park-campus.webp", alt: "Sir Saqib Tuitions Hill Park Campus admissions poster" },
];

export default function CampusesPage() {
  return (
    <>
      <PageHero title="Karachi campuses" path="/campuses" description="Three academy locations with direct phone, WhatsApp and Google Maps search links based on the verified addresses." />
      <section className="section-pad bg-cream-50">
        <div className="container-shell grid gap-6 lg:grid-cols-3">{campuses.map((campus) => <CampusCard key={campus.id} campus={campus} />)}</div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-shell">
          <SectionHeading eyebrow="Campus information" title="Real academy locations and admissions media." description="The published campus posters are shown for reference. Contact the campus to confirm current admissions details." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posters.map((poster) => <div key={poster.src} className="relative aspect-[4/5] overflow-hidden rounded-md border border-navy-900/10 bg-cream-100"><Image src={poster.src} alt={poster.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain" /></div>)}
          </div>
        </div>
      </section>
      <section className="border-y border-navy-900/10 bg-cream-50 py-12">
        <div className="container-shell grid gap-5 md:grid-cols-3">
          <div className="flex gap-4"><ShieldCheck className="shrink-0 text-burgundy-700" /><div><h2 className="font-display text-xl font-bold">Secured environment</h2><p className="mt-2 text-sm leading-6 text-navy-600">A verified academy strength across the learning environment.</p></div></div>
          <div className="flex gap-4"><MapPinned className="shrink-0 text-burgundy-700" /><div><h2 className="font-display text-xl font-bold">Three locations</h2><p className="mt-2 text-sm leading-6 text-navy-600">Boys, Girls and Hill Park campuses in Karachi.</p></div></div>
          <div className="flex gap-4"><Bus className="shrink-0 text-burgundy-700" /><div><h2 className="font-display text-xl font-bold">Van service</h2><p className="mt-2 text-sm leading-6 text-navy-600">Available where offered. Confirm the current route and availability with admissions.</p></div></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
