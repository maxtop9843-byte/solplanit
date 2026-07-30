import { describe, expect, it } from "vitest";
import { SITE_URL } from "./site";
import {
  assertUniqueStructuredDataIds,
  buildBreadcrumbNode,
  buildCalculatorNode,
  buildFaqNode,
  buildWebPageNode,
} from "./structuredData";

describe("structured data builders", () => {
  const graph = [
    buildWebPageNode("/solar/example", "예시 페이지", "예시 설명"),
    buildBreadcrumbNode("/solar/example", [{ label: "홈", href: "/" }, { label: "예시" }]),
    buildFaqNode("/solar/example", [{ question: "질문", answer: "답변" }]),
    buildCalculatorNode({
      path: "/solar/example",
      name: "예시 계산기",
      description: "예시 설명",
      features: ["용량 계산"],
      assumptions: ["예상값"],
    }),
  ];

  it("uses one unique id per page node", () => {
    expect(assertUniqueStructuredDataIds(graph)).toBe(true);
    expect(graph.map((node) => node["@type"])).toEqual([
      "WebPage",
      "BreadcrumbList",
      "FAQPage",
      "SoftwareApplication",
    ]);
  });

  it("references global organization and website instead of duplicating them", () => {
    expect(graph.some((node) => node["@type"] === "Organization" || node["@type"] === "WebSite")).toBe(false);
    expect(graph[0]).toMatchObject({
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
    });
  });

  it("serializes accessible FAQ answers and free calculator offer", () => {
    expect(graph[2]).toMatchObject({
      mainEntity: [{ acceptedAnswer: { text: "답변" } }],
    });
    expect(graph[3]).toMatchObject({
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { price: "0", priceCurrency: "KRW" },
    });
  });
});
