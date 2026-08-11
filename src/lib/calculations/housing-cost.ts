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

export type OfficialWonValue = {
  amountWon: number;
  source: CalculationSource;
  referenceDate: string;
  inputs?: readonly CalculationInput[];
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

function uniqueInputs(inputs: readonly CalculationInput[]): CalculationInput[] {
  const seen = new Set<string>();

  return inputs.filter((input) => {
    const key = JSON.stringify([input.key, input.value, input.unit, input.description]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sharedReferenceDate(
  installationCost: CalculationResult<WonAmount>,
  subsidy: CalculationResult<WonAmount>,
): string | undefined {
  const installationDate = installationCost.metadata.referenceDate;
  const subsidyDate = subsidy.metadata.referenceDate;

  return installationDate !== undefined && installationDate === subsidyDate
    ? installationDate
    : undefined;
}

function hasInvalidOfficialMetadata(value: OfficialWonValue): boolean {
  return (
    value.source.label.trim().length === 0 ||
    value.source.url.trim().length === 0 ||
    value.referenceDate.trim().length === 0
  );
}

function officialWonResult(
  value: OfficialWonValue | undefined,
  label: string,
  calculatedAt?: string,
): CalculationResult<WonAmount> {
  if (value === undefined) {
    return unavailableResult({
      sources: [],
      calculatedAt,
      inputs: [],
      assumptions: [],
      limitations: [`${label}의 공식 확인 자료가 아직 없습니다.`],
    });
  }

  const metadata = {
    sources: [value.source],
    referenceDate: value.referenceDate,
    calculatedAt,
    inputs: value.inputs ?? [],
    assumptions: [],
    limitations: [] as string[],
  };

  if (hasInvalidOfficialMetadata(value)) {
    return errorResult({
      ...metadata,
      limitations: [`${label}의 출처 또는 기준일이 올바르지 않습니다.`],
    });
  }

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
 *
 * 공식 값에 연결된 지역·설치 용량 같은 사용자 입력 메타데이터와 상위 결과의 한계를
 * 보존해 이후 회수기간 계산까지 계산 근거가 끊기지 않도록 한다.
 */
export function createHousingCostResults(input: HousingCostInput): HousingCostResults {
  const installationCost = officialWonResult(
    input.installationCost,
    "설치비",
    input.calculatedAt,
  );
  const subsidy = officialWonResult(input.subsidy, "지원액", input.calculatedAt);
  const inputs = uniqueInputs([
    ...(installationCost.metadata.inputs ?? []),
    ...(subsidy.metadata.inputs ?? []),
  ]);
  const limitations = [
    ...installationCost.metadata.limitations,
    ...subsidy.metadata.limitations,
  ];
  const referenceDate = sharedReferenceDate(installationCost, subsidy);
  const combinedMetadata = {
    sources: [
      ...installationCost.metadata.sources,
      ...subsidy.metadata.sources,
    ],
    referenceDate,
    calculatedAt: input.calculatedAt,
    inputs,
    assumptions: [],
    limitations,
  };

  if (
    installationCost.metadata.status === "error" ||
    subsidy.metadata.status === "error"
  ) {
    return {
      installationCost,
      subsidy,
      outOfPocket: errorResult({
        ...combinedMetadata,
        limitations: [
          ...limitations,
          "설치비 또는 지원액에 오류가 있어 내가 부담할 금액을 계산하지 않았습니다.",
        ],
      }),
    };
  }

  if (installationCost.value === null || subsidy.value === null) {
    return {
      installationCost,
      subsidy,
      outOfPocket: unavailableResult({
        ...combinedMetadata,
        limitations: [
          ...limitations,
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
        ...combinedMetadata,
        limitations: [
          ...limitations,
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
      combinedMetadata,
    ),
  };
}
