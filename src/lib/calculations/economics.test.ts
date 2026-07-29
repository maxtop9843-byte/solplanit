import { describe, expect, it } from "vitest";
import { calculateSolarEconomics, EconomicsInputError } from "./economics";

describe("calculateSolarEconomics", () => {
  const common = {
    capacityKw: 10,
    averageDailyGenerationHours: 4,
    systemLossRate: 0.1,
    installationCostPerKw: 1_500_000,
  } as const;

  it("calculates annual and monthly generation consistently", () => {
    const result = calculateSolarEconomics({
      ...common,
      goal: "save",
      selfConsumptionRate: 0.8,
      electricityValuePerKwh: 150,
    });

    expect(result.annualGenerationKwh).toBe(13_140);
    expect(result.monthlyAverageGenerationKwh * 12).toBeCloseTo(result.annualGenerationKwh, 0);
  });

  it("calculates self-consumption savings and payback", () => {
    const result = calculateSolarEconomics({
      ...common,
      goal: "save",
      selfConsumptionRate: 0.8,
      electricityValuePerKwh: 150,
    });

    expect(result.annualSavings).toBe(1_576_800);
    expect(result.monthlyAverageSavings * 12).toBe(result.annualSavings);
    expect(result.installationCost).toBe(15_000_000);
    expect(result.paybackYears).toBe(9.5);
  });

  it("calculates SMP and REC revenue separately", () => {
    const result = calculateSolarEconomics({
      ...common,
      goal: "sell",
      smpPricePerKwh: 100,
      recPricePerRec: 70_000,
      recWeight: 1.2,
    });

    expect(result.annualSmpRevenue).toBe(1_314_000);
    expect(result.annualRecRevenue).toBe(1_103_760);
    expect(result.annualRevenue).toBe(2_417_760);
    expect(result.monthlyAverageRevenue * 12).toBe(result.annualRevenue);
  });

  it("returns no payback when annual benefit is zero", () => {
    const result = calculateSolarEconomics({
      ...common,
      goal: "sell",
      smpPricePerKwh: 0,
      recPricePerRec: 0,
      recWeight: 1,
    });
    expect(result.paybackYears).toBeNull();
  });

  it("rejects invalid rates and generation hours", () => {
    expect(() => calculateSolarEconomics({
      ...common,
      goal: "save",
      selfConsumptionRate: 1.01,
      electricityValuePerKwh: 150,
    })).toThrow(EconomicsInputError);

    expect(() => calculateSolarEconomics({
      ...common,
      averageDailyGenerationHours: 25,
      goal: "sell",
      smpPricePerKwh: 100,
      recPricePerRec: 70_000,
      recWeight: 1,
    })).toThrow("24시간 이하");
  });

  it("rejects missing goal-specific assumptions", () => {
    expect(() => calculateSolarEconomics({ ...common, goal: "save" })).toThrow("자가소비율");
    expect(() => calculateSolarEconomics({ ...common, goal: "sell" })).toThrow("SMP 단가");
  });
});
