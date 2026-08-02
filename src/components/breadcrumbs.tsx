import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/site-url";

export function Breadcrumbs({ current, path, inverse = false }: { current: string; path: string; inverse?: boolean }) {
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
      <nav className={`flex items-center gap-1.5 text-sm ${inverse ? "text-white/55" : "text-muted"}`} aria-label="Breadcrumb">
        <Link href="/" className={`transition ${inverse ? "hover:text-white" : "hover:text-ink"}`}>Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className={inverse ? "text-gold-light" : "text-girls"}>{current}</span>
      </nav>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
}
