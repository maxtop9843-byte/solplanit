import { describe, expect, it } from "vitest";

import {
  errorResult,
  estimatedResult,
  unavailableResult,
  verifiedResult,
  type CalculationResultMetadata,
} from "./result";

const hidden = Symbol("hidden");

const unsafeMetadata = {
  sources: [],
  assumptions: [],
  limitations: ["현장 조건은 별도 확인이 필요합니다."],
  [hidden]: "ignored-by-json",
} as unknown as Omit<CalculationResultMetadata, "status">;

describe("calculation result top-level symbol metadata boundary", () => {
  it.each([
    ["unavailable", unavailableResult],
    ["error", errorResult],
  ] as const)("sanitizes symbol-keyed top-level metadata for %s results", (_label, createResult) => {
    const result = createResult<number>(unsafeMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(() => JSON.stringify(result)).not.toThrow();
  });

  it.each([
    ["verified", verifiedResult],
    ["estimated", estimatedResult],
  ] as const)("rejects symbol-keyed top-level metadata for %s results", (_label, createResult) => {
    const result = createResult({ annualGenerationKwh: 1_350 }, unsafeMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(result.metadata.limitations).toContain(
      "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.",
    );
    expect(() => JSON.stringify(result)).not.toThrow();
  });
});
