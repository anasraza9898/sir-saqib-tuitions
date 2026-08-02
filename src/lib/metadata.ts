import type { Metadata } from "next";
import { site } from "@/data/site";

export function createMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: "en_PK",
      type: "website",
      images: [{ url: "/assets/posters/current-facebook-poster.webp", width: 1500, height: 1000, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/posters/current-facebook-poster.webp"],
    },
  };
}
