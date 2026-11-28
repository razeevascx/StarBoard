import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  return [
    { url: siteUrl.href, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/contact", siteUrl).href, changeFrequency: "yearly", priority: 0.3 },
    { url: new URL("/privacy", siteUrl).href, changeFrequency: "yearly", priority: 0.2 },
    { url: new URL("/terms", siteUrl).href, changeFrequency: "yearly", priority: 0.2 },
  ];
}
