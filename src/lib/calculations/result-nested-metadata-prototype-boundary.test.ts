import { describe, expect, it } from "vitest";

import { estimatedResult, unavailableResult } from "./result";

const sanitizedLimitation = "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.";
const invalidMetadataLimitation = "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.";

describe("calculation nested metadata prototype boundary", () => {
  it("rejects source entries with custom prototypes", () => {
    const source = Object.assign(Object.create({ inherited: "hidden" }), {
      label: "PVGIS",
      url: "https://re.jrc.ec.europa.eu/pvg_tools/en/",
    });

    expect(JSON.stringify(source)).toBe('{"label":"PVGIS","url":"https://re.jrc.ec.europa.eu/pvg_tools/en/"}');

    const result = estimatedResult(1_200, {
      sources: [source],
      assumptions: [],
      limitations: [],
    } as never);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.sources).toEqual([]);
    expect(result.metadata.limitations).toContain(sanitizedLimitation);
    expect(result.metadata.limitations).toContain(invalidMetadataLimitation);
  });

  it("rejects input and assumption entries with custom prototypes", () => {
    const input = Object.assign(Object.create({ inherited: "hidden" }), {
      key: "capacityKw",
      value: 3,
      unit: "kW",
    });
    const assumption = Object.assign(Object.create({ inherited: "hidden" }), {
      key: "tilt",
      value: 30,
      unit: "°",
    });

    const result = estimatedResult(1_200, {
      sources: [],
      inputs: [input],
      assumptions: [assumption],
      limitations: [],
    } as never);

    expect(result.value).toBeNull();
    expect(result.metadata.status).toBe("error");
    expect(result.metadata.inputs).toEqual([]);
    expect(result.metadata.assumptions).toEqual([]);
    expect(result.metadata.limitations).toContain(sanitizedLimitation);
    expect(result.metadata.limitations).toContain(invalidMetadataLimitation);
  });

  it("keeps null-prototype nested metadata when all fields are own JSON properties", () => {
    const source = Object.assign(Object.create(null), {
      label: "PVGIS",
      url: "https://re.jrc.ec.europa.eu/pvg_tools/en/",
    });
    const assumption = Object.assign(Object.create(null), {
      key: "tilt",
      value: 30,
      unit: "°",
    });

    const result = unavailableResult({
      sources: [source],
      assumptions: [assumption],
      limitations: [],
    } as never);

    expect(result.metadata.status).toBe("unavailable");
    expect(result.metadata.sources).toEqual([source]);
    expect(result.metadata.assumptions).toEqual([assumption]);
    expect(result.metadata.limitations).toEqual([]);
  });
});
