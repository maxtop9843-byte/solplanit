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

export type PaybackValue = {
  years: number;
};

export type PaybackInput = {
  outOfPocket: CalculationResult<WonAmount>;
  annualSavings: CalculationResult<WonAmount>;
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

const roundYears = (value: number) => Math.round((value + Number.EPSILON) * 10) / 10;

/**
 * 주택용 단순 회수기간 계산 경계.
 *
 * CALCULATION_SPEC 계약에 따라 확인된 실부담액과 검증된 연간 절감액이
 * 모두 있을 때만 회수기간을 계산한다. estimated 값이나 정보 없음 상태를
 * 확정적인 회수기간으로 바꾸지 않는다.
 *
 * 이전 계산 단계의 입력·출처·가정·한계 메타데이터를 그대로 이어 받아
 * 회수기간 결과에서 계산 근거가 끊기지 않도록 한다.
 */
export function calculateVerifiedPayback(input: PaybackInput): CalculationResult<PaybackValue> {
  const sources = uniqueSources([
    ...input.outOfPocket.metadata.sources,
    ...input.annualSavings.metadata.sources,
  ]);
  const inputs = uniqueInputs([
    ...(input.outOfPocket.metadata.inputs ?? []),
    ...(input.annualSavings.metadata.inputs ?? []),
  ]);
  const baseMetadata = {
    sources,
    calculatedAt: input.calculatedAt,
    inputs,
    assumptions: [
      ...input.outOfPocket.metadata.assumptions,
      ...input.annualSavings.metadata.assumptions,
    ],
    limitations: [
      ...input.outOfPocket.metadata.limitations,
      ...input.annualSavings.metadata.limitations,
    ],
  };

  if (
    input.outOfPocket.metadata.status !== "verified" ||
    input.annualSavings.metadata.status !== "verified" ||
    input.outOfPocket.value === null ||
    input.annualSavings.value === null
  ) {
    return unavailableResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "확인된 실부담액과 검증된 연간 절감액이 모두 있어야 회수기간을 계산할 수 있습니다.",
      ],
    });
  }

  const outOfPocketWon = input.outOfPocket.value.amountWon;
  const annualSavingsWon = input.annualSavings.value.amountWon;

  if (
    !Number.isFinite(outOfPocketWon) ||
    !Number.isFinite(annualSavingsWon) ||
    outOfPocketWon < 0 ||
    annualSavingsWon < 0
  ) {
    return errorResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "실부담액 또는 연간 절감액이 올바르지 않아 회수기간을 계산하지 않았습니다.",
      ],
    });
  }

  if (annualSavingsWon === 0) {
    return unavailableResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "연간 절감액이 0원이어서 유한한 회수기간을 계산할 수 없습니다.",
      ],
    });
  }

  const years = roundYears(outOfPocketWon / annualSavingsWon);
  const referenceDate =
    input.outOfPocket.metadata.referenceDate === input.annualSavings.metadata.referenceDate
      ? input.outOfPocket.metadata.referenceDate
      : undefined;

  return verifiedResult(
    { years },
    {
      ...baseMetadata,
      referenceDate,
      limitations: [
        ...baseMetadata.limitations,
        "금융비용, 유지관리비, 성능 저하는 반영하지 않은 단순 회수기간입니다.",
      ],
    },
  );
}
