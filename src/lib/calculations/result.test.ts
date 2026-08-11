import { describe, expect, it } from "vitest";

import { errorResult, estimatedResult, unavailableResult, verifiedResult } from "./result";

const metadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: ["공식 데이터를 확인하지 못했습니다."] as const,
};

describe("calculation result metadata", () => {
  it("keeps verified and estimated values explicit without changing the value", () => {
    const verified = verifiedResult(3, metadata);
    const estimated = estimatedResult(3, metadata);

    expect(verified).toMatchObject({ value: 3, metadata: { status: "verified" } });
    expect(estimated).toMatchObject({ value: 3, metadata: { status: "estimated" } });
  });

  it.each([
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["nested NaN", { annualGenerationKwh: Number.NaN, monthlyGenerationKwh: [100, 120] }],
    ["nested Infinity", { annualGenerationKwh: 1_200, monthlyGenerationKwh: [100, Number.POSITIVE_INFINITY] }],
  ])("does not expose a result containing an invalid numeric value: %s", (_label, value) => {
    const result = estimatedResult(value, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과에 계산할 수 없는 숫자가 포함되어 있습니다.");
  });

  it.each([
    ["empty source label", { sources: [{ label: "", url: "https://example.com/source" }] }],
    ["relative source URL", { sources: [{ label: "공식 자료", url: "/source" }] }],
    ["invalid reference date", { referenceDate: "2026-02-30" }],
    ["timestamp reference date", { referenceDate: "2026-08-10T00:00:00.000Z" }],
    ["date-only calculatedAt", { calculatedAt: "2026-08-10" }],
    ["invalid calendar date calculatedAt", { calculatedAt: "2026-02-30T00:00:00.000Z" }],
    ["invalid hour calculatedAt", { calculatedAt: "2026-08-10T24:00:00.000Z" }],
    ["invalid offset calculatedAt", { calculatedAt: "2026-08-10T09:00:00+09:60" }],
  ])("does not expose a verified value with invalid provenance: %s", (_label, invalidMetadata) => {
    const result = verifiedResult(3, {
      ...metadata,
      ...invalidMetadata,
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain(
      "결과의 출처·기준일 또는 계산 시각이 올바르지 않습니다.",
    );
  });

  it.each([
    ["empty input key", { inputs: [{ key: " ", value: 3, unit: "kW" }] }],
    ["empty input value", { inputs: [{ key: "region", value: " " }] }],
    ["non-finite input value", { inputs: [{ key: "capacity", value: Number.NaN, unit: "kW" }] }],
    ["empty assumption key", { assumptions: [{ key: " ", value: 0.8 }] }],
    ["non-finite assumption value", { assumptions: [{ key: "ratio", value: Number.POSITIVE_INFINITY }] }],
    ["empty unit", { assumptions: [{ key: "capacity", value: 3, unit: " " }] }],
    ["empty description", { assumptions: [{ key: "capacity", value: 3, description: " " }] }],
    ["empty limitation", { limitations: [" "] }],
  ])("does not expose a verified value with invalid calculation metadata: %s", (_label, invalidMetadata) => {
    const result = verifiedResult(3, {
      ...metadata,
      ...invalidMetadata,
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain(
      "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.",
    );
  });

  it("accepts canonical and timezone-offset provenance for verified and estimated values", () => {
    const provenance = {
      ...metadata,
      sources: [{ label: "공식 자료", url: "https://example.com/source" }],
      referenceDate: "2026-08-10",
      calculatedAt: "2026-08-10T00:00:00.000Z",
    };
    const offsetProvenance = {
      ...provenance,
      calculatedAt: "2026-08-10T09:00:00+09:00",
    };

    expect(verifiedResult(3, provenance)).toMatchObject({ value: 3, metadata: { status: "verified" } });
    expect(estimatedResult(3, provenance)).toMatchObject({ value: 3, metadata: { status: "estimated" } });
    expect(estimatedResult(3, offsetProvenance)).toMatchObject({ value: 3, metadata: { status: "estimated" } });
  });

  it("accepts finite numeric and non-empty text metadata", () => {
    const result = estimatedResult(3, {
      ...metadata,
      inputs: [{ key: "region", value: "서울" }, { key: "capacity", value: 3, unit: "kW" }],
      assumptions: [{ key: "usableRoofRatio", value: 0.8, description: "사용 가능한 지붕 면적 비율" }],
      limitations: ["현장 조건에 따라 달라질 수 있습니다."],
    });

    expect(result).toMatchObject({ value: 3, metadata: { status: "estimated" } });
  });

  it("keeps unavailable distinct from a numeric zero", () => {
    const result = unavailableResult<number>(metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
    expect(result.value).not.toBe(0);
  });

  it("keeps external-data errors distinct from unavailable data", () => {
    const result = errorResult<number>({
      ...metadata,
      limitations: ["외부 데이터를 불러오지 못했습니다."],
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
  });

  it("preserves inputs, source, date, assumptions, and limitations metadata", () => {
    const result = unavailableResult<number>({
      inputs: [{ key: "region", value: "서울" }],
      sources: [{ label: "공식 자료", url: "https://example.com/source" }],
      referenceDate: "2026-08-10",
      calculatedAt: "2026-08-10T01:00:00+09:00",
      assumptions: [{ key: "capacity", value: 3, unit: "kW" }],
      limitations: ["현장 조건은 별도 확인이 필요합니다."],
    });

    expect(result.metadata).toMatchObject({
      status: "unavailable",
      inputs: [{ key: "region", value: "서울" }],
      referenceDate: "2026-08-10",
      calculatedAt: "2026-08-10T01:00:00+09:00",
      sources: [{ label: "공식 자료", url: "https://example.com/source" }],
      assumptions: [{ key: "capacity", value: 3, unit: "kW" }],
      limitations: ["현장 조건은 별도 확인이 필요합니다."],
    });
  });
});
