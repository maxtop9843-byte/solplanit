import {
  errorResult,
  estimatedResult,
  type CalculationInput,
  type CalculationResult,
  type CalculationSource,
} from "./result";

export type BusinessRevenueInput = {
  annualGenerationKwh: number;
  smpPricePerKwh: number;
  recPricePerRec: number;
  recWeight: number;
};

export type BusinessRevenueResult = {
  annualSmpRevenue: number;
  annualRecRevenue: number;
  annualRevenue: number;
};

export type BusinessRevenueResultMetadata = {
  sources?: readonly CalculationSource[];
  referenceDate?: string;
  calculatedAt?: string;
};

const roundWon = (value: number) => Math.round(value + Number.EPSILON);

function businessRevenueInputs(input: BusinessRevenueInput): CalculationInput[] {
  return [
    {
      key: "annualGenerationKwh",
      value: input.annualGenerationKwh,
      unit: "kWh/년",
      description: "연간 발전량",
    },
    {
      key: "smpPricePerKwh",
      value: input.smpPricePerKwh,
      unit: "원/kWh",
      description: "SMP 단가",
    },
    {
      key: "recPricePerRec",
      value: input.recPricePerRec,
      unit: "원/REC",
      description: "REC 단가",
    },
    {
      key: "recWeight",
      value: input.recWeight,
      description: "REC 가중치",
    },
  ];
}

function hasInvalidBusinessRevenueInput(input: BusinessRevenueInput): boolean {
  return Object.values(input).some((value) => !Number.isFinite(value) || value < 0);
}

/**
 * 발전사업자용 SMP·REC 수익 계산 경계.
 *
 * 주택용 전기요금 절감과 섞지 않으며, 가격·가중치의 출처와 기준일을
 * 결정하는 책임은 데이터 계층에 둔다. 이 함수는 검증된 입력값의 산술만 담당한다.
 */
export function calculateBusinessRevenue(input: BusinessRevenueInput): BusinessRevenueResult {
  const annualSmpRevenue = roundWon(input.annualGenerationKwh * input.smpPricePerKwh);
  const annualRecRevenue = roundWon(
    (input.annualGenerationKwh / 1000) * input.recWeight * input.recPricePerRec,
  );

  return {
    annualSmpRevenue,
    annualRecRevenue,
    annualRevenue: annualSmpRevenue + annualRecRevenue,
  };
}

/**
 * 발전사업자 수익을 Search-first V3 공통 결과 계약으로 감싼다.
 *
 * SMP·REC 가격과 가중치는 시장·제도 조건에 따라 바뀌므로 계산 결과 자체는
 * 확정 수익이 아닌 `estimated`로 유지한다. 자동으로 넣는 시장값은 호출자가
 * 출처와 기준일을 함께 전달해야 하며, 직접 입력값도 결과 메타데이터에 보존한다.
 */
export function createBusinessRevenueResult(
  input: BusinessRevenueInput,
  metadata: BusinessRevenueResultMetadata = {},
): CalculationResult<BusinessRevenueResult> {
  const inputs = businessRevenueInputs(input);
  const commonMetadata = {
    sources: metadata.sources ?? [],
    referenceDate: metadata.referenceDate,
    calculatedAt: metadata.calculatedAt,
    inputs,
    assumptions: [],
  };

  if (hasInvalidBusinessRevenueInput(input)) {
    return errorResult({
      ...commonMetadata,
      limitations: ["발전량, SMP·REC 단가와 REC 가중치는 0 이상의 숫자여야 합니다."],
    });
  }

  return estimatedResult(calculateBusinessRevenue(input), {
    ...commonMetadata,
    limitations: [
      "SMP·REC 가격과 REC 가중치는 기준일과 시장·설비 조건에 따라 달라질 수 있어 실제 수익을 보장하지 않습니다.",
    ],
  });
}
