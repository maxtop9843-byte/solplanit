import { describe, expect, it } from "vitest";

import type { PvgisProxyResult } from "../pvgis";
import { createPvgisMonthlyGenerationResult } from "./pvgis-monthly-generation";

const proxyResult = (monthlyValue: unknown = 342.1): PvgisProxyResult => ({
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-08-12T15:00:00.000Z",
  request: {
    latitude: 37.5665,
    longitude: 126.978,
    peakPowerKw: 3,
    systemLossPercent: 14,
    mountingPosition: "building",
    moduleTechnology: "crystSi",
    useHorizon: true,
    radiationDatabase: "PVGIS-SARAH3",
  },
  data: {
    outputs: {
      totals: { fixed: { E_y: 3_742.6 } },
      monthly: {
        fixed: [
          { month: 7, E_m: 331.4 },
          { month: 8, E_m: monthlyValue },
          { month: 9, E_m: 298.7 },
        ],
      },
    },
  },
});

describe("createPvgisMonthlyGenerationResult", () => {
  it("returns the requested PVGIS monthly generation with provenance", () => {
    const result = createPvgisMonthlyGenerationResult(proxyResult(), 8);

    expect(result.metadata.status).toBe("verified");
    expect(result.value).toEqual({ month: 8, monthlyGenerationKwh: 342.1 });
    expect(result.metadata.sources).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "JRC PVGIS 5.3" })]),
    );
  });

  it("keeps a real zero monthly generation distinct from missing data", () => {
    const result = createPvgisMonthlyGenerationResult(proxyResult(0), 8);

    expect(result.metadata.status).toBe("verified");
    expect(result.value?.monthlyGenerationKwh).toBe(0);
  });

  it("returns unavailable when the requested month is missing", () => {
    const result = createPvgisMonthlyGenerationResult(proxyResult(), 6);

    expect(result.metadata.status).toBe("unavailable");
    expect(result.value).toBeNull();
  });

  it.each(["342.1", Number.NaN, Number.POSITIVE_INFINITY, -1])(
    "rejects an invalid monthly generation value: %s",
    (value) => {
      const result = createPvgisMonthlyGenerationResult(proxyResult(value), 8);

      expect(result.metadata.status).toBe("error");
      expect(result.value).toBeNull();
    },
  );

  it.each([0, 13, 8.5])("rejects an invalid month: %s", (month) => {
    const result = createPvgisMonthlyGenerationResult(proxyResult(), month);

    expect(result.metadata.status).toBe("error");
    expect(result.value).toBeNull();
  });
});
