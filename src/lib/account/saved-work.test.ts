import { describe, expect, it } from "vitest";
import { parseSavedWork, removeSavedWork, upsertSavedWork, type SavedCalculation } from "./saved-work";

const calculation: SavedCalculation = {
  id: "calculation-save-10-12000",
  kind: "calculation",
  title: "10kW 절감 계산",
  createdAt: "2026-07-30T00:00:00.000Z",
  href: "/pro?source=general",
  capacityKw: 10,
  panelCount: 18,
  annualGenerationKwh: 12000,
  annualBenefit: 1800000,
  paybackYears: 7.2,
  goal: "save",
};

describe("saved work storage", () => {
  it("keeps valid work and discards invalid calculations", () => {
    const parsed = parseSavedWork(JSON.stringify([
      calculation,
      { id: "project-1", kind: "project", title: "공장 지붕", createdAt: calculation.createdAt, href: "/pro" },
      { id: "invalid", kind: "calculation", title: "잘못된 값", createdAt: calculation.createdAt, href: "/pro", capacityKw: -1 },
    ]));
    expect(parsed).toHaveLength(2);
    expect(parsed.map((item) => item.kind)).toEqual(["calculation", "project"]);
  });

  it("upserts by id and keeps the newest item first", () => {
    const updated = { ...calculation, title: "수정된 계산" };
    expect(upsertSavedWork([calculation], updated)).toEqual([updated]);
  });

  it("removes only the selected item", () => {
    const project = { id: "project-1", kind: "project" as const, title: "공장", createdAt: calculation.createdAt, href: "/pro" };
    expect(removeSavedWork([calculation, project], calculation.id)).toEqual([project]);
  });
});
