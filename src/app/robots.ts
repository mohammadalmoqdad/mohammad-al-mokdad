import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { isPlaceholder } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const sitemap = isPlaceholder(portfolio.siteUrl)
    ? undefined
    : `${portfolio.siteUrl}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap,
  };
}
