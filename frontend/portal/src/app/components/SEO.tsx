import { useEffect } from "react";
import { useLocation } from "react-router";

import { environment } from "../config/environment";
import { getSeoForPath } from "../config/seo";

function upsertMeta(name: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertProperty(property: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", url);
}

export function SEO() {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(location.pathname);
    const canonicalUrl = `${environment.publicSiteUrl}${seo.canonicalPath}`;

    document.title = seo.title;

    upsertMeta("description", seo.description);
    upsertMeta("robots", seo.robots);
    upsertCanonical(canonicalUrl);

    upsertProperty("og:title", seo.ogTitle ?? seo.title);
    upsertProperty("og:description", seo.ogDescription ?? seo.description);
    upsertProperty("og:url", canonicalUrl);
    upsertProperty("og:type", "website");
    upsertProperty("og:site_name", "Remote Business Partner");

    const existing = document.querySelector("#rbp-structured-data");
    if (existing) {
      existing.remove();
    }

    if (seo.structuredData?.length) {
      const script = document.createElement("script");
      script.id = "rbp-structured-data";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(seo.structuredData);
      document.head.appendChild(script);
    }
  }, [location.pathname]);

  return null;
}
