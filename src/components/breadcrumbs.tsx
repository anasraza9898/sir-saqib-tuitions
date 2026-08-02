import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/site-url";

export function Breadcrumbs({ current, path }: { current: string; path: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.href },
      { "@type": "ListItem", position: 2, name: current, item: new URL(path, siteUrl).href },
    ],
  };

  return (
    <>
      <nav className="flex items-center gap-1.5 text-sm text-cream-100/70" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-white">Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-gold-200">{current}</span>
      </nav>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
}
