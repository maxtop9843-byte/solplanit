import { describe, expect, it } from "vitest";

import { estimatedResult, unavailableResult } from "./result";

const baseMetadata = {
  sources: [{ label: "PVGIS", url: "https://re.jrc.ec.europa.eu/pvg_tools/en/" }],
  assumptions: [{ key: "tilt", value: 30, unit: "°" }],
  limitations: ["현장 음영은 반영하지 않습니다."],
};

describe("calculation metadata JSON array-property boundary", () => {
  it("rejects extra source-array properties that JSON serialization would silently drop", () => {
    const sources = [...baseMetadata.sources] as typeof baseMetadata.sources & { note?: string };
    sources.note = "hidden from JSON array serialization";

    expect(JSON.stringify(sources)).toBe(JSON.stringify(baseMetadata.sources));

    const result = estimatedResult(1_200, {
      ...baseMetadata,
      sources,
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual(baseMetadata.sources);
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
    expect(result.metadata.limitations).toContain("결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.");
  });

  it("sanitizes symbol properties on assumption arrays without fabricating unavailable data", () => {
    const marker = Symbol("metadata-marker");
    const assumptions = [...baseMetadata.assumptions] as typeof baseMetadata.assumptions & {
      [marker]?: string;
    };
    assumptions[marker] = "not serialized";

    const result = unavailableResult({
      ...baseMetadata,
      assumptions,
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.assumptions).toEqual(baseMetadata.assumptions);
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
  });

  it("rejects custom source-array prototypes that JSON serialization would not preserve", () => {
    const sources = [...baseMetadata.sources];
    Object.setPrototypeOf(sources, Object.create(Array.prototype));

    expect(Array.isArray(sources)).toBe(true);
    expect(JSON.stringify(sources)).toBe(JSON.stringify(baseMetadata.sources));

    const result = estimatedResult(1_200, {
      ...baseMetadata,
      sources,
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual(baseMetadata.sources);
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
    expect(result.metadata.limitations).toContain("결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.");
  });

  it("sanitizes custom assumption-array prototypes without fabricating unavailable data", () => {
    const assumptions = [...baseMetadata.assumptions];
    Object.setPrototypeOf(assumptions, Object.create(Array.prototype));

    const result = unavailableResult({
      ...baseMetadata,
      assumptions,
    });

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.assumptions).toEqual(baseMetadata.assumptions);
    expect(result.metadata.limitations).toContain("결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.");
  });

  it("keeps plain dense metadata arrays unchanged", () => {
    const result = estimatedResult(1_200, {
      ...baseMetadata,
      inputs: [{ key: "capacityKw", value: 3, unit: "kW" }],
    });

    expect(result.value).toBe(1_200);
    expect(result.metadata.status).toBe("estimated");
    expect(result.metadata.sources).toEqual(baseMetadata.sources);
    expect(result.metadata.assumptions).toEqual(baseMetadata.assumptions);
    expect(result.metadata.limitations).toEqual(baseMetadata.limitations);
  });
});
