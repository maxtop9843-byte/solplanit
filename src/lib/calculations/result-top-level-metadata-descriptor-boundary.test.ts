import { describe, expect, it } from "vitest";

import { estimatedResult } from "./result";

const makeMetadata = () => ({
  sources: [] as const,
  assumptions: [] as const,
  limitations: [] as const,
});

describe("top-level calculation metadata descriptor boundary", () => {
  it("rejects non-enumerable required metadata instead of returning lossy estimated metadata", () => {
    const metadata = makeMetadata();
    Object.defineProperty(metadata, "sources", {
      value: [],
      enumerable: false,
      configurable: true,
    });

    expect(JSON.stringify(metadata)).toBe('{"assumptions":[],"limitations":[]}');

    const result = estimatedResult(1_200, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
    expect(result.metadata.limitations).toContain("결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.");
  });

  it("rejects accessor-backed optional metadata instead of trusting a lossy descriptor", () => {
    const metadata = makeMetadata() as ReturnType<typeof makeMetadata> & { referenceDate?: string };
    Object.defineProperty(metadata, "referenceDate", {
      get() {
        return "2026-08-12";
      },
      enumerable: true,
      configurable: true,
    });

    const result = estimatedResult(1_200, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
    expect(result.metadata.limitations).toContain("결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.");
  });

  it("keeps plain enumerable top-level metadata valid", () => {
    const result = estimatedResult(1_200, {
      sources: [],
      referenceDate: "2026-08-12",
      assumptions: [],
      limitations: [],
    });

    expect(result.value).toBe(1_200);
    expect(result.metadata.status).toBe("estimated");
    expect(result.metadata.referenceDate).toBe("2026-08-12");
  });
});
