import { describe, expect, it } from "vitest";
import { getTrustPage, TRUST_ROUTES, trustPages } from "./trustContent";

const requiredSlugs = [
  "methodology",
  "data-sources",
  "assumptions",
  "limitations",
  "privacy",
  "terms",
  "contact",
  "editorial-policy",
];

describe("trust content", () => {
  it("publishes every required trust and policy page exactly once", () => {
    expect(trustPages.map(({ slug }) => slug)).toEqual(requiredSlugs);
    expect(new Set(trustPages.map(({ slug }) => slug)).size).toBe(trustPages.length);
    expect(TRUST_ROUTES).toHaveLength(trustPages.length + 1);
  });

  it("keeps every page substantive and date-stamped", () => {
    for (const page of trustPages) {
      expect(page.title.length).toBeGreaterThan(1);
      expect(page.summary.length).toBeGreaterThan(20);
      expect(page.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(page.sections.length).toBeGreaterThanOrEqual(3);
      expect(page.sections.every((section) => Boolean(section.paragraphs?.length || section.bullets?.length))).toBe(true);
      expect(getTrustPage(page.slug)).toEqual(page);
    }
  });

  it("makes uncertainty and privacy boundaries explicit", () => {
    const limitations = JSON.stringify(getTrustPage("limitations"));
    const privacy = JSON.stringify(getTrustPage("privacy"));
    const editorial = JSON.stringify(getTrustPage("editorial-policy"));
    expect(limitations).toContain("예상치");
    expect(limitations).toContain("현장");
    expect(privacy).toContain("연락처");
    expect(privacy).toContain("상세 주소");
    expect(editorial).toContain("보장");
  });
});
