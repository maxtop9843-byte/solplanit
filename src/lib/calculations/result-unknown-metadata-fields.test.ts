import { describe, expect, it } from "vitest";

import {
  errorResult,
  estimatedResult,
  unavailableResult,
  verifiedResult,
  type CalculationResultMetadata,
} from "./result";

const baseMetadata = {
  sources: [{ label: "JRC PVGIS", url: "https://re.jrc.ec.europa.eu/pvg_tools/en/" }],
  assumptions: [],
  limitations: [],
} satisfies Omit<CalculationResultMetadata, "status">;

const hiddenRuntimeValue = () => "not-part-of-the-contract";

describe("calculation result unknown metadata fields", () => {
  it.each([
    ["verified", verifiedResult],
    ["estimated", estimatedResult],
  ] as const)("rejects unknown top-level metadata for %s results", (_label, createResult) => {
    const metadata = {
      ...baseMetadata,
      diagnostic: "not-part-of-the-contract",
    } as unknown as Omit<CalculationResultMetadata, "status">;

    const result = createResult({ annualGenerationKwh: 1_350 }, metadata);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata).not.toHaveProperty("diagnostic");
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(result.metadata.limitations).toContain(
      "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.",
    );
  });

  it.each([
    ["unavailable", unavailableResult],
    ["error", errorResult],
  ] as const)("sanitizes unknown top-level metadata for %s results", (_label, createResult) => {
    const metadata = {
      ...baseMetadata,
      diagnostic: hiddenRuntimeValue,
    } as unknown as Omit<CalculationResultMetadata, "status">;

    const result = createResult<number>(metadata);

    expect(result.value).toBeNull();
    expect(result.metadata).not.toHaveProperty("diagnostic");
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(() => JSON.stringify(result)).not.toThrow();
  });

  it("drops source and input entries with fields outside the metadata contract", () => {
    const metadata = {
      sources: [
        {
          label: "JRC PVGIS",
          url: "https://re.jrc.ec.europa.eu/pvg_tools/en/",
          raw: hiddenRuntimeValue,
        },
      ],
      inputs: [{ key: "capacity", value: 3, unit: "kW", raw: hiddenRuntimeValue }],
      assumptions: [],
      limitations: [],
    } as unknown as Omit<CalculationResultMetadata, "status">;

    const result = unavailableResult<number>(metadata);

    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.inputs).toEqual([]);
    expect(result.metadata.limitations).toContain(
      "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.",
    );
    expect(() => JSON.stringify(result)).not.toThrow();
  });
});
