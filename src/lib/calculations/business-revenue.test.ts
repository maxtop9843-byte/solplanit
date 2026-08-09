import { describe, expect, it } from "vitest";

import { calculateBusinessRevenue } from "./business-revenue";

describe("calculateBusinessRevenue", () => {
  it("keeps SMP and REC revenue inside the business calculation boundary", () => {
    const result = calculateBusinessRevenue({
      annualGenerationKwh: 13_140,
      smpPricePerKwh: 100,
      recPricePerRec: 70_000,
      recWeight: 1.2,
    });

    expect(result).toEqual({
      annualSmpRevenue: 1_314_000,
      annualRecRevenue: 1_103_760,
      annualRevenue: 2_417_760,
    });
  });

  it("preserves zero-priced market inputs as a real zero result", () => {
    expect(calculateBusinessRevenue({
      annualGenerationKwh: 13_140,
      smpPricePerKwh: 0,
      recPricePerRec: 0,
      recWeight: 1,
    })).toEqual({
      annualSmpRevenue: 0,
      annualRecRevenue: 0,
      annualRevenue: 0,
    });
  });
});
