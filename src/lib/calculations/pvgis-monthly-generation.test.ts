import { describe, expect, it } from "vitest";
import { createPvgisMonthlyGenerationResult } from "./pvgis-monthly-generation";
import type { PvgisProxyResult } from "../pvgis";

function fixture(overrides: Partial<PvgisProxyResult> = {}): PvgisProxyResult {
  return {
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
        monthly: {
          fixed: [
            { month: 7, E_m: 321.4 },
            { month: 8, E_m: 305.2 },
            { month: 9, E_m: 272.8 },
          ],
        },
      },
    },
    ...overrides,
  };
}

describe("createPvgisMonthlyGenerationResult", () => {
  it("returns the requested PVGIS monthly generation with provenance", () => {
    const result = createPvgisMonthlyGenerationResult(fixture(), 8);
    expect(result.metadata.status).toBe("verified");
    expect(result.value).toEqual({ month: 8, generationKwh: 305.2 });
    expect(result.metadata.referenceDate).toBe("2026-07-30");
    expect(result.metadata.sources[0]?.label).toBe("JRC PVGIS 5.3");
  });

  it("keeps a real zero-generation month distinct from missing data", () => {
    const result = createPvgisMonthlyGenerationResult(fixture({
      data: { outputs: { monthly: { fixed: [{ month: 8, E_m: 0 }] } } },
    }), 8);
    expect(result.metadata.status).toBe("verified");
    expect(result.value?.generationKwh).toBe(0);
  });

  it("returns unavailable when the selected month is missing", () => {
    const result = createPvgisMonthlyGenerationResult(fixture(), 6);
    expect(result.metadata.status).toBe("unavailable");
    expect(result.value).toBeNull();
  });

  it("rejects invalid negative generation and stale provenance", () => {
    const invalid = createPvgisMonthlyGenerationResult(fixture({
      data: { outputs: { monthly: { fixed: [{ month: 8, E_m: -1 }] } } },
    }), 8);
    expect(invalid.metadata.status).toBe("error");
    expect(invalid.value).toBeNull();

    const stale = createPvgisMonthlyGenerationResult(fixture({ verifiedAt: "2026-07-29" as "2026-07-30" }), 8);
    expect(stale.metadata.status).toBe("error");
  });
});
