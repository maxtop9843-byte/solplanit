import { describe, expect, it } from "vitest";

import { estimatedResult, unavailableResult } from "./result";

const sanitizedLimitation = "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.";
const invalidMetadataLimitation = "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.";

describe("calculation metadata prototype boundary", () => {
  it("rejects inherited required metadata instead of promoting values JSON would omit", () => {
    const inheritedMetadata = Object.create({
      sources: [{ label: "PVGIS", url: "https://re.jrc.ec.europa.eu/pvg_tools/en/" }],
      assumptions: [{ key: "tilt", value: 30, unit: "°" }],
      limitations: ["상속된 한계입니다."],
    });

    expect(JSON.stringify(inheritedMetadata)).toBe("{}");

    const result = estimatedResult(1_200, inheritedMetadata as never);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.assumptions).toEqual([]);
    expect(result.metadata.limitations).toContain(sanitizedLimitation);
    expect(result.metadata.limitations).toContain(invalidMetadataLimitation);
  });

  it("does not promote inherited optional provenance into unavailable metadata", () => {
    const inheritedMetadata = Object.create({
      referenceDate: "2026-08-12",
      calculatedAt: "2026-08-12T01:00:00Z",
    });
    inheritedMetadata.sources = [];
    inheritedMetadata.assumptions = [];
    inheritedMetadata.limitations = [];

    expect(JSON.stringify(inheritedMetadata)).toBe('{"sources":[],"assumptions":[],"limitations":[]}');

    const result = unavailableResult(inheritedMetadata as never);

    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.referenceDate).toBeUndefined();
    expect(result.metadata.calculatedAt).toBeUndefined();
    expect(result.metadata.limitations).toContain(sanitizedLimitation);
  });

  it("keeps null-prototype metadata when every serialized field is an own property", () => {
    const metadata = Object.assign(Object.create(null), {
      sources: [],
      assumptions: [],
      limitations: ["현장 조건은 별도 확인이 필요합니다."],
    });

    const result = estimatedResult(1_200, metadata as never);

    expect(result.value).toBe(1_200);
    expect(result.metadata.status).toBe("estimated");
    expect(result.metadata.limitations).toEqual(["현장 조건은 별도 확인이 필요합니다."]);
  });
});
