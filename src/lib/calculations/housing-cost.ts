import {
  errorResult,
  unavailableResult,
  verifiedResult,
  type CalculationResult,
  type CalculationSource,
} from "./result";

export type WonAmount = {
  amountWon: number;
};

export type OfficialWonValue = {
  amountWon: number;
  source: CalculationSource;
  referenceDate: string;
};

export type HousingCostInput = {
  installationCost?: OfficialWonValue;
  subsidy?: OfficialWonValue;
  calculatedAt?: string;
};

export type HousingCostResults = {
  installationCost: CalculationResult<WonAmount>;
  subsidy: CalculationResult<WonAmount>;
  outOfPocket: CalculationResult<WonAmount>;
};

function officialWonResult(
  value: OfficialWonValue | undefined,
  label: string,
  calculatedAt?: string,
): CalculationResult<WonAmount> {
  if (value === undefined) {
    return unavailableResult({
      sources: [],
      calculatedAt,
      assumptions: [],
      limitations: [`${label}의 공식 확인 자료가 아직 없습니다.`],
    });
  }

  const metadata = {
    sources: [value.source],
    referenceDate: value.referenceDate,
    calculatedAt,
    assumptions: [],
    limitations: [] as string[],
  };

  if (!Number.isFinite(value.amountWon) || value.amountWon < 0) {
    return errorResult({
      ...metadata,
      limitations: [`${label} 금액이 올바르지 않습니다.`],
    });
  }

  return verifiedResult({ amountWon: value.amountWon }, metadata);
}

/**
 * 공식 설치비와 지원액을 서로 독립된 결과 상태로 만든다.
 * 확인되지 않은 지원액을 0원으로 대체하지 않으며, 두 값이 모두 확인된 경우에만
 * 내가 부담할 금액을 계산한다.
 */
export function createHousingCostResults(input: HousingCostInput): HousingCostResults {
  const installationCost = officialWonResult(
    input.installationCost,
    "설치비",
    input.calculatedAt,
  );
  const subsidy = officialWonResult(input.subsidy, "지원액", input.calculatedAt);

  if (installationCost.value === null || subsidy.value === null) {
    return {
      installationCost,
      subsidy,
      outOfPocket: unavailableResult({
        sources: [
          ...installationCost.metadata.sources,
          ...subsidy.metadata.sources,
        ],
        calculatedAt: input.calculatedAt,
        assumptions: [],
        limitations: [
          "설치비와 지원액이 모두 확인되어야 내가 부담할 금액을 계산할 수 있습니다.",
        ],
      }),
    };
  }

  const outOfPocketWon =
    installationCost.value.amountWon - subsidy.value.amountWon;

  if (outOfPocketWon < 0) {
    return {
      installationCost,
      subsidy,
      outOfPocket: errorResult({
        sources: [
          ...installationCost.metadata.sources,
          ...subsidy.metadata.sources,
        ],
        calculatedAt: input.calculatedAt,
        assumptions: [],
        limitations: [
          "확인된 지원액이 설치비보다 커서 내가 부담할 금액을 계산하지 않았습니다.",
        ],
      }),
    };
  }

  return {
    installationCost,
    subsidy,
    outOfPocket: verifiedResult(
      { amountWon: outOfPocketWon },
      {
        sources: [
          ...installationCost.metadata.sources,
          ...subsidy.metadata.sources,
        ],
        referenceDate:
          installationCost.metadata.referenceDate === subsidy.metadata.referenceDate
            ? installationCost.metadata.referenceDate
            : undefined,
        calculatedAt: input.calculatedAt,
        assumptions: [],
        limitations: [],
      },
    ),
  };
}
