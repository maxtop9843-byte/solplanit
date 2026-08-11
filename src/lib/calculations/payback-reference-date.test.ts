import { describe, expect, it } from "vitest";

import { errorResult, unavailableResult, verifiedResult } from "./result";
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

describe("calculateVerifiedPayback reference date propagation", () => {
  it("keeps a shared reference date when payback is unavailable", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000),
      annualSavings: unavailableResult<WonAmount>({
        sources: [source],
        referenceDate: "2026-08-10",
        assumptions: [],
        limitations: ["검증된 연간 절감액이 아직 없습니다."],
      }),
    });

    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.referenceDate).toBe("2026-08-10");
  });

  it("keeps upstream out-of-pocket errors as errors", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: errorResult<WonAmount>({
        sources: [source],
        referenceDate: "2026-08-10",
        assumptions: [],
        limitations: ["실부담액 계산에 오류가 있습니다."],
      }),
      annualSavings: verifiedWon(1_000_000),
    });

    expect(result.metadata.status).toBe("error");
    expect(result.metadata.referenceDate).toBe("2026-08-10");
    expect(result.metadata.limitations).toContain("실부담액 계산에 오류가 있습니다.");
  });

  it("keeps upstream annual-savings errors as errors", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000),
      annualSavings: errorResult<WonAmount>({
        sources: [source],
        referenceDate: "2026-08-10",
        assumptions: [],
        limitations: ["연간 절감액 계산에 오류가 있습니다."],
      }),
    });

    expect(result.metadata.status).toBe("error");
    expect(result.metadata.referenceDate).toBe("2026-08-10");
    expect(result.metadata.limitations).toContain("연간 절감액 계산에 오류가 있습니다.");
  });

  it("keeps a shared reference date when verified monetary input is invalid", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(Number.NaN),
      annualSavings: verifiedWon(1_000_000),
    });

    expect(result.metadata.status).toBe("error");
    expect(result.metadata.referenceDate).toBe("2026-08-10");
  });

  it("keeps a shared reference date when annual savings are zero", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000),
      annualSavings: verifiedWon(0),
    });

    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.referenceDate).toBe("2026-08-10");
  });

  it("does not calculate payback when verified inputs use different reference dates", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000, "2026-08-01"),
      annualSavings: verifiedWon(1_000_000, "2026-08-10"),
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.referenceDate).toBeUndefined();
    expect(result.metadata.limitations).toContain(
      "실부담액과 연간 절감액의 기준일이 같아야 회수기간을 계산할 수 있습니다.",
    );
  });

  it("does not calculate payback when a verified input is missing its reference date", () => {
    const outOfPocket = verifiedResult<WonAmount>(
      { amountWon: 5_000_000 },
      {
        sources: [source],
        assumptions: [],
        limitations: [],
      },
    );

    const result = calculateVerifiedPayback({
      outOfPocket,
      annualSavings: verifiedWon(1_000_000),
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.referenceDate).toBeUndefined();
  });

  it("does not claim a shared reference date when upstream dates differ", () => {
    const result = calculateVerifiedPayback({
      outOfPocket: verifiedWon(5_000_000, "2026-08-01"),
      annualSavings: unavailableResult<WonAmount>({
        sources: [source],
        referenceDate: "2026-08-10",
        assumptions: [],
        limitations: ["검증된 연간 절감액이 아직 없습니다."],
      }),
    });

    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.referenceDate).toBeUndefined();
  });
});
