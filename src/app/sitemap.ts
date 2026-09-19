import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { isPlaceholder } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = isPlaceholder(portfolio.siteUrl)
    ? "http://localhost:3001"
    : portfolio.siteUrl;

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
