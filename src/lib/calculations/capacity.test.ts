import { describe, expect, it } from "vitest";
import {
  CAPACITY_METHOD,
  CapacityInputError,
  convertAreaToSquareMeters,
  estimateInstallableCapacity,
} from "./capacity";

describe("convertAreaToSquareMeters", () => {
  it("keeps square metres unchanged", () => {
    expect(convertAreaToSquareMeters(100, "m2")).toBe(100);
  });

  it("converts pyeong to square metres", () => {
    expect(convertAreaToSquareMeters(30, "pyeong")).toBeCloseTo(99.17355, 5);
  });
});

describe("estimateInstallableCapacity", () => {
  it("calculates panel count and capacity from usable area", () => {
    expect(estimateInstallableCapacity({ buildingType: "공장·창고", area: 100, areaUnit: "m2" })).toEqual({
      inputArea: 100,
      inputUnit: "m2",
      areaM2: 100,
      usableAreaM2: 70,
      usableAreaRatio: 0.7,
      panelFootprintM2: 2.4,
      panelCapacityKw: 0.45,
      panelCount: 29,
      installableCapacityKw: 13.05,
      methodVersion: CAPACITY_METHOD.version,
    });
  });

  it("uses different layout assumptions by building type", () => {
    const house = estimateInstallableCapacity({ buildingType: "주택", area: 100, areaUnit: "m2" });
    const factory = estimateInstallableCapacity({ buildingType: "공장·창고", area: 100, areaUnit: "m2" });
    const land = estimateInstallableCapacity({ buildingType: "토지", area: 100, areaUnit: "m2" });

    expect(house.panelCount).toBe(21);
    expect(factory.panelCount).toBe(29);
    expect(land.panelCount).toBe(20);
  });

  it("produces consistent results for equivalent m2 and pyeong inputs", () => {
    const m2 = estimateInstallableCapacity({ buildingType: "상가·건물", area: 99.17355, areaUnit: "m2" });
    const pyeong = estimateInstallableCapacity({ buildingType: "상가·건물", area: 30, areaUnit: "pyeong" });

    expect(pyeong.panelCount).toBe(m2.panelCount);
    expect(pyeong.installableCapacityKw).toBe(m2.installableCapacityKw);
  });

  it("rejects missing, non-finite, and below-minimum areas", () => {
    expect(() => estimateInstallableCapacity({ buildingType: "주택", area: 0, areaUnit: "m2" })).toThrow(CapacityInputError);
    expect(() => estimateInstallableCapacity({ buildingType: "주택", area: Number.NaN, areaUnit: "m2" })).toThrow(
      "면적을 숫자로 넣어 주세요. 예: 100",
    );
    expect(() => estimateInstallableCapacity({ buildingType: "주택", area: 4.99, areaUnit: "m2" })).toThrow("5m² 이상");
  });

  it("uses the same user-facing terms and spacing as the calculator UI for invalid selections", () => {
    expect(() => estimateInstallableCapacity({ buildingType: "건물" as never, area: 100, areaUnit: "m2" })).toThrow(
      "건물 종류를 다시 선택해 주세요.",
    );
    expect(() => estimateInstallableCapacity({ buildingType: "주택", area: 100, areaUnit: "square-feet" as never })).toThrow(
      "면적 단위를 다시 선택해 주세요.",
    );
  });

  it("describes area boundaries in the unit the user selected", () => {
    expect(() => estimateInstallableCapacity({ buildingType: "주택", area: 1.5, areaUnit: "pyeong" })).toThrow(
      "1.52평 이상 넣어 주세요.",
    );
    expect(() => estimateInstallableCapacity({ buildingType: "토지", area: 302_500.02, areaUnit: "pyeong" })).toThrow(
      "302,500.01평 이하로 넣어 주세요.",
    );
  });

  it("accepts the exact minimum boundary when one panel fits", () => {
    const result = estimateInstallableCapacity({ buildingType: "공장·창고", area: 5, areaUnit: "m2" });
    expect(result.panelCount).toBe(1);
    expect(result.installableCapacityKw).toBe(0.45);
  });

  it("rejects areas beyond the supported maximum", () => {
    expect(() => estimateInstallableCapacity({ buildingType: "토지", area: 1_000_001, areaUnit: "m2" })).toThrow("1,000,000m² 이하");
  });

  it("rounds capacity to two decimals and areas to two decimals", () => {
    const result = estimateInstallableCapacity({ buildingType: "주택", area: 31, areaUnit: "pyeong" });
    expect(result.areaM2).toBe(102.48);
    expect(result.usableAreaM2).toBe(56.36);
    expect(Number.isInteger(result.panelCount)).toBe(true);
    expect(result.installableCapacityKw.toString().split(".")[1]?.length ?? 0).toBeLessThanOrEqual(2);
  });
});
