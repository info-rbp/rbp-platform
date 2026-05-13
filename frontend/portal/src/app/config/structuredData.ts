import { environment } from "./environment";

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Remote Business Partner",
    url: environment.publicSiteUrl,
  };
}

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Remote Business Partner",
    url: environment.publicSiteUrl,
  };
}

export function serviceStructuredData(
  name: string,
  description: string,
  path: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "Remote Business Partner",
    },
    url: `${environment.publicSiteUrl}${path}`,
  };
}
