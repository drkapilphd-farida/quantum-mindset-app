// schema.org Course JSON-LD — same server-side, escape-then-inject
// pattern as faqSchema.ts. Quantum Speed Reading is this site's primary,
// front-facing brand identity (audience: Students), so it gets the
// canonical Course entity; the retreat is a secondary Course entity with
// plain, non-spiritual/psychic wording in the schema text specifically —
// the page's own body content is unaffected, this only controls what a
// crawler reads as the program's name/description.
import { SITE_URL } from './siteUrl'

type CourseSchemaInput = {
  name: string
  description: string
  url: string
  audienceType: string
}

export function buildCourseSchema({ name, description, url, audienceType }: CourseSchemaInput): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "Mind Ur Mind",
      sameAs: SITE_URL,
    },
    audience: {
      "@type": "Audience",
      audienceType,
    },
  };

  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
