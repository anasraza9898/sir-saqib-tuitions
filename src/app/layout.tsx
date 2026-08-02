import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { ClientProviders } from "@/components/client-providers";
import { FloatingActions } from "@/components/floating-actions";
import { RouteTransition } from "@/components/motion-system";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { campuses, site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Sir Saqib Tuitions Karachi | Grades IX-XII, Science, General & Commerce",
    template: "%s | Sir Saqib Tuitions",
  },
  description: "Explore courses, campuses, faculty, results and timetables at Sir Saqib Tuitions in Karachi for Grades IX-XII, Science, General, Commerce and Huffaz programmes.",
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "education",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/assets/logo/sir-saqib-tuitions-logo.webp", type: "image/webp" }],
    apple: [{ url: "/assets/logo/sir-saqib-tuitions-logo.webp", type: "image/webp" }],
  },
  openGraph: {
    title: "Sir Saqib Tuitions Karachi",
    description: "Focused learning for Grades IX-XII, foundation tuition for Grades I-VIII and formal education support for Huffaz across three Karachi campuses.",
    type: "website",
    locale: "en_PK",
    url: "/",
    siteName: site.name,
    images: [{ url: "/assets/posters/current-facebook-poster.webp", width: 1500, height: 1000, alt: "Sir Saqib Tuitions admissions and academy information" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sir Saqib Tuitions Karachi",
    description: "A Path to Sound Success in Education.",
    images: ["/assets/posters/current-facebook-poster.webp"],
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081126",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl.href}#organization`,
      name: site.name,
      slogan: site.tagline,
      description: site.description,
      url: siteUrl.href,
      logo: new URL("/assets/logo/sir-saqib-tuitions-logo.webp", siteUrl).href,
      telephone: site.admissionsPhone,
      areaServed: "Karachi, Pakistan",
    },
    ...campuses.map((campus) => ({
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": `${siteUrl.href}#${campus.id}-campus`,
      name: `${site.name} - ${campus.name}`,
      parentOrganization: { "@id": `${siteUrl.href}#organization` },
      address: {
        "@type": "PostalAddress",
        streetAddress: campus.address,
        addressLocality: "Karachi",
        addressCountry: "PK",
      },
      telephone: campus.phones,
      url: new URL("/campuses", siteUrl).href,
    })),
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${dmSerif.variable} antialiased`}>
        <a href="#main-content" className="fixed left-3 top-3 z-[120] -translate-y-20 rounded-sm bg-gold px-4 py-2 text-sm font-bold text-ink transition focus:translate-y-0">Skip to content</a>
        <ClientProviders>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main-content"><RouteTransition>{children}</RouteTransition></main>
          <SiteFooter />
          <FloatingActions />
        </ClientProviders>
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </body>
    </html>
  );
}
