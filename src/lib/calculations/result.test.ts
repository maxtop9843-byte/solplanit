import { describe, expect, it } from "vitest";

import { errorResult, unavailableResult } from "./result";

const metadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: ["공식 데이터를 확인하지 못했습니다."] as const,
};

describe("calculation result metadata", () => {
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

  it("preserves source, date, assumptions, and limitations metadata", () => {
    const result = unavailableResult<number>({
      sources: [{ label: "공식 자료", url: "https://example.com/source" }],
      referenceDate: "2026-08-10",
      calculatedAt: "2026-08-10T01:00:00+09:00",
      assumptions: [{ key: "capacity", value: 3, unit: "kW" }],
      limitations: ["현장 조건은 별도 확인이 필요합니다."],
    });

    expect(result.metadata).toMatchObject({
      status: "unavailable",
      referenceDate: "2026-08-10",
      calculatedAt: "2026-08-10T01:00:00+09:00",
      sources: [{ label: "공식 자료", url: "https://example.com/source" }],
      assumptions: [{ key: "capacity", value: 3, unit: "kW" }],
      limitations: ["현장 조건은 별도 확인이 필요합니다."],
    });
  });
});
