import { describe, expect, it } from "vitest";
import { searchIntentPages } from "./searchIntentPages";
import { getIntentSeoGuide, homeSeoGuide, proSeoGuide } from "./seoGuides";

function expectCompleteGuide(guide: ReturnType<typeof getIntentSeoGuide>) {
  expect(guide.breadcrumb.length).toBeGreaterThanOrEqual(2);
  expect(guide.intro.length).toBeGreaterThan(80);
  expect(guide.example.inputs.length).toBeGreaterThanOrEqual(3);
  expect(guide.example.result.length).toBeGreaterThan(10);
  expect(guide.faqs).toHaveLength(3);
  expect(new Set(guide.faqs.map(({ question }) => question)).size).toBe(3);
  expect(guide.links.length).toBeGreaterThanOrEqual(3);
  for (const link of guide.links) expect(link.href.startsWith("/")).toBe(true);
}

describe("SEO-003 explanatory content", () => {
  it("covers the public calculator and professional entry", () => {
    expectCompleteGuide(homeSeoGuide);
    expectCompleteGuide(proSeoGuide);
  });

  it("gives every search-intent page a worked example, FAQs and internal links", () => {
    for (const page of searchIntentPages) {
      const guide = getIntentSeoGuide(page.slug, page.title);
      expectCompleteGuide(guide);
      expect(guide.breadcrumb.at(-1)?.label).toBe(page.title);
    }
  });
});
