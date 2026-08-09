import { calculateBusinessRevenue } from "./business-revenue";

export type CalculationGoal = "save" | "sell";

export type EconomicsInput = {
  capacityKw: number;
  goal: CalculationGoal;
  averageDailyGenerationHours: number;
  systemLossRate: number;
  installationCostPerKw: number;
  selfConsumptionRate?: number;
  electricityValuePerKwh?: number;
  smpPricePerKwh?: number;
  recPricePerRec?: number;
  recWeight?: number;
};

export type EconomicsResult = {
  annualGenerationKwh: number;
  monthlyAverageGenerationKwh: number;
  annualSavings: number;
  monthlyAverageSavings: number;
  annualSmpRevenue: number;
  annualRecRevenue: number;
  annualRevenue: number;
  monthlyAverageRevenue: number;
  annualBenefit: number;
  installationCost: number;
  paybackYears: number | null;
  methodVersion: string;
};

export const ECONOMICS_METHOD = {
  version: "2026-07-29",
  daysPerYear: 365,
  monthsPerYear: 12,
  sources: [
    {
      label: "전력거래소 전력시장 운영 및 SMP 정보",
      url: "https://new.kpx.or.kr/",
    },
    {
      label: "한국에너지공단 신·재생에너지센터 공급인증서(REC) 안내",
      url: "https://www.knrec.or.kr/",
    },
  ],
} as const;

export class EconomicsInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EconomicsInputError";
  }
}

const round = (value: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
};

const requireFiniteNonNegative = (value: number | undefined, label: string) => {
  if (value === undefined || !Number.isFinite(value) || value < 0) {
    throw new EconomicsInputError(`${label}을(를) 0 이상의 숫자로 넣어주세요.`);
  }
  return value;
};

const requireRate = (value: number | undefined, label: string) => {
  const rate = requireFiniteNonNegative(value, label);
  if (rate > 1) throw new EconomicsInputError(`${label}은(는) 0%에서 100% 사이여야 합니다.`);
  return rate;
};

export function calculateSolarEconomics(input: EconomicsInput): EconomicsResult {
  const capacityKw = requireFiniteNonNegative(input.capacityKw, "설치 용량");
  if (capacityKw === 0) throw new EconomicsInputError("설치 용량은 0kW보다 커야 합니다.");

  const dailyHours = requireFiniteNonNegative(input.averageDailyGenerationHours, "평균 일 발전시간");
  if (dailyHours === 0 || dailyHours > 24) {
    throw new EconomicsInputError("평균 일 발전시간은 0시간보다 크고 24시간 이하여야 합니다.");
  }

  const lossRate = requireRate(input.systemLossRate, "시스템 손실률");
  const installationCostPerKw = requireFiniteNonNegative(input.installationCostPerKw, "kW당 설치비");
  const annualGenerationRaw = capacityKw * dailyHours * ECONOMICS_METHOD.daysPerYear * (1 - lossRate);
  const annualGenerationKwh = round(annualGenerationRaw);
  const monthlyAverageGenerationKwh = round(annualGenerationRaw / ECONOMICS_METHOD.monthsPerYear);
  const installationCost = round(capacityKw * installationCostPerKw, 0);

  let annualSavings = 0;
  let annualSmpRevenue = 0;
  let annualRecRevenue = 0;

  if (input.goal === "save") {
    const selfConsumptionRate = requireRate(input.selfConsumptionRate, "자가소비율");
    const electricityValuePerKwh = requireFiniteNonNegative(input.electricityValuePerKwh, "전력 가치");
    annualSavings = round(annualGenerationRaw * selfConsumptionRate * electricityValuePerKwh, 0);
  } else if (input.goal === "sell") {
    const smpPricePerKwh = requireFiniteNonNegative(input.smpPricePerKwh, "SMP 단가");
    const recPricePerRec = requireFiniteNonNegative(input.recPricePerRec, "REC 단가");
    const recWeight = requireFiniteNonNegative(input.recWeight, "REC 가중치");
    const revenue = calculateBusinessRevenue({
      annualGenerationKwh: annualGenerationRaw,
      smpPricePerKwh,
      recPricePerRec,
      recWeight,
    });
    annualSmpRevenue = revenue.annualSmpRevenue;
    annualRecRevenue = revenue.annualRecRevenue;
  } else {
    throw new EconomicsInputError("계산 목적을 선택해주세요.");
  }

  const annualRevenue = annualSmpRevenue + annualRecRevenue;
  const annualBenefit = input.goal === "save" ? annualSavings : annualRevenue;

  return {
    annualGenerationKwh,
    monthlyAverageGenerationKwh,
    annualSavings,
    monthlyAverageSavings: round(annualSavings / ECONOMICS_METHOD.monthsPerYear, 0),
    annualSmpRevenue,
    annualRecRevenue,
    annualRevenue,
    monthlyAverageRevenue: round(annualRevenue / ECONOMICS_METHOD.monthsPerYear, 0),
    annualBenefit,
    installationCost,
    paybackYears: annualBenefit > 0 ? round(installationCost / annualBenefit, 1) : null,
    methodVersion: ECONOMICS_METHOD.version,
  };
}
