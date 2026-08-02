import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/courses", "/campuses", "/faculty", "/results", "/timetables", "/media", "/contact", "/privacy"];
  return routes.map((route) => ({
    url: new URL(route || "/", siteUrl).href,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
