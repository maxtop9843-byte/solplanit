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

type CalculationMetadataEntry = CalculationInput | CalculationAssumption;

const INVALID_PROVENANCE_LIMITATION = "결과의 출처·기준일 또는 계산 시각이 올바르지 않습니다.";
const INVALID_METADATA_LIMITATION = "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.";
const INVALID_VALUE_LIMITATION = "결과에 계산할 수 없는 숫자가 포함되어 있습니다.";

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

export function isValidIsoTimestamp(value: string): boolean {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!match) return false;

  const [, date, hourText, minuteText, secondText, zone, offsetHourText, offsetMinuteText] = match;
  if (!isCanonicalIsoDate(date)) return false;

  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  if (hour > 23 || minute > 59 || second > 59) return false;

  if (zone !== "Z") {
    const offsetHour = Number(offsetHourText);
    const offsetMinute = Number(offsetMinuteText);
    if (offsetHour > 23 || offsetMinute > 59) return false;
  }

  return Number.isFinite(Date.parse(value));
}

function isValidMetadataText(value: string | undefined): boolean {
  return value === undefined || value.trim().length > 0;
}

export function isValidCalculationMetadataEntry(entry: CalculationMetadataEntry): boolean {
  if (entry.key.trim().length === 0) return false;
  if (typeof entry.value === "number" && !Number.isFinite(entry.value)) return false;
  if (typeof entry.value === "string" && entry.value.trim().length === 0) return false;
  if (!isValidMetadataText(entry.unit) || !isValidMetadataText(entry.description)) return false;

  return true;
}

export function hasInvalidCalculationProvenance(metadata: ResultMetadataWithoutStatus): boolean {
  return (
    metadata.sources.some((source) => !isValidCalculationSource(source)) ||
    (metadata.referenceDate !== undefined && !isCanonicalIsoDate(metadata.referenceDate)) ||
    (metadata.calculatedAt !== undefined && !isValidIsoTimestamp(metadata.calculatedAt))
  );
}

export function hasInvalidCalculationMetadata(metadata: ResultMetadataWithoutStatus): boolean {
  return (
    metadata.inputs?.some((input) => !isValidCalculationMetadataEntry(input)) === true ||
    metadata.assumptions.some((assumption) => !isValidCalculationMetadataEntry(assumption)) ||
    metadata.limitations.some((limitation) => limitation.trim().length === 0)
  );
}

export function hasInvalidNumericResultValue(value: unknown): boolean {
  if (typeof value === "number") return !Number.isFinite(value);
  if (Array.isArray(value)) return value.some((item) => hasInvalidNumericResultValue(item));
  if (value !== null && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((item) => hasInvalidNumericResultValue(item));
  }

  return false;
}

function resultWithValue<T>(
  value: T,
  status: Extract<CalculationResultStatus, "verified" | "estimated">,
  metadata: ResultMetadataWithoutStatus,
): CalculationResult<T> {
  const invalidProvenance = hasInvalidCalculationProvenance(metadata);
  const invalidMetadata = hasInvalidCalculationMetadata(metadata);
  const invalidValue = hasInvalidNumericResultValue(value);

  if (invalidProvenance || invalidMetadata || invalidValue) {
    return {
      value: null,
      metadata: {
        ...metadata,
        status: "error",
        limitations: [
          ...metadata.limitations,
          ...(invalidProvenance ? [INVALID_PROVENANCE_LIMITATION] : []),
          ...(invalidMetadata ? [INVALID_METADATA_LIMITATION] : []),
          ...(invalidValue ? [INVALID_VALUE_LIMITATION] : []),
        ],
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
