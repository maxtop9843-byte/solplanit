import { describe, expect, it } from "vitest";

import {
  errorResult,
  estimatedResult,
  unavailableResult,
  verifiedResult,
  type CalculationResultMetadata,
} from "./result";

const hidden = Symbol("hidden");

const unsafeSource = {
  label: "공식 자료",
  url: "https://example.com/source",
  [hidden]: "ignored-by-json",
};

const unsafeInput = {
  key: "capacity",
  value: 3,
  unit: "kW",
  [hidden]: "ignored-by-json",
};

const unsafeMetadata = {
  sources: [unsafeSource],
  inputs: [unsafeInput],
  assumptions: [] as const,
  limitations: ["현장 조건은 별도 확인이 필요합니다."],
} as unknown as Omit<CalculationResultMetadata, "status">;

describe("calculation result symbol-key metadata boundary", () => {
  it.each([
    ["unavailable", unavailableResult],
    ["error", errorResult],
  ] as const)("removes symbol-keyed metadata entries for %s results", (_label, createResult) => {
    const result = createResult<number>(unsafeMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.inputs).toEqual([]);
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(() => JSON.stringify(result)).not.toThrow();
  });

  it.each([
    ["verified", verifiedResult],
    ["estimated", estimatedResult],
  ] as const)("rejects symbol-keyed metadata entries for %s results", (_label, createResult) => {
    const result = createResult({ annualGenerationKwh: 1_350 }, unsafeMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.inputs).toEqual([]);
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(result.metadata.limitations).toContain(
      "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.",
    );
  });
});
