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

type ResultMetadataWithoutStatus = Omit<CalculationResultMetadata, "status">;

function resultWithValue<T>(
  value: T,
  status: Extract<CalculationResultStatus, "verified" | "estimated">,
  metadata: ResultMetadataWithoutStatus,
): CalculationResult<T> {
  return {
    value,
    metadata: { ...metadata, status },
  };
}

export function verifiedResult<T>(value: T, metadata: ResultMetadataWithoutStatus): CalculationResult<T> {
  return resultWithValue(value, "verified", metadata);
}

export function estimatedResult<T>(value: T, metadata: ResultMetadataWithoutStatus): CalculationResult<T> {
  return resultWithValue(value, "estimated", metadata);
}

export function unavailableResult<T>(metadata: ResultMetadataWithoutStatus): CalculationResult<T> {
  return {
    value: null,
    metadata: { ...metadata, status: "unavailable" },
  };
}

export function errorResult<T>(metadata: ResultMetadataWithoutStatus): CalculationResult<T> {
  return {
    value: null,
    metadata: { ...metadata, status: "error" },
  };
}
