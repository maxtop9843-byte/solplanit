import { describe, expect, it } from "vitest";

import { createHousingCostResults, type OfficialWonValue } from "./housing-cost";

const official = (amountWon: number, label: string): OfficialWonValue => ({
  amountWon,
  source: {
    label,
    url: `https://example.com/${label}`,
  },
  referenceDate: "2026-08-01",
});

describe("createHousingCostResults", () => {
  it("keeps an officially confirmed zero subsidy distinct from missing information", () => {
    const result = createHousingCostResults({
      installationCost: official(5_000_000, "공식 설치비"),
      subsidy: official(0, "공식 지원 공고"),
      calculatedAt: "2026-08-10T00:00:00.000Z",
    });

    expect(result.subsidy).toMatchObject({
      value: { amountWon: 0 },
      metadata: { status: "verified" },
    });
    expect(result.outOfPocket).toMatchObject({
      value: { amountWon: 5_000_000 },
      metadata: { status: "verified" },
    });
  });

  it("preserves housing cost user inputs and removes only exact duplicates", () => {
    const sharedRegion = {
      key: "region",
      value: "서울특별시 관악구",
      description: "사용자가 선택한 설치 지역",
    };
    const installationCost = official(5_000_000, "공식 설치비");
    installationCost.inputs = [
      sharedRegion,
      { key: "systemSize", value: 3, unit: "kW", description: "설치 용량" },
    ];
    const subsidy = official(2_000_000, "공식 지원 공고");
    subsidy.inputs = [sharedRegion];

    const result = createHousingCostResults({ installationCost, subsidy });

    expect(result.installationCost.metadata.inputs).toEqual(installationCost.inputs);
    expect(result.subsidy.metadata.inputs).toEqual(subsidy.inputs);
    expect(result.outOfPocket.metadata.inputs).toEqual([
      sharedRegion,
      { key: "systemSize", value: 3, unit: "kW", description: "설치 용량" },
    ]);
  });

  it("keeps a shared official reference date on the combined result", () => {
    const result = createHousingCostResults({
      installationCost: official(5_000_000, "공식 설치비"),
      subsidy: official(2_000_000, "공식 지원 공고"),
    });

    expect(result.outOfPocket.metadata.referenceDate).toBe("2026-08-01");
  });

  it("does not invent a shared reference date when official dates differ", () => {
    const subsidy = official(2_000_000, "공식 지원 공고");
    subsidy.referenceDate = "2026-08-02";

    const result = createHousingCostResults({
      installationCost: official(5_000_000, "공식 설치비"),
      subsidy,
    });

    expect(result.outOfPocket.metadata.referenceDate).toBeUndefined();
  });

  it("preserves a shared reference date when an official amount is invalid", () => {
    const result = createHousingCostResults({
      installationCost: official(Number.NaN, "공식 설치비"),
      subsidy: official(0, "공식 지원 공고"),
    });

    expect(result.outOfPocket.metadata.status).toBe("unavailable");
    expect(result.outOfPocket.metadata.referenceDate).toBe("2026-08-01");
  });

  it("preserves a shared reference date when the combined amount is invalid", () => {
    const result = createHousingCostResults({
      installationCost: official(1_000_000, "공식 설치비"),
      subsidy: official(1_500_000, "공식 지원 공고"),
    });

    expect(result.outOfPocket.metadata.status).toBe("error");
    expect(result.outOfPocket.metadata.referenceDate).toBe("2026-08-01");
  });

  it("does not turn an unverified subsidy into zero won and keeps the missing-data reason", () => {
    const result = createHousingCostResults({
      installationCost: official(5_000_000, "공식 설치비"),
    });

    expect(result.subsidy.value).toBeNull();
    expect(result.subsidy.metadata.status).toBe("unavailable");
    expect(result.outOfPocket.value).toBeNull();
    expect(result.outOfPocket.metadata.status).toBe("unavailable");
    expect(result.outOfPocket.metadata.limitations).toContain(
      "지원액의 공식 확인 자료가 아직 없습니다.",
    );
    expect(result.outOfPocket.metadata.limitations).toContain(
      "설치비와 지원액이 모두 확인되어야 내가 부담할 금액을 계산할 수 있습니다.",
    );
  });

  it("keeps installation cost unavailable when no official cost is supplied", () => {
    const result = createHousingCostResults({
      subsidy: official(2_000_000, "공식 지원 공고"),
    });

    expect(result.installationCost.value).toBeNull();
    expect(result.installationCost.metadata.status).toBe("unavailable");
    expect(result.outOfPocket.metadata.status).toBe("unavailable");
    expect(result.outOfPocket.metadata.limitations).toContain(
      "설치비의 공식 확인 자료가 아직 없습니다.",
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
    "returns an error for an invalid official amount: %s",
    (amountWon) => {
      const result = createHousingCostResults({
        installationCost: official(amountWon, "공식 설치비"),
        subsidy: official(0, "공식 지원 공고"),
      });

      expect(result.installationCost.value).toBeNull();
      expect(result.installationCost.metadata.status).toBe("error");
      expect(result.outOfPocket.metadata.status).toBe("unavailable");
      expect(result.outOfPocket.metadata.limitations).toContain(
        "설치비 금액이 올바르지 않습니다.",
      );
    },
  );

  it("does not expose a negative out-of-pocket amount when subsidy exceeds installation cost", () => {
    const result = createHousingCostResults({
      installationCost: official(1_000_000, "공식 설치비"),
      subsidy: official(1_500_000, "공식 지원 공고"),
    });

    expect(result.outOfPocket.value).toBeNull();
    expect(result.outOfPocket.metadata.status).toBe("error");
  });
});
