import { calculateKepcoResidentialLowVoltageBill } from "../electricity/kepco-residential-low-voltage";
import {
  errorResult,
  estimatedResult,
  unavailableResult,
  type CalculationResult,
} from "./result";

export type ResidentialBillSavingsRangeInput = {
  monthlyUsageKwh: number;
  monthlySolarGenerationKwh: number;
  month: number;
  calculatedAt?: string;
};

export type ResidentialBillSavingsRangeValue = {
  beforeBillWon: number;
  afterBillRangeWon: {
    min: number;
    max: number;
  };
  monthlySavingsRangeWon: {
    min: number;
    max: number;
  };
  selfConsumedSolarRangeKwh: {
    min: number;
    max: number;
  };
};

/**
 * 시간대별 가정용 부하를 모르는 상태에서 자가소비율을 꾸며내지 않고,
 * 가능한 월 전기요금 절감 범위만 계산한다.
 *
 * 하한: 발전 전력을 전혀 자가소비하지 못하는 경우.
 * 상한: 월 발전량 중 월 사용량을 넘지 않는 전력을 모두 자가소비하는 경우.
 *
 * 실제 결과는 시간대별 발전·소비 패턴에 따라 이 범위 안에서 달라진다.
 */
export function calculateResidentialBillSavingsRange(
  input: ResidentialBillSavingsRangeInput,
): CalculationResult<ResidentialBillSavingsRangeValue> {
  const baseMetadata = {
    sources: [],
    calculatedAt: input.calculatedAt,
    inputs: [
      {
        key: "monthlyUsageKwh",
        value: input.monthlyUsageKwh,
        unit: "kWh/월",
        description: "태양광 설치 전 월 전기 사용량",
      },
      {
        key: "monthlySolarGenerationKwh",
        value: input.monthlySolarGenerationKwh,
        unit: "kWh/월",
        description: "같은 달의 태양광 예상 발전량",
      },
      {
        key: "month",
        value: input.month,
        unit: "월",
        description: "전기요금 계산 월",
      },
    ],
    assumptions: [
      {
        key: "minimumSelfConsumedSolar",
        value: 0,
        unit: "kWh/월",
        description: "하한은 태양광 발전 전력을 자가소비하지 못하는 경우입니다.",
      },
      {
        key: "maximumSelfConsumedSolar",
        value: "min(월 발전량, 월 사용량)",
        description: "상한은 월 발전량 중 월 사용량을 넘지 않는 전력을 모두 자가소비하는 경우입니다.",
      },
    ],
    limitations: [
      "시간대별 전력 사용과 발전 패턴이 없으므로 실제 자가소비량을 하나의 비율로 가정하지 않습니다.",
      "남는 발전 전력의 판매·상계 가치는 포함하지 않습니다.",
      "이 단계는 한 달의 요금 범위만 계산하며 계절별 발전량과 요금이 필요한 연간 절감액은 만들지 않습니다.",
    ],
  } as const;

  if (
    !Number.isFinite(input.monthlyUsageKwh) ||
    input.monthlyUsageKwh < 0 ||
    Object.is(input.monthlyUsageKwh, -0) ||
    !Number.isFinite(input.monthlySolarGenerationKwh) ||
    input.monthlySolarGenerationKwh < 0 ||
    Object.is(input.monthlySolarGenerationKwh, -0)
  ) {
    return errorResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "월 전기 사용량과 월 태양광 발전량은 0 이상의 숫자여야 합니다.",
      ],
    });
  }

  const beforeBill = calculateKepcoResidentialLowVoltageBill({
    usageKwh: input.monthlyUsageKwh,
    month: input.month,
    calculatedAt: input.calculatedAt,
  });

  if (beforeBill.metadata.status === "error") {
    return errorResult({
      ...baseMetadata,
      sources: beforeBill.metadata.sources,
      referenceDate: beforeBill.metadata.referenceDate,
      limitations: [...baseMetadata.limitations, ...beforeBill.metadata.limitations],
    });
  }

  if (beforeBill.metadata.status !== "verified" || beforeBill.value === null) {
    return unavailableResult({
      ...baseMetadata,
      sources: beforeBill.metadata.sources,
      referenceDate: beforeBill.metadata.referenceDate,
      limitations: [...baseMetadata.limitations, ...beforeBill.metadata.limitations],
    });
  }

  const maximumSelfConsumedSolarKwh = Math.min(
    input.monthlyUsageKwh,
    input.monthlySolarGenerationKwh,
  );
  const minimumAfterUsageKwh = Math.max(0, input.monthlyUsageKwh - maximumSelfConsumedSolarKwh);
  const bestCaseAfterBill = calculateKepcoResidentialLowVoltageBill({
    usageKwh: minimumAfterUsageKwh,
    month: input.month,
    calculatedAt: input.calculatedAt,
  });

  if (bestCaseAfterBill.metadata.status !== "verified" || bestCaseAfterBill.value === null) {
    return unavailableResult({
      ...baseMetadata,
      sources: beforeBill.metadata.sources,
      referenceDate: beforeBill.metadata.referenceDate,
      limitations: [
        ...baseMetadata.limitations,
        ...bestCaseAfterBill.metadata.limitations,
        "설치 후 요금 범위를 계산할 수 없어 절감액을 표시하지 않습니다.",
      ],
    });
  }

  const beforeBillWon = beforeBill.value.standardBillWon;
  const bestCaseAfterBillWon = bestCaseAfterBill.value.standardBillWon;
  const maximumSavingsWon = Math.max(0, beforeBillWon - bestCaseAfterBillWon);

  return estimatedResult(
    {
      beforeBillWon,
      afterBillRangeWon: {
        min: bestCaseAfterBillWon,
        max: beforeBillWon,
      },
      monthlySavingsRangeWon: {
        min: 0,
        max: maximumSavingsWon,
      },
      selfConsumedSolarRangeKwh: {
        min: 0,
        max: maximumSelfConsumedSolarKwh,
      },
    },
    {
      ...baseMetadata,
      sources: beforeBill.metadata.sources,
      referenceDate: beforeBill.metadata.referenceDate,
    },
  );
}
