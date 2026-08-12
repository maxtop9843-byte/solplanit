import { describe, expect, it } from "vitest";

import { estimatedResult, unavailableResult } from "./result";

const baseMetadata = {
  sources: [] as const,
  assumptions: [] as const,
  limitations: [] as const,
};

describe("calculation metadata JSON own-property boundary", () => {
  it("rejects a non-enumerable source field instead of returning lossy verified metadata", () => {
    const source = { label: "PVGIS", url: "https://re.jrc.ec.europa.eu/pvg_tools/en/" };
    Object.defineProperty(source, "label", {
      value: "PVGIS",
      enumerable: false,
      configurable: true,
    });

    expect(JSON.stringify(source)).toBe('{"url":"https://re.jrc.ec.europa.eu/pvg_tools/en/"}');

    const result = estimatedResult(1_200, {
      ...baseMetadata,
      sources: [source],
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
    expect(result.metadata.limitations).toContain("결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.");
  });

  it("rejects accessor-backed input fields before they can become lossy serialized metadata", () => {
    const input = {
      get key() {
        return "capacityKw";
      },
      value: 3,
      unit: "kW",
    };

    const result = estimatedResult(1_200, {
      ...baseMetadata,
      inputs: [input],
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.inputs).toEqual([]);
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
  });

  it("sanitizes lossy assumption objects for unavailable results without fabricating metadata", () => {
    const assumption = { key: "loss", value: 14, unit: "%" };
    Object.defineProperty(assumption, "unit", {
      value: "%",
      enumerable: false,
      configurable: true,
    });

    const result = unavailableResult({
      ...baseMetadata,
      assumptions: [assumption],
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.assumptions).toEqual([]);
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
  });

  it("keeps plain enumerable source and input metadata unchanged", () => {
    const result = estimatedResult(1_200, {
      sources: [{ label: "PVGIS", url: "https://re.jrc.ec.europa.eu/pvg_tools/en/" }],
      inputs: [{ key: "capacityKw", value: 3, unit: "kW" }],
      assumptions: [{ key: "tilt", value: 30, unit: "°" }],
      limitations: ["현장 음영은 반영하지 않습니다."],
    });

    expect(result.value).toBe(1_200);
    expect(result.metadata.status).toBe("estimated");
    expect(result.metadata.sources).toHaveLength(1);
    expect(result.metadata.inputs).toHaveLength(1);
    expect(result.metadata.assumptions).toHaveLength(1);
  });
});
