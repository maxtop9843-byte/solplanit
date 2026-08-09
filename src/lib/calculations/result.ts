export const CALCULATION_RESULT_STATUSES = ["verified", "estimated", "unavailable", "error"] as const;
export type CalculationResultStatus = (typeof CALCULATION_RESULT_STATUSES)[number];

export type CalculationSource = {
  label: string;
  url: string;
};

export type CalculationAssumption = {
  key: string;
  value: string | number;
  unit?: string;
  description?: string;
};

export type CalculationResultMetadata = {
  status: CalculationResultStatus;
  sources: readonly CalculationSource[];
  referenceDate?: string;
  calculatedAt?: string;
  assumptions: readonly CalculationAssumption[];
  limitations: readonly string[];
};

export type CalculationResult<T> = {
  value: T | null;
  metadata: CalculationResultMetadata;
};

export function unavailableResult<T>(
  metadata: Omit<CalculationResultMetadata, "status">,
): CalculationResult<T> {
  return {
    value: null,
    metadata: { ...metadata, status: "unavailable" },
  };
}

export function errorResult<T>(
  metadata: Omit<CalculationResultMetadata, "status">,
): CalculationResult<T> {
  return {
    value: null,
    metadata: { ...metadata, status: "error" },
  };
}
