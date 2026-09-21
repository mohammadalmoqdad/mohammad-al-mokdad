import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";
import { isPlaceholder } from "@/lib/utils";

function getMetadataBase(): URL {
  if (isPlaceholder(portfolio.siteUrl)) {
    return new URL("http://localhost:3001");
  }

  return new URL(portfolio.siteUrl);
}

export function getSiteMetadata(): Metadata {
  const metadataBase = getMetadataBase();

  return {
    metadataBase,
    title: {
      default: portfolio.seo.title,
      template: `%s — ${portfolio.name}`,
    },
    description: portfolio.seo.description,
    keywords: portfolio.seo.keywords,
    authors: [{ name: portfolio.name, url: metadataBase.toString() }],
    creator: portfolio.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: metadataBase.toString(),
      title: portfolio.seo.title,
      description: portfolio.seo.description,
      siteName: portfolio.name,
    },
    twitter: {
      card: "summary_large_image",
      title: portfolio.seo.title,
      description: portfolio.seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function getPersonJsonLd(): Record<string, unknown> {
  const sameAs = portfolio.social
    .map((item) => item.href)
    .filter((href) => !isPlaceholder(href));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.name,
    jobTitle: portfolio.role,
    email: `mailto:${portfolio.email}`,
    url: isPlaceholder(portfolio.siteUrl) ? undefined : portfolio.siteUrl,
    description: portfolio.seo.description,
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Angular",
      "Frontend product engineering",
      "Backend APIs",
      "Web performance",
      "Technical SEO",
    ],
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}
