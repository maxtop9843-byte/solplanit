import { describe, expect, it } from "vitest";

import { calculateResidentialBillSavingsRange } from "./residential-bill-savings-range";

describe("calculateResidentialBillSavingsRange", () => {
  it("returns an estimated range instead of inventing a self-consumption ratio", () => {
    const result = calculateResidentialBillSavingsRange({
      monthlyUsageKwh: 400,
      monthlySolarGenerationKwh: 300,
      month: 8,
      calculatedAt: "2026-08-12T15:00:00.000Z",
    });

    expect(result.metadata.status).toBe("estimated");
    expect(result.metadata.referenceDate).toBe("2026-08-12");
    expect(result.value).not.toBeNull();
    expect(result.value?.monthlySavingsRangeWon.min).toBe(0);
    expect(result.value?.monthlySavingsRangeWon.max).toBeGreaterThan(0);
    expect(result.value?.selfConsumedSolarRangeKwh).toEqual({ min: 0, max: 300 });
    expect(result.metadata.assumptions.some((item) => item.key === "maximumSelfConsumedSolar")).toBe(true);
  });

  it("caps possible self-consumption at the household monthly usage", () => {
    const result = calculateResidentialBillSavingsRange({
      monthlyUsageKwh: 200,
      monthlySolarGenerationKwh: 500,
      month: 8,
    });

    expect(result.metadata.status).toBe("estimated");
    expect(result.value?.selfConsumedSolarRangeKwh).toEqual({ min: 0, max: 200 });
    expect(result.value?.afterBillRangeWon.min).toBeGreaterThanOrEqual(0);
  });

  it("keeps a real zero-generation case distinct from missing information", () => {
    const result = calculateResidentialBillSavingsRange({
      monthlyUsageKwh: 250,
      monthlySolarGenerationKwh: 0,
      month: 9,
    });

    expect(result.metadata.status).toBe("estimated");
    expect(result.value?.monthlySavingsRangeWon).toEqual({ min: 0, max: 0 });
    expect(result.value?.afterBillRangeWon.min).toBe(result.value?.beforeBillWon);
  });

  it.each([
    { monthlyUsageKwh: -1, monthlySolarGenerationKwh: 100 },
    { monthlyUsageKwh: Number.NaN, monthlySolarGenerationKwh: 100 },
    { monthlyUsageKwh: 100, monthlySolarGenerationKwh: -1 },
    { monthlyUsageKwh: 100, monthlySolarGenerationKwh: Number.POSITIVE_INFINITY },
  ])("rejects invalid usage or generation values: %o", (values) => {
    const result = calculateResidentialBillSavingsRange({
      ...values,
      month: 8,
    });

    expect(result.metadata.status).toBe("error");
    expect(result.value).toBeNull();
  });

  it("does not reuse the Q3 fuel adjustment model outside its verified period", () => {
    const result = calculateResidentialBillSavingsRange({
      monthlyUsageKwh: 300,
      monthlySolarGenerationKwh: 200,
      month: 10,
    });

    expect(result.metadata.status).toBe("unavailable");
    expect(result.value).toBeNull();
    expect(result.metadata.limitations.join(" ")).toContain("2026년 3분기");
  });

  it("keeps bill ordering and rounding internally consistent", () => {
    const result = calculateResidentialBillSavingsRange({
      monthlyUsageKwh: 451,
      monthlySolarGenerationKwh: 123.4,
      month: 8,
    });

    expect(result.metadata.status).toBe("estimated");
    const value = result.value;
    expect(value).not.toBeNull();
    if (!value) return;

    expect(Number.isInteger(value.beforeBillWon)).toBe(true);
    expect(Number.isInteger(value.afterBillRangeWon.min)).toBe(true);
    expect(Number.isInteger(value.monthlySavingsRangeWon.max)).toBe(true);
    expect(value.afterBillRangeWon.min).toBeLessThanOrEqual(value.afterBillRangeWon.max);
    expect(value.monthlySavingsRangeWon.max).toBe(
      value.beforeBillWon - value.afterBillRangeWon.min,
    );
  });
});
