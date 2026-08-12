import { describe, expect, it } from "vitest";

import { errorResult, unavailableResult } from "./result";

const metadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: ["공식 데이터를 확인하지 못했습니다."] as const,
};

describe("calculation result unavailable metadata boundary", () => {
  it.each([
    ["invalid source", { sources: [{ label: "공식 자료", url: "/relative" }] }],
    ["invalid reference date", { referenceDate: "2026-02-30" }],
    ["invalid calculatedAt", { calculatedAt: "2026-08-12" }],
  ])("does not hide invalid provenance behind unavailable: %s", (_label, invalidMetadata) => {
    const result = unavailableResult<number>({
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
    ["empty input", { inputs: [{ key: "region", value: " " }] }],
    ["invalid assumption", { assumptions: [{ key: "capacity", value: Number.NaN, unit: "kW" }] }],
    ["empty limitation", { limitations: [" "] }],
  ])("does not hide invalid calculation metadata behind unavailable: %s", (_label, invalidMetadata) => {
    const result = unavailableResult<number>({
      ...metadata,
      ...invalidMetadata,
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain(
      "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.",
    );
  });

  it("keeps valid unavailable metadata unavailable", () => {
    const result = unavailableResult<number>({
      ...metadata,
      sources: [{ label: "공식 자료", url: "https://example.com/source" }],
      referenceDate: "2026-08-12",
      calculatedAt: "2026-08-12T08:30:00Z",
      inputs: [{ key: "region", value: "서울" }],
      assumptions: [{ key: "capacity", value: 3, unit: "kW" }],
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
  });

  it("keeps explicit error status while surfacing invalid metadata diagnostics", () => {
    const result = errorResult<number>({
      ...metadata,
      referenceDate: "2026-02-30",
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain(
      "결과의 출처·기준일 또는 계산 시각이 올바르지 않습니다.",
    );
  });
});
