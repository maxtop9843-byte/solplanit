import { describe, expect, it } from "vitest";

import { estimatedResult, verifiedResult } from "./result";

const metadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: [] as const,
};

describe("calculation result array prototype boundary", () => {
  it.each([
    ["verified", verifiedResult],
    ["estimated", estimatedResult],
  ] as const)("rejects a %s result array with a custom prototype", (_status, makeResult) => {
    const value = [120, 130, 140];
    Object.setPrototypeOf(value, { inheritedValue: 999 });

    const result = makeResult(value, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과 값의 형식이 올바르지 않습니다.");
  });

  it("keeps a normal dense result array valid", () => {
    const result = estimatedResult([120, 130, 140], metadata);

    expect(result.value).toEqual([120, 130, 140]);
    expect(result.metadata.status).toBe("estimated");
  });
});
