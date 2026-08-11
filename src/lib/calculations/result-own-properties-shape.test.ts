import { describe, expect, it } from "vitest";

import { estimatedResult } from "./result";

const metadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: [] as const,
};

function expectInvalidValueShape(value: unknown) {
  const result = estimatedResult(value, metadata);

  expect(result.value).toBeNull();
  expect(result.metadata.status).toBe("error");
  expect(result.metadata.limitations).toContain("결과 값의 형식이 올바르지 않습니다.");
}

describe("calculation result JSON own-property boundary", () => {
  it("rejects an extra string property on an array because JSON would drop it", () => {
    const value = [100, 120] as number[] & { unit?: string };
    value.unit = "kWh";

    expect(JSON.stringify(value)).toBe("[100,120]");
    expectInvalidValueShape(value);
  });

  it("rejects a non-enumerable object property because JSON would drop it", () => {
    const value = { annualGenerationKwh: 1_200 } as { annualGenerationKwh: number; source?: string };
    Object.defineProperty(value, "source", {
      value: "PVGIS",
      enumerable: false,
      configurable: true,
    });

    expect(JSON.stringify(value)).toBe('{"annualGenerationKwh":1200}');
    expectInvalidValueShape(value);
  });

  it("keeps dense arrays and plain enumerable data objects valid", () => {
    const value = {
      annualGenerationKwh: 1_200,
      monthlyGenerationKwh: [100, 120],
    };

    const result = estimatedResult(value, metadata);

    expect(result.value).toEqual(value);
    expect(result.metadata.status).toBe("estimated");
  });
});
