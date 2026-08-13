import { describe, expect, it } from "vitest";
import { parsePrecisionGenerationResult } from "./PrecisionGenerationCalculator";

const payload = {
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-08-13T00:00:00.000Z",
  request: {
    latitude: 37.5665,
    longitude: 126.978,
    peakPowerKw: 3,
    systemLossPercent: 14,
    useHorizon: true,
    radiationDatabase: "PVGIS-SARAH3",
  },
  data: {
    outputs: {
      monthly: { fixed: Array.from({ length: 12 }, (_, index) => ({ month: index + 1, E_m: 300 + index })) },
      totals: { fixed: { E_y: 3666 } },
    },
  },
};

describe("parsePrecisionGenerationResult", () => {
  it("keeps annual and all twelve monthly PVGIS values with source metadata", () => {
    const result = parsePrecisionGenerationResult(payload);
    expect(result.annualProductionKwh).toBe(3666);
    expect(result.monthlyGeneration).toHaveLength(12);
    expect(result.monthlyGeneration[0]).toEqual({ month: 1, generationKwh: 300 });
    expect(result.monthlyGeneration[11]).toEqual({ month: 12, generationKwh: 311 });
    expect(result).toMatchObject({
      source: "PVGIS",
      version: "5.3",
      verifiedAt: "2026-07-30",
      retrievedAt: "2026-08-13T00:00:00.000Z",
    });
  });

  it("rejects PVGIS results when verification metadata is missing", () => {
    expect(() => parsePrecisionGenerationResult({ ...payload, verifiedAt: undefined })).toThrow();
  });
});
