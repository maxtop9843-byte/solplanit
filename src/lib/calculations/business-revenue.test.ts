import { describe, expect, it } from "vitest";

import {
  calculateBusinessRevenue,
  createBusinessRevenueResult,
} from "./business-revenue";

const input = {
  annualGenerationKwh: 13_140,
  smpPricePerKwh: 100,
  recPricePerRec: 70_000,
  recWeight: 1.2,
};

describe("calculateBusinessRevenue", () => {
  it("keeps SMP and REC revenue inside the business calculation boundary", () => {
    const result = calculateBusinessRevenue(input);

    expect(result).toEqual({
      annualSmpRevenue: 1_314_000,
      annualRecRevenue: 1_103_760,
      annualRevenue: 2_417_760,
    });
  });

  it("preserves zero-priced market inputs as a real zero result", () => {
    expect(calculateBusinessRevenue({
      annualGenerationKwh: 13_140,
      smpPricePerKwh: 0,
      recPricePerRec: 0,
      recWeight: 1,
    })).toEqual({
      annualSmpRevenue: 0,
      annualRecRevenue: 0,
      annualRevenue: 0,
    });
  });

  it.each([
    ["negative generation", { annualGenerationKwh: -1, smpPricePerKwh: 100, recPricePerRec: 70_000, recWeight: 1.2 }],
    ["NaN SMP", { annualGenerationKwh: 13_140, smpPricePerKwh: Number.NaN, recPricePerRec: 70_000, recWeight: 1.2 }],
    ["infinite REC price", { annualGenerationKwh: 13_140, smpPricePerKwh: 100, recPricePerRec: Number.POSITIVE_INFINITY, recWeight: 1.2 }],
    ["negative REC weight", { annualGenerationKwh: 13_140, smpPricePerKwh: 100, recPricePerRec: 70_000, recWeight: -0.1 }],
  ])("rejects invalid raw business inputs before producing numeric revenue: %s", (_label, invalidInput) => {
    expect(() => calculateBusinessRevenue(invalidInput)).toThrow(RangeError);
  });
});

describe("createBusinessRevenueResult", () => {
  it("keeps business inputs, source and reference date in the common result contract", () => {
    const result = createBusinessRevenueResult(
      input,
      {
        sources: [
          {
            label: "전력거래소·한국에너지공단 확인 자료",
            url: "https://example.com/business-market-data",
          },
        ],
        referenceDate: "2026-08-10",
        calculatedAt: "2026-08-10T09:00:00.000Z",
      },
    );

    expect(result.value).toEqual({
      annualSmpRevenue: 1_314_000,
      annualRecRevenue: 1_103_760,
      annualRevenue: 2_417_760,
    });
    expect(result.metadata.status).toBe("estimated");
    expect(result.metadata.referenceDate).toBe("2026-08-10");
    expect(result.metadata.sources).toHaveLength(1);
    expect(result.metadata.inputs).toEqual([
      {
        key: "annualGenerationKwh",
        value: 13_140,
        unit: "kWh/년",
        description: "연간 발전량",
      },
      {
        key: "smpPricePerKwh",
        value: 100,
        unit: "원/kWh",
        description: "SMP 단가",
      },
      {
        key: "recPricePerRec",
        value: 70_000,
        unit: "원/REC",
        description: "REC 단가",
      },
      {
        key: "recWeight",
        value: 1.2,
        description: "REC 가중치",
      },
    ]);
  });

  it("preserves a real zero result instead of treating it as unavailable", () => {
    const result = createBusinessRevenueResult({
      annualGenerationKwh: 13_140,
      smpPricePerKwh: 0,
      recPricePerRec: 0,
      recWeight: 1,
    });

    expect(result.metadata.status).toBe("estimated");
    expect(result.value).toEqual({
      annualSmpRevenue: 0,
      annualRecRevenue: 0,
      annualRevenue: 0,
    });
  });

  it("returns error instead of a numeric result for invalid market inputs", () => {
    const result = createBusinessRevenueResult({
      annualGenerationKwh: 13_140,
      smpPricePerKwh: Number.NaN,
      recPricePerRec: 70_000,
      recWeight: 1.2,
    });

    expect(result.metadata.status).toBe("error");
    expect(result.value).toBeNull();
    expect(result.metadata.inputs).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "smpPricePerKwh", value: Number.NaN }),
    ]));
  });

  it.each([
    ["empty source label", { sources: [{ label: "", url: "https://example.com/market" }] }],
    ["relative source URL", { sources: [{ label: "시장 자료", url: "/market" }] }],
    ["invalid reference date", { referenceDate: "2026-02-30" }],
    ["timestamp reference date", { referenceDate: "2026-08-10T00:00:00.000Z" }],
    ["invalid calculatedAt", { calculatedAt: "2026-08-10" }],
  ])("does not expose estimated revenue with invalid provenance metadata: %s", (_label, metadata) => {
    const result = createBusinessRevenueResult(input, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain(
      "발전사업자 수익 결과의 출처·기준일 또는 계산 시각이 올바르지 않습니다.",
    );
  });

  it("accepts canonical provenance metadata", () => {
    const result = createBusinessRevenueResult(input, {
      sources: [{ label: "시장 자료", url: "http://example.com/market" }],
      referenceDate: "2026-08-10",
      calculatedAt: "2026-08-10T09:00:00.000Z",
    });

    expect(result.metadata.status).toBe("estimated");
    expect(result.value).not.toBeNull();
  });
});
