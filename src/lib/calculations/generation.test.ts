import { describe, expect, it } from "vitest";

import type { PvgisProxyResult } from "../pvgis";
import { createPvgisGenerationResult } from "./generation";

const proxyResult = (annualGenerationKwh: unknown): PvgisProxyResult => ({
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-08-10T00:00:00.000Z",
  request: {
    latitude: 37.5665,
    longitude: 126.978,
    peakPowerKw: 3,
    systemLossPercent: 14,
    tiltDegrees: 30,
    azimuthDegrees: 0,
  },
  data: {
    outputs: {
      totals: {
        fixed: {
          E_y: annualGenerationKwh,
        },
      },
    },
  },
});

describe("createPvgisGenerationResult", () => {
  it("uses the PVGIS annual output as a verified location-based generation result", () => {
    const result = createPvgisGenerationResult(proxyResult(3_742.6));

    expect(result).toMatchObject({
      value: { annualGenerationKwh: 3_742.6 },
      metadata: {
        status: "verified",
        referenceDate: "2026-07-30",
        calculatedAt: "2026-08-10T00:00:00.000Z",
        sources: [
          expect.objectContaining({
            label: "JRC PVGIS 5.3",
          }),
        ],
      },
    });
    expect(result.metadata.assumptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "peakPowerKw", value: 3, unit: "kW" }),
        expect.objectContaining({ key: "systemLossPercent", value: 14, unit: "%" }),
        expect.objectContaining({ key: "tiltDegrees", value: 30, unit: "°" }),
        expect.objectContaining({ key: "azimuthDegrees", value: 0, unit: "°" }),
      ]),
    );
  });

  it("preserves a real zero PVGIS output instead of treating it as missing data", () => {
    const result = createPvgisGenerationResult(proxyResult(0));

    expect(result.value).toEqual({ annualGenerationKwh: 0 });
    expect(result.metadata.status).toBe("verified");
  });

  it.each([undefined, null, "3742.6", Number.NaN, -1])(
    "returns an error result for an invalid PVGIS annual output: %s",
    (annualGenerationKwh) => {
      const result = createPvgisGenerationResult(proxyResult(annualGenerationKwh));

      expect(result.value).toBeNull();
      expect(result.metadata.status).toBe("error");
      expect(result.metadata.limitations).toContain(
        "PVGIS 응답에서 연간 발전량을 확인하지 못했습니다.",
      );
    },
  );
});
