import { describe, expect, it } from "vitest";

import { calculateKepcoResidentialLowVoltageBill } from "./kepco-residential-low-voltage";

describe("calculateKepcoResidentialLowVoltageBill", () => {
  it.each([
    [419, 77_760],
    [443, 83_940],
    [484, 104_480],
    [524, 118_970],
  ])("matches KEPCO's published 2026 summer example for %s kWh", (usageKwh, expectedBillWon) => {
    const result = calculateKepcoResidentialLowVoltageBill({ usageKwh, month: 7 });

    expect(result.metadata.status).toBe("verified");
    expect(result.value?.standardBillWon).toBe(expectedBillWon);
  });

  it("uses the relaxed July-August progressive thresholds", () => {
    const atFirstBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 300, month: 8 });
    const afterFirstBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 301, month: 8 });
    const atSecondBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 450, month: 8 });
    const afterSecondBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 451, month: 8 });

    expect(atFirstBoundary.value?.basicChargeWon).toBe(910);
    expect(afterFirstBoundary.value?.basicChargeWon).toBe(1_600);
    expect(atSecondBoundary.value?.basicChargeWon).toBe(1_600);
    expect(afterSecondBoundary.value?.basicChargeWon).toBe(7_300);
    expect(afterFirstBoundary.value?.energyChargeWon).toBe(36_215);
    expect(afterSecondBoundary.value?.energyChargeWon).toBe(68_497);
  });

  it("returns to the regular progressive thresholds in September", () => {
    const atFirstBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 200, month: 9 });
    const afterFirstBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 201, month: 9 });
    const atSecondBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 400, month: 9 });
    const afterSecondBoundary = calculateKepcoResidentialLowVoltageBill({ usageKwh: 401, month: 9 });

    expect(atFirstBoundary.value?.basicChargeWon).toBe(910);
    expect(afterFirstBoundary.value?.basicChargeWon).toBe(1_600);
    expect(atSecondBoundary.value?.basicChargeWon).toBe(1_600);
    expect(afterSecondBoundary.value?.basicChargeWon).toBe(7_300);
  });

  it("keeps a real zero usage distinct from unavailable information", () => {
    const result = calculateKepcoResidentialLowVoltageBill({ usageKwh: 0, month: 7 });

    expect(result.metadata.status).toBe("verified");
    expect(result.value).toMatchObject({
      usageKwh: 0,
      energyChargeWon: 0,
      climateEnvironmentalChargeWon: 0,
      fuelAdjustmentChargeWon: 0,
    });
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1, -0])(
    "rejects invalid monthly usage: %s",
    (usageKwh) => {
      const result = calculateKepcoResidentialLowVoltageBill({ usageKwh, month: 7 });

      expect(result.value).toBeNull();
      expect(result.metadata.status).toBe("error");
    },
  );

  it.each([0, 1.5, 13])("rejects an invalid month: %s", (month) => {
    const result = calculateKepcoResidentialLowVoltageBill({ usageKwh: 300, month });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
  });

  it("does not reuse the Q3 fuel adjustment rate outside its verified period", () => {
    const result = calculateKepcoResidentialLowVoltageBill({ usageKwh: 300, month: 6 });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.limitations).toContain(
      "현재 고정된 연료비조정단가는 2026년 3분기(7~9월)에만 검증되어 다른 월은 계산하지 않습니다.",
    );
  });

  it("preserves source, reference date and calculation timestamp metadata", () => {
    const result = calculateKepcoResidentialLowVoltageBill({
      usageKwh: 350,
      month: 7,
      calculatedAt: "2026-08-12T14:30:00.000Z",
    });

    expect(result.metadata.referenceDate).toBe("2026-08-12");
    expect(result.metadata.calculatedAt).toBe("2026-08-12T14:30:00.000Z");
    expect(result.metadata.sources.length).toBeGreaterThanOrEqual(3);
    expect(result.metadata.assumptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "fuelAdjustmentRate", value: 5, unit: "원/kWh" }),
        expect.objectContaining({ key: "powerIndustryFundRate", value: 2.7, unit: "%" }),
      ]),
    );
  });
});
