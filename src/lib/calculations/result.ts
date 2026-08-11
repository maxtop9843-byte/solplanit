export const CALCULATION_RESULT_STATUSES = ["verified", "estimated", "unavailable", "error"] as const;
export type CalculationResultStatus = (typeof CALCULATION_RESULT_STATUSES)[number];

export type CalculationSource = {
  label: string;
  url: string;
};

export type CalculationInput = {
  key: string;
  value: string | number;
  unit?: string;
  description?: string;
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
  inputs?: readonly CalculationInput[];
  assumptions: readonly CalculationAssumption[];
  limitations: readonly string[];
};

export type CalculationResult<T> = {
  value: T | null;
  metadata: CalculationResultMetadata;
};

type ResultMetadataWithoutStatus = Omit<CalculationResultMetadata, "status">;

const INVALID_PROVENANCE_LIMITATION = "결과의 출처·기준일 또는 계산 시각이 올바르지 않습니다.";

export function isValidCalculationSource(source: CalculationSource): boolean {
  if (source.label.trim().length === 0) return false;

  try {
    const url = new URL(source.url);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isCanonicalIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isCanonicalIsoTimestamp(value: string): boolean {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

export function hasInvalidCalculationProvenance(metadata: ResultMetadataWithoutStatus): boolean {
  return (
    metadata.sources.some((source) => !isValidCalculationSource(source)) ||
    (metadata.referenceDate !== undefined && !isCanonicalIsoDate(metadata.referenceDate)) ||
    (metadata.calculatedAt !== undefined && !isCanonicalIsoTimestamp(metadata.calculatedAt))
  );
}

function resultWithValue<T>(
  value: T,
  status: Extract<CalculationResultStatus, "verified" | "estimated">,
  metadata: ResultMetadataWithoutStatus,
): CalculationResult<T> {
  if (hasInvalidCalculationProvenance(metadata)) {
    return {
      value: null,
      metadata: {
        ...metadata,
        status: "error",
        limitations: [...metadata.limitations, INVALID_PROVENANCE_LIMITATION],
      },
    };
  }

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
