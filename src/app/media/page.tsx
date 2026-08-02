import type { Metadata } from "next";
import { Headphones, Video } from "lucide-react";
import { AdmissionsCta } from "@/components/admissions-cta";
import { MediaGallery } from "@/components/media-gallery";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(
  "Media",
  "Watch real Sir Saqib Tuitions academy, campus, classroom, results and testimonial videos on demand.",
  "/media",
);

export default function MediaPage() {
  return (
    <>
      <PageHero title="See the academy in motion" path="/media" description="Choose from academy introductions, campus views, classroom learning, results and student voices." tone="ink" index="07">
        <div className="flex gap-5 text-white/62"><Video /><Headphones /><span className="text-xs font-bold uppercase">Play on demand</span></div>
      </PageHero>
      <section className="section-pad bg-cream">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
            <SectionHeading eyebrow="Academy recordings" title="One focused player. Six real perspectives." description="Select a category below the player. Only the active video element is rendered, keeping the experience light on mobile." />
            <div className="hidden border-l border-gold pl-6 lg:block"><p className="font-display text-5xl text-ink">Sound on tap</p><p className="mt-2 text-sm text-muted">Every non-hero video waits for your interaction.</p></div>
          </div>
          <div className="mt-12"><MediaGallery /></div>
          <p className="mt-5 text-xs leading-6 text-muted">Student recordings are presented in their original video form; a written transcript is not currently available.</p>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
