import { describe, expect, it } from "vitest";

import {
  errorResult,
  estimatedResult,
  unavailableResult,
  verifiedResult,
  type CalculationResultMetadata,
} from "./result";

const baseMetadata = {
  sources: [],
  assumptions: [],
  limitations: [],
} satisfies Omit<CalculationResultMetadata, "status">;

function createThrowingValue() {
  const value: Record<string, unknown> = {};
  Object.defineProperty(value, "annualGenerationKwh", {
    enumerable: true,
    get() {
      throw new Error("value getter should not escape result validation");
    },
  });
  return value;
}

function createThrowingMetadata() {
  const metadata: Record<string, unknown> = {
    assumptions: [],
    limitations: [],
  };
  Object.defineProperty(metadata, "sources", {
    enumerable: true,
    get() {
      throw new Error("metadata getter should not escape sanitization");
    },
  });
  return metadata as unknown as Omit<CalculationResultMetadata, "status">;
}

describe("calculation result accessor boundary", () => {
  it.each([
    ["verified", verifiedResult],
    ["estimated", estimatedResult],
  ] as const)("converts throwing value accessors to an error result for %s", (_label, createResult) => {
    expect(() => createResult(createThrowingValue(), baseMetadata)).not.toThrow();

    const result = createResult(createThrowingValue(), baseMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과 값의 형식이 올바르지 않습니다.");
  });

  it.each([
    ["verified", verifiedResult],
    ["estimated", estimatedResult],
  ] as const)("converts throwing metadata accessors to an error result for %s", (_label, createResult) => {
    expect(() => createResult({ annualGenerationKwh: 1_350 }, createThrowingMetadata())).not.toThrow();

    const result = createResult({ annualGenerationKwh: 1_350 }, createThrowingMetadata());

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
  });

  it.each([
    ["unavailable", unavailableResult],
    ["error", errorResult],
  ] as const)("sanitizes throwing metadata accessors for %s", (_label, createResult) => {
    expect(() => createResult<number>(createThrowingMetadata())).not.toThrow();

    const result = createResult<number>(createThrowingMetadata());

    expect(result.value).toBeNull();
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(() => JSON.stringify(result)).not.toThrow();
  });
});
