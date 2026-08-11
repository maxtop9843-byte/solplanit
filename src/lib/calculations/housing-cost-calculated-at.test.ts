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

describe("createHousingCostResults calculatedAt metadata", () => {
  it.each([
    "2026-08-10",
    "2026-08-10T00:00:00Z",
    "not-a-date",
  ])("returns an error when calculatedAt is not a canonical ISO timestamp: %s", (calculatedAt) => {
    const result = createHousingCostResults({
      installationCost: official(5_000_000, "공식 설치비"),
      subsidy: official(0, "공식 지원 공고"),
      calculatedAt,
    });

    expect(result.installationCost.value).toBeNull();
    expect(result.installationCost.metadata.status).toBe("error");
    expect(result.subsidy.metadata.status).toBe("error");
    expect(result.outOfPocket.value).toBeNull();
    expect(result.outOfPocket.metadata.status).toBe("error");
    expect(result.outOfPocket.metadata.limitations).toContain(
      "설치비의 계산 시각이 올바르지 않습니다.",
    );
  });

  it("keeps verified housing cost results for a canonical ISO timestamp", () => {
    const calculatedAt = "2026-08-10T00:00:00.000Z";
    const result = createHousingCostResults({
      installationCost: official(5_000_000, "공식 설치비"),
      subsidy: official(0, "공식 지원 공고"),
      calculatedAt,
    });

    expect(result.installationCost.metadata.status).toBe("verified");
    expect(result.subsidy.metadata.status).toBe("verified");
    expect(result.outOfPocket.metadata.status).toBe("verified");
    expect(result.outOfPocket.metadata.calculatedAt).toBe(calculatedAt);
  });
});
