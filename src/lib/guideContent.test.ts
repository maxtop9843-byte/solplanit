import { describe, expect, it } from "vitest";
import { GUIDE_ROUTES, getGuidePage, guidePages } from "./guideContent";

describe("evergreen guide content", () => {
  it("provides every required content hub without duplicate routes", () => {
    expect(guidePages.map((page) => page.slug)).toEqual([
      "installation-guide",
      "quote-review",
      "subsidy-framework",
      "glossary",
    ]);
    expect(new Set(GUIDE_ROUTES).size).toBe(GUIDE_ROUTES.length);
  });

  it("keeps guides substantive, reviewed, dated, and internally connected", () => {
    for (const page of guidePages) {
      expect(page.summary.length).toBeGreaterThan(45);
      expect(page.sections.length).toBeGreaterThanOrEqual(4);
      expect(page.reviewedBy).toBeTruthy();
      expect(page.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(page.related.length).toBe(3);
      for (const slug of page.related) expect(getGuidePage(slug)).toBeDefined();
    }
  });

  it("does not present subsidy or calculation outcomes as guaranteed", () => {
    const allText = JSON.stringify(guidePages);
    expect(allText).toContain("예상치");
    expect(allText).toContain("공고 원문");
    expect(allText).toContain("현장");
    expect(allText).not.toContain("수익 보장");
  });
});
