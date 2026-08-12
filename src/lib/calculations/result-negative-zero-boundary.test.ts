import { describe, expect, it } from "vitest";

import { estimatedResult, verifiedResult } from "./result";

const metadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: [] as const,
};

describe("calculation result negative-zero boundary", () => {
  it("rejects a top-level negative zero that JSON would silently normalize", () => {
    expect(JSON.stringify(-0)).toBe("0");

    const result = estimatedResult(-0, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과 값의 형식이 올바르지 않습니다.");
  });

  it.each([
    ["nested object", { annualGenerationKwh: -0 }],
    ["nested array", { monthlyGenerationKwh: [0, -0] }],
  ])("rejects %s negative zero before the result crosses the JSON boundary", (_label, value) => {
    const result = estimatedResult(value, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.limitations).toContain("결과 값의 형식이 올바르지 않습니다.");
  });

  it.each(["input", "assumption"])(
    "rejects a negative-zero %s metadata value before JSON normalization",
    (entryType) => {
      const result = verifiedResult(1, {
        ...metadata,
        ...(entryType === "input"
          ? { inputs: [{ key: "monthlyUsageKwh", value: -0, unit: "kWh" }] }
          : { assumptions: [{ key: "lossRate", value: -0, unit: "%" }] }),
      });

      expect(JSON.stringify(-0)).toBe("0");
      expect(result.value).toBeNull();
      expect(result.metadata.status).toBe("error");
      expect(result.metadata.limitations).toContain("결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.");
    },
  );

  it("keeps ordinary zero as a valid result value and metadata value", () => {
    const result = verifiedResult({ annualGenerationKwh: 0 }, {
      ...metadata,
      inputs: [{ key: "monthlyUsageKwh", value: 0, unit: "kWh" }],
      assumptions: [{ key: "lossRate", value: 0, unit: "%" }],
    });

    expect(result.value).toEqual({ annualGenerationKwh: 0 });
    expect(result.metadata.status).toBe("verified");
    expect(result.metadata.inputs?.[0]?.value).toBe(0);
    expect(result.metadata.assumptions[0]?.value).toBe(0);
  });
});
