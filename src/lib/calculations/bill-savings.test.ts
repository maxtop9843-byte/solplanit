import { describe, expect, it } from "vitest";

import { estimatedResult, unavailableResult, verifiedResult } from "./result";
import { calculateVerifiedBillSavings, type WonAmount } from "./bill-savings";

const source = {
  label: "한국전력 공식 요금 자료",
  url: "https://home.kepco.co.kr/",
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

describe("calculateVerifiedBillSavings", () => {
  it("calculates monthly and annual savings only from verified before and after bills", () => {
    const result = calculateVerifiedBillSavings({
      beforeMonthlyBill: verifiedWon(120_000),
      afterMonthlyBill: verifiedWon(70_000),
      calculatedAt: "2026-08-10T02:00:00.000Z",
    });

    expect(result).toMatchObject({
      value: {
        monthlySavingsWon: 50_000,
        annualSavingsWon: 600_000,
      },
      metadata: {
        status: "verified",
        referenceDate: "2026-08-10",
        calculatedAt: "2026-08-10T02:00:00.000Z",
      },
    });
  });

  it("preserves a real zero saving instead of treating it as missing information", () => {
    const result = calculateVerifiedBillSavings({
      beforeMonthlyBill: verifiedWon(80_000),
      afterMonthlyBill: verifiedWon(80_000),
    });

    expect(result.value).toEqual({
      monthlySavingsWon: 0,
      annualSavingsWon: 0,
    });
    expect(result.metadata.status).toBe("verified");
  });

  it("does not turn estimated or unavailable bills into a confirmed saving", () => {
    const estimated = calculateVerifiedBillSavings({
      beforeMonthlyBill: verifiedWon(100_000),
      afterMonthlyBill: estimatedResult<WonAmount>(
        { amountWon: 60_000 },
        {
          sources: [source],
          assumptions: [],
          limitations: [],
        },
      ),
    });
    const unavailable = calculateVerifiedBillSavings({
      beforeMonthlyBill: verifiedWon(100_000),
      afterMonthlyBill: unavailableResult<WonAmount>({
        sources: [],
        assumptions: [],
        limitations: ["검증된 요금 모델이 아직 없습니다."],
      }),
    });

    expect(estimated.value).toBeNull();
    expect(estimated.metadata.status).toBe("unavailable");
    expect(unavailable.value).toBeNull();
    expect(unavailable.metadata.status).toBe("unavailable");
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
    "returns an error for an invalid verified bill: %s",
    (amountWon) => {
      const result = calculateVerifiedBillSavings({
        beforeMonthlyBill: verifiedWon(amountWon),
        afterMonthlyBill: verifiedWon(50_000),
      });

      expect(result.value).toBeNull();
      expect(result.metadata.status).toBe("error");
    },
  );

  it("does not report a negative saving when the after bill is higher", () => {
    const result = calculateVerifiedBillSavings({
      beforeMonthlyBill: verifiedWon(50_000),
      afterMonthlyBill: verifiedWon(60_000),
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
  });

  it("does not claim a shared reference date when the bill results use different dates", () => {
    const result = calculateVerifiedBillSavings({
      beforeMonthlyBill: verifiedWon(120_000, "2026-08-01"),
      afterMonthlyBill: verifiedWon(70_000, "2026-08-10"),
    });

    expect(result.metadata.status).toBe("verified");
    expect(result.metadata.referenceDate).toBeUndefined();
  });
});
