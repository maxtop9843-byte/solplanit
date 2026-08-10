import {
  errorResult,
  unavailableResult,
  verifiedResult,
  type CalculationInput,
  type CalculationResult,
  type CalculationSource,
} from "./result";

export type WonAmount = {
  amountWon: number;
};

export type BillSavingsValue = {
  monthlySavingsWon: number;
  annualSavingsWon: number;
};

export type BillSavingsInput = {
  beforeMonthlyBill: CalculationResult<WonAmount>;
  afterMonthlyBill: CalculationResult<WonAmount>;
  calculatedAt?: string;
};

function uniqueSources(sources: readonly CalculationSource[]): CalculationSource[] {
  const seen = new Set<string>();

  return sources.filter((source) => {
    const key = `${source.label}:${source.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniqueInputs(inputs: readonly CalculationInput[]): CalculationInput[] {
  const seen = new Set<string>();

  return inputs.filter((input) => {
    const key = JSON.stringify([input.key, input.value, input.unit, input.description]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const roundWon = (value: number) => Math.round(value + Number.EPSILON);

/**
 * 주택용 전기요금 절감 계산 경계.
 *
 * 검증된 동일 기준의 설치 전·후 월 전기요금 결과가 있을 때만 절감액을 만든다.
 * 고정 원/kWh, 임의 자가소비율, 미검증 요금 모델을 이 경계에서 새로 가정하지 않는다.
 */
export function calculateVerifiedBillSavings(
  input: BillSavingsInput,
): CalculationResult<BillSavingsValue> {
  const sources = uniqueSources([
    ...input.beforeMonthlyBill.metadata.sources,
    ...input.afterMonthlyBill.metadata.sources,
  ]);
  const inputs = uniqueInputs([
    ...(input.beforeMonthlyBill.metadata.inputs ?? []),
    ...(input.afterMonthlyBill.metadata.inputs ?? []),
  ]);
  const calculatedAt =
    input.calculatedAt ??
    (input.beforeMonthlyBill.metadata.calculatedAt === input.afterMonthlyBill.metadata.calculatedAt
      ? input.beforeMonthlyBill.metadata.calculatedAt
      : undefined);
  const baseMetadata = {
    sources,
    calculatedAt,
    inputs,
    assumptions: [
      ...input.beforeMonthlyBill.metadata.assumptions,
      ...input.afterMonthlyBill.metadata.assumptions,
      {
        key: "monthsPerYear",
        value: 12,
        unit: "개월/년",
        description: "월 절감액을 12개월로 환산해 연간 절감액을 계산합니다.",
      },
    ],
    limitations: [
      ...input.beforeMonthlyBill.metadata.limitations,
      ...input.afterMonthlyBill.metadata.limitations,
    ],
  };

  if (
    input.beforeMonthlyBill.metadata.status !== "verified" ||
    input.afterMonthlyBill.metadata.status !== "verified" ||
    input.beforeMonthlyBill.value === null ||
    input.afterMonthlyBill.value === null
  ) {
    return unavailableResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "검증된 설치 전·후 월 전기요금이 모두 있어야 절감액을 계산할 수 있습니다.",
      ],
    });
  }

  const beforeWon = input.beforeMonthlyBill.value.amountWon;
  const afterWon = input.afterMonthlyBill.value.amountWon;

  if (
    !Number.isFinite(beforeWon) ||
    !Number.isFinite(afterWon) ||
    beforeWon < 0 ||
    afterWon < 0
  ) {
    return errorResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "설치 전 또는 설치 후 전기요금이 올바르지 않아 절감액을 계산하지 않았습니다.",
      ],
    });
  }

  if (afterWon > beforeWon) {
    return errorResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "설치 후 전기요금이 설치 전보다 커서 절감액으로 처리하지 않았습니다. 요금 계산 조건을 확인해 주세요.",
      ],
    });
  }

  const monthlySavingsWon = roundWon(beforeWon - afterWon);
  const annualSavingsWon = monthlySavingsWon * 12;
  const referenceDate =
    input.beforeMonthlyBill.metadata.referenceDate === input.afterMonthlyBill.metadata.referenceDate
      ? input.beforeMonthlyBill.metadata.referenceDate
      : undefined;

  return verifiedResult(
    { monthlySavingsWon, annualSavingsWon },
    {
      ...baseMetadata,
      referenceDate,
      limitations: [
        ...baseMetadata.limitations,
        "같은 요금제와 비교 조건에서 계산한 설치 전·후 월 전기요금의 차이입니다.",
      ],
    },
  );
}
