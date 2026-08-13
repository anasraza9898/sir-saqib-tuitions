import type { Metadata } from "next";
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
      <PageHero title="Experience Sir Saqib Tuitions beyond the classroom." path="/media" description="Explore academy introductions, campus environments, classroom learning, student achievements and experiences through our official video collection." tone="ink" index="07" />
      <section className="section-space bg-cream">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
            <SectionHeading eyebrow="Academy recordings" title="Explore life and learning at Sir Saqib Tuitions." />
          </div>
          <div className="mt-14"><MediaGallery /></div>
        </div>
      </section>
      <AdmissionsCta />
    </>
  );
}
