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
    expect(result.metadata.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "latitude", value: 37.5665, unit: "°" }),
        expect.objectContaining({ key: "longitude", value: 126.978, unit: "°" }),
        expect.objectContaining({ key: "peakPowerKw", value: 3, unit: "kW" }),
      ]),
    );
    expect(result.metadata.assumptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "systemLossPercent", value: 14, unit: "%" }),
        expect.objectContaining({ key: "tiltDegrees", value: 30, unit: "°" }),
        expect.objectContaining({ key: "azimuthDegrees", value: 0, unit: "°" }),
      ]),
    );
    expect(result.metadata.assumptions).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ key: "peakPowerKw" })]),
    );
  });

  it("preserves a real zero PVGIS output instead of treating it as missing data", () => {
    const result = createPvgisGenerationResult(proxyResult(0));

    expect(result.value).toEqual({ annualGenerationKwh: 0 });
    expect(result.metadata.status).toBe("verified");
  });

  it.each([undefined, null])(
    "returns unavailable when the PVGIS annual output is missing: %s",
    (annualGenerationKwh) => {
      const result = createPvgisGenerationResult(proxyResult(annualGenerationKwh));

      expect(result.value).toBeNull();
      expect(result.metadata.status).toBe("unavailable");
      expect(result.metadata.referenceDate).toBe("2026-07-30");
      expect(result.metadata.calculatedAt).toBe("2026-08-10T00:00:00.000Z");
      expect(result.metadata.limitations).toContain(
        "PVGIS 응답에 연간 발전량 데이터가 없습니다.",
      );
    },
  );

  it.each(["3742.6", Number.NaN, Number.POSITIVE_INFINITY, -1])(
    "returns an error result for an invalid PVGIS annual output: %s",
    (annualGenerationKwh) => {
      const result = createPvgisGenerationResult(proxyResult(annualGenerationKwh));

      expect(result.value).toBeNull();
      expect(result.metadata.status).toBe("error");
      expect(result.metadata.referenceDate).toBe("2026-07-30");
      expect(result.metadata.calculatedAt).toBe("2026-08-10T00:00:00.000Z");
      expect(result.metadata.limitations).toContain(
        "PVGIS 응답의 연간 발전량 값이 올바르지 않습니다.",
      );
    },
  );
});
