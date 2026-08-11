import { describe, expect, it } from "vitest";

import { estimatedResult } from "./result";

const metadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: ["현장 조건에 따라 달라질 수 있습니다."] as const,
};

describe("calculation result symbol-key boundary", () => {
  it("does not expose a symbol-keyed value that JSON would silently omit", () => {
    const hiddenMetric = Symbol("hiddenMetric");
    const value = {
      annualGenerationKwh: 1_350,
      [hiddenMetric]: 42,
    };

    const result = estimatedResult(value, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과 값의 형식이 올바르지 않습니다.");
  });
});
