import { describe, expect, it } from "vitest";
import { buildResultCsv, buildResultJson } from "./ResultDownloads";

const result = {
  annualProductionKwh: 11460,
  annualIrradiationKwhM2: 1320.5,
  annualVariationKwh: 420,
  totalLossPercent: -18.4,
  monthly: Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    productionKwh: 900 + index * 10,
    irradiationKwhM2: 100 + index,
    variationKwh: 40 + index,
  })),
  horizon: [{ azimuth: 0, height: 5 }],
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-07-30T00:00:00.000Z",
};

const project = {
  latitude: 37.5665,
  longitude: 126.978,
  peakPowerKw: 10,
  systemLossPercent: 14,
  tilt: "30°",
  azimuth: "0°",
  radiationDatabase: "PVGIS-SARAH3",
};

describe("professional result downloads", () => {
  it("builds a UTF-8 CSV with source, assumptions, monthly rows, and disclaimer", () => {
    const csv = buildResultCsv(result, project);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("PVGIS 5.3");
    expect(csv).toContain("설치 용량(kWp),10");
    expect(csv).toContain("1월,900,100,40");
    expect(csv).toContain("실제 발전량이나 수익을 보장하지 않습니다");
  });

  it("builds versioned JSON without dropping result provenance", () => {
    const payload = JSON.parse(buildResultJson(result, project));
    expect(payload.schemaVersion).toBe("1.0");
    expect(payload.project.radiationDatabase).toBe("PVGIS-SARAH3");
    expect(payload.result.monthly).toHaveLength(12);
    expect(payload.result.verifiedAt).toBe("2026-07-30");
    expect(payload.disclaimer).toMatch(/보장하지 않습니다/);
  });
});
