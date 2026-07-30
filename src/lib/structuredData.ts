import { SITE_NAME, SITE_URL } from "./site";

export type BreadcrumbItem = { label: string; href?: string };
export type FaqItem = { question: string; answer: string };

const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

export function buildWebPageNode(path: string, name: string, description: string) {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function buildBreadcrumbNode(path: string, items: BreadcrumbItem[]) {
  const pageUrl = absoluteUrl(path);
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href ?? path),
    })),
  };
}

export function buildFaqNode(path: string, faqs: FaqItem[]) {
  const pageUrl = absoluteUrl(path);
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function buildCalculatorNode({
  path,
  name,
  description,
  features,
  assumptions,
}: {
  path: string;
  name: string;
  description: string;
  features: string[];
  assumptions: string[];
}) {
  const pageUrl = absoluteUrl(path);
  return {
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#calculator`,
    name,
    description,
    url: pageUrl,
    applicationCategory: "CalculatorApplication",
    applicationSubCategory: "태양광 설치 계산기",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    featureList: features,
    additionalProperty: assumptions.map((value) => ({
      "@type": "PropertyValue",
      name: "계산 가정 및 한계",
      value,
    })),
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export function assertUniqueStructuredDataIds(graph: Record<string, unknown>[]) {
  const ids = graph.map((node) => node["@id"]).filter((id): id is string => typeof id === "string");
  return ids.length === new Set(ids).size;
}

export const structuredDataSiteName = SITE_NAME;
