import { describe, expect, it } from "vitest";
import {
  calculateSolar3kwCost,
  GYEONGGI_2026_PROJECT_COST_CAP_KRW,
} from "./solar-3kw-cost";

describe("calculateSolar3kwCost", () => {
  it("uses the verified 2026 Gyeonggi project cost cap and provincial support rate", () => {
    const result = calculateSolar3kwCost("gyeonggi");

    expect(result.officialProjectCostKrw).toBe(GYEONGGI_2026_PROJECT_COST_CAP_KRW);
    expect(result.supportStatus).toBe("available");
    expect(result.supportLines).toHaveLength(1);
    expect(result.supportLines[0].ratePercent).toBe(40);
    expect(result.supportLines[0].amountKrw).toBe(1_816_400);
    expect(result.simpleSelfPayKrw).toBe(2_724_600);
  });

  it("does not invent a project cost for Gwanak when only local support is verified", () => {
    const result = calculateSolar3kwCost("seoul-gwanak");

    expect(result.officialProjectCostKrw).toBeNull();
    expect(result.supportLines).toHaveLength(1);
    expect(result.supportLines[0].amountKrw).toBe(1_000_000);
    expect(result.simpleSelfPayKrw).toBeNull();
    expect(result.selfPayReason).toContain("공식 사업비 기준");
  });

  it("does not add overlapping province and district support before stacking is verified", () => {
    const result = calculateSolar3kwCost("gyeonggi-uijeongbu");

    expect(result.supportLines.length).toBeGreaterThan(1);
    expect(result.simpleSelfPayKrw).toBeNull();
    expect(result.selfPayReason).toContain("중복 적용 여부");
  });

  it("keeps unverified regions distinct from zero support", () => {
    const result = calculateSolar3kwCost("other");

    expect(result.supportStatus).toBe("unverified");
    expect(result.supportLines).toEqual([]);
    expect(result.officialProjectCostKrw).toBeNull();
    expect(result.simpleSelfPayKrw).toBeNull();
  });
});
