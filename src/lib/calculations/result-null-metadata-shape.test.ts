import { describe, expect, it } from "vitest";

import { errorResult, unavailableResult, type CalculationResultMetadata } from "./result";

type NullResultFactory = <T>(
  metadata: Omit<CalculationResultMetadata, "status">,
) => ReturnType<typeof unavailableResult<T>>;

const factories: Array<[string, NullResultFactory]> = [
  ["unavailable", unavailableResult],
  ["error", errorResult],
];

describe("null calculation result metadata shape", () => {
  it.each(factories)("preserves diagnostic numeric values for %s results", (_label, createResult) => {
    const result = createResult<number>({
      sources: [{ label: "원본 응답", url: "/relative-debug-url" }],
      referenceDate: "2026-02-30",
      calculatedAt: "2026-08-10",
      inputs: [{ key: "capacity", value: Number.NaN, unit: "kW" }],
      assumptions: [{ key: "ratio", value: Number.POSITIVE_INFINITY }],
      limitations: [" "],
    });

    expect(result.metadata.inputs).toEqual([{ key: "capacity", value: Number.NaN, unit: "kW" }]);
    expect(result.metadata.assumptions).toEqual([{ key: "ratio", value: Number.POSITIVE_INFINITY }]);
    expect(result.metadata.sources).toEqual([{ label: "원본 응답", url: "/relative-debug-url" }]);
    expect(result.metadata.referenceDate).toBe("2026-02-30");
    expect(result.metadata.calculatedAt).toBe("2026-08-10");
    expect(result.metadata.limitations).toEqual([" "]);
  });

  it.each(factories)("removes runtime metadata shapes that cannot cross the result boundary: %s", (_label, createResult) => {
    const unsafeMetadata = {
      sources: [
        { label: "정상 자료", url: "https://example.com/source" },
        { label: BigInt(1), url: "https://example.com/unsafe" },
      ],
      referenceDate: "2026-08-10",
      calculatedAt: "2026-08-10T00:00:00.000Z",
      inputs: [
        { key: "region", value: "서울" },
        { key: "unsafe", value: BigInt(3) },
      ],
      assumptions: [
        { key: "ratio", value: 0.8 },
        { key: "unsafe", value: { nested: true } },
      ],
      limitations: ["현장 조건은 별도 확인이 필요합니다.", { unsafe: true }],
    } as unknown as Omit<CalculationResultMetadata, "status">;

    const result = createResult<number>(unsafeMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe(_label);
    expect(result.metadata.sources).toEqual([{ label: "정상 자료", url: "https://example.com/source" }]);
    expect(result.metadata.inputs).toEqual([{ key: "region", value: "서울" }]);
    expect(result.metadata.assumptions).toEqual([{ key: "ratio", value: 0.8 }]);
    expect(result.metadata.limitations).toEqual([
      "현장 조건은 별도 확인이 필요합니다.",
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    ]);
    expect(() => JSON.stringify(result)).not.toThrow();
  });
});
