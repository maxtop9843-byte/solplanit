import { describe, expect, it } from "vitest";
import { getSearchIntentPage, searchIntentPages } from "./searchIntentPages";

const expectedSlugs = [
  "solar-installation-capacity",
  "solar-generation",
  "solar-savings",
  "solar-smp-rec-revenue",
  "rooftop-solar",
  "factory-solar",
  "land-solar",
];

describe("search intent pages", () => {
  it("defines every approved intent exactly once", () => {
    expect(searchIntentPages.map(({ slug }) => slug)).toEqual(expectedSlugs);
    expect(new Set(expectedSlugs).size).toBe(searchIntentPages.length);
  });

  it("keeps every page useful and connected to the journey", () => {
    for (const page of searchIntentPages) {
      expect(page.title.length).toBeGreaterThan(15);
      expect(page.description.length).toBeGreaterThan(30);
      expect(page.highlights).toHaveLength(3);
      expect(page.steps).toHaveLength(4);
      expect(page.related).toHaveLength(3);
      expect(page.related).not.toContain(page.slug);
      for (const related of page.related) expect(getSearchIntentPage(related)).toBeDefined();
    }
  });

  it("returns undefined for an unknown route", () => {
    expect(getSearchIntentPage("unknown")).toBeUndefined();
  });
});
