import { describe, expect, it } from "vitest";

import {
  estimatedResult,
  verifiedResult,
  type CalculationResultMetadata,
} from "./result";

const factories = [
  ["verified", verifiedResult],
  ["estimated", estimatedResult],
] as const;

describe("value calculation result runtime metadata shape", () => {
  it.each(factories)("returns a serializable error instead of throwing for malformed %s metadata", (_label, createResult) => {
    const unsafeMetadata = {
      sources: [
        { label: "공식 자료", url: "https://example.com/source" },
        { label: BigInt(1), url: "https://example.com/unsafe" },
      ],
      referenceDate: BigInt(20260810),
      calculatedAt: { unsafe: true },
      inputs: [
        { key: "region", value: "서울" },
        { key: "unsafe", value: BigInt(3) },
      ],
      assumptions: [
        { key: "capacity", value: 3, unit: "kW" },
        { key: "unsafe", value: { nested: true } },
      ],
      limitations: ["현장 조건은 별도 확인이 필요합니다.", { unsafe: true }],
    } as unknown as Omit<CalculationResultMetadata, "status">;

    const result = createResult(3, unsafeMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual([{ label: "공식 자료", url: "https://example.com/source" }]);
    expect(result.metadata.inputs).toEqual([{ key: "region", value: "서울" }]);
    expect(result.metadata.assumptions).toEqual([{ key: "capacity", value: 3, unit: "kW" }]);
    expect(result.metadata.referenceDate).toBeUndefined();
    expect(result.metadata.calculatedAt).toBeUndefined();
    expect(result.metadata.limitations).toEqual([
      "현장 조건은 별도 확인이 필요합니다.",
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
      "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.",
    ]);
    expect(() => JSON.stringify(result)).not.toThrow();
  });

  it.each(factories)("guards malformed top-level metadata collections for %s results", (_label, createResult) => {
    const unsafeMetadata = {
      sources: null,
      assumptions: BigInt(1),
      limitations: "not-an-array",
      inputs: { key: "region", value: "서울" },
    } as unknown as Omit<CalculationResultMetadata, "status">;

    const result = createResult(3, unsafeMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.inputs).toEqual([]);
    expect(result.metadata.assumptions).toEqual([]);
    expect(result.metadata.limitations).toEqual([
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
      "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.",
    ]);
    expect(() => JSON.stringify(result)).not.toThrow();
  });
});
