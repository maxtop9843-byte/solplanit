import { describe, expect, it } from "vitest";

import { unavailableResult } from "./result";

const baseMetadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: ["공식 데이터를 확인하지 못했습니다."] as const,
};

describe("calculation unavailable provenance boundary", () => {
  it("keeps unavailable when provenance is absent but metadata is otherwise valid", () => {
    const result = unavailableResult(baseMetadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
  });

  it("does not expose unavailable with an invalid source as trustworthy provenance", () => {
    const result = unavailableResult({
      ...baseMetadata,
      sources: [{ label: "공식 자료", url: "not-a-url" }],
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain(
      "결과의 출처·기준일 또는 계산 시각이 올바르지 않습니다.",
    );
  });

  it("does not expose unavailable with an invalid reference date", () => {
    const result = unavailableResult({
      ...baseMetadata,
      referenceDate: "2026-02-30",
    });

    expect(result.metadata.status).toBe("error");
  });

  it("does not expose unavailable with an invalid calculated timestamp", () => {
    const result = unavailableResult({
      ...baseMetadata,
      calculatedAt: "2026-08-12 04:00:00",
    });

    expect(result.metadata.status).toBe("error");
  });
});
