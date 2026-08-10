import { describe, expect, it } from "vitest";

import { estimatedResult, unavailableResult, verifiedResult } from "./result";
import { calculateVerifiedPayback, type WonAmount } from "./payback";

const source = {
  label: "공식 자료",
  url: "https://example.com/source",
};

const verifiedWon = (amountWon: number, referenceDate = "2026-08-10") =>
  verifiedResult<WonAmount>(
    { amountWon },
    {
      sources: [source],
      referenceDate,
      assumptions: [],
      limitations: [],
    },
  );

describe("calculateVerifiedPayback", () => {
  it("calculates a simple payback period only from verified cost and savings", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000),
      annualSavings: verifiedWon(1_200_000),
      calculatedAt: "2026-08-10T01:00:00.000Z",
    });

    expect(result).toMatchObject({
      value: { years: 4.2 },
      metadata: {
        status: "verified",
        referenceDate: "2026-08-10",
        calculatedAt: "2026-08-10T01:00:00.000Z",
      },
    });
    expect(result.metadata.limitations).toContain(
      "금융비용, 유지관리비, 성능 저하는 반영하지 않은 단순 회수기간입니다.",
    );
  });

  it("does not turn an estimated annual saving into a confirmed payback period", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000),
      annualSavings: estimatedResult<WonAmount>(
        { amountWon: 1_000_000 },
        {
          sources: [source],
          assumptions: [],
          limitations: [],
        },
      ),
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
  });

  it("keeps missing savings distinct from zero savings", () => {
    const missing = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000),
      annualSavings: unavailableResult<WonAmount>({
        sources: [],
        assumptions: [],
        limitations: ["전기요금 모델이 아직 검증되지 않았습니다."],
      }),
    });
    const zero = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000),
      annualSavings: verifiedWon(0),
    });

    expect(missing.value).toBeNull();
    expect(missing.metadata.status).toBe("unavailable");
    expect(zero.value).toBeNull();
    expect(zero.metadata.status).toBe("unavailable");
    expect(zero.metadata.limitations).toContain(
      "연간 절감액이 0원이어서 유한한 회수기간을 계산할 수 없습니다.",
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
    "returns an error when a verified monetary input is invalid: %s",
    (amountWon) => {
      const result = calculateVerifiedPayback({
        outOfPocket: verifiedWon(amountWon),
        annualSavings: verifiedWon(1_000_000),
      });

      expect(result.value).toBeNull();
      expect(result.metadata.status).toBe("error");
    },
  );

  it("does not claim a shared reference date when the inputs use different dates", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000, "2026-08-01"),
      annualSavings: verifiedWon(1_000_000, "2026-08-10"),
    });

    expect(result.metadata.status).toBe("verified");
    expect(result.metadata.referenceDate).toBeUndefined();
  });
});
