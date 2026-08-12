import { describe, expect, it } from "vitest";

import {
  RESIDENTIAL_SOLAR_SUPPORT_2026,
  getResidentialSolarSupport2026,
} from "./residentialSolarSupport2026";

describe("2026 residential solar support data", () => {
  it("stores the required source and eligibility fields for every verified record", () => {
    for (const record of RESIDENTIAL_SOLAR_SUPPORT_2026) {
      expect(record.year).toBe(2026);
      expect(record.region.province.length).toBeGreaterThan(0);
      expect(record.target.length).toBeGreaterThan(0);
      expect(record.capacity.maxKw).toBeGreaterThan(0);
      expect(record.checkedAt).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(record.source.url).toMatch(/^https:\/\//);
      expect(record.source.organization.length).toBeGreaterThan(0);

      if (record.availability === "available") {
        expect(record.support).toBeDefined();
      }
    }
  });

  it("returns both province and district programs when both are verified", () => {
    const result = getResidentialSolarSupport2026({
      province: "경기도",
      district: "의정부시",
      capacityKw: 3,
    });

    expect(result.status).toBe("available");
    expect(result.programs.map((program) => program.id)).toEqual([
      "2026-gyeonggi-residential-solar-3kw",
      "2026-gyeonggi-uijeongbu-residential-solar-up-to-3kw",
    ]);
  });

  it("does not reuse another district's support amount", () => {
    const result = getResidentialSolarSupport2026({
      province: "서울특별시",
      district: "강남구",
      capacityKw: 3,
    });

    expect(result).toEqual({ status: "unverified", programs: [] });
  });

  it("does not interpret an unverified capacity as zero support", () => {
    const result = getResidentialSolarSupport2026({
      province: "서울특별시",
      district: "관악구",
      capacityKw: 5,
    });

    expect(result).toEqual({ status: "unverified", programs: [] });
  });

  it("rejects invalid capacity without fabricating a support result", () => {
    expect(
      getResidentialSolarSupport2026({
        province: "경기도",
        capacityKw: Number.NaN,
      }),
    ).toEqual({ status: "unverified", programs: [] });

    expect(
      getResidentialSolarSupport2026({
        province: "경기도",
        capacityKw: 0,
      }),
    ).toEqual({ status: "unverified", programs: [] });
  });
});
