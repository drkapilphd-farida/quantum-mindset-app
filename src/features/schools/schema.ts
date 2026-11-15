import { SITE_URL } from "@/lib/seo/siteUrl";
import { brand, contact, trainer } from "@/config/site.config";
import { SCHOOLS_COPY, SCHOOLS_PATH } from "./copy";

// schema.org JSON-LD for /schools: Mind Ur Mind as an EducationalOrganization
// and the assessment as a Service it provides to schools. Same
// escape-then-inject pattern as organizationSchema.ts.
export function buildSchoolsSchema(): string {
  const org = {
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: brand.name,
    url: SITE_URL,
    email: contact.email,
    founder: { "@type": "Person", name: trainer.name },
    address: { "@type": "PostalAddress", addressLocality: "Vadodara", addressRegion: "Gujarat", addressCountry: "IN" },
  };
  const service = {
    "@type": "Service",
    name: "Sharp Brain for Schools: EEG Brain & Focus Assessment",
    serviceType: "Educational assessment of focus, memory and reading for school students",
    description: SCHOOLS_COPY.en.meta.description,
    url: `${SITE_URL}${SCHOOLS_PATH}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "India" },
    audience: { "@type": "EducationalAudience", educationalRole: "school" },
    availableLanguage: ["en", "hi"],
  };
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [org, service] }).replace(/</g, "\\u003c");
}
