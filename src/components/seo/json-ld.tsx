import { getPersonJsonLd } from "@/lib/seo";

export function JsonLd() {
  const json = getPersonJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
