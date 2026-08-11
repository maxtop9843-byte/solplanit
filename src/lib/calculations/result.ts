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

type SanitizedMetadata = {
  metadata: ResultMetadataWithoutStatus;
  removedInvalidShape: boolean;
};

const INVALID_PROVENANCE_LIMITATION = "결과의 출처·기준일 또는 계산 시각이 올바르지 않습니다.";
const INVALID_METADATA_LIMITATION = "결과의 입력·가정 또는 한계 정보가 올바르지 않습니다.";
const INVALID_VALUE_LIMITATION = "결과에 계산할 수 없는 숫자가 포함되어 있습니다.";
const INVALID_VALUE_SHAPE_LIMITATION = "결과 값의 형식이 올바르지 않습니다.";
const SANITIZED_METADATA_LIMITATION = "결과 메타데이터 일부의 형식이 올바르지 않아 제외했습니다.";

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

export function hasInvalidNumericResultValue(value: unknown, stack = new WeakSet<object>()): boolean {
  if (typeof value === "number") return !Number.isFinite(value);
  if (value === null || typeof value !== "object") return false;
  if (stack.has(value)) return false;

  stack.add(value);
  const invalid = Array.isArray(value)
    ? value.some((item) => hasInvalidNumericResultValue(item, stack))
    : Object.values(value as Record<string, unknown>).some((item) => hasInvalidNumericResultValue(item, stack));
  stack.delete(value);

  return invalid;
}

export function hasInvalidCalculationResultValue(value: unknown, stack = new WeakSet<object>()): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return false;
  if (typeof value === "number") return !Number.isFinite(value);
  if (typeof value !== "object") return true;
  if (stack.has(value)) return true;
  if (Object.getOwnPropertySymbols(value).length > 0) return true;

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) return true;
    }
  } else {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return true;
  }

  stack.add(value);
  const invalid = Array.isArray(value)
    ? value.some((item) => hasInvalidCalculationResultValue(item, stack))
    : Object.values(value as Record<string, unknown>).some((item) => hasInvalidCalculationResultValue(item, stack));
  stack.delete(value);

  return invalid;
}

function hasSerializableMetadataEntryShape(entry: unknown): entry is CalculationMetadataEntry {
  if (entry === null || typeof entry !== "object" || Array.isArray(entry)) return false;

  const candidate = entry as Record<string, unknown>;
  if (typeof candidate.key !== "string") return false;
  if (typeof candidate.value !== "string" && typeof candidate.value !== "number") return false;
  if (candidate.unit !== undefined && typeof candidate.unit !== "string") return false;
  if (candidate.description !== undefined && typeof candidate.description !== "string") return false;

  return true;
}

function hasSerializableSourceShape(source: unknown): source is CalculationSource {
  if (source === null || typeof source !== "object" || Array.isArray(source)) return false;

  const candidate = source as Record<string, unknown>;
  return typeof candidate.label === "string" && typeof candidate.url === "string";
}

function sanitizeResultMetadata(metadata: unknown): SanitizedMetadata {
  const candidate = metadata !== null && typeof metadata === "object" && !Array.isArray(metadata)
    ? metadata as Record<string, unknown>
    : {};
  const hasInputs = Object.prototype.hasOwnProperty.call(candidate, "inputs");

  const rawSources = Array.isArray(candidate.sources) ? candidate.sources : [];
  const rawInputs = Array.isArray(candidate.inputs) ? candidate.inputs : undefined;
  const rawAssumptions = Array.isArray(candidate.assumptions) ? candidate.assumptions : [];
  const rawLimitations = Array.isArray(candidate.limitations) ? candidate.limitations : [];

  const sources = rawSources.filter(hasSerializableSourceShape);
  const inputs = rawInputs?.filter(hasSerializableMetadataEntryShape);
  const assumptions = rawAssumptions.filter(hasSerializableMetadataEntryShape);
  const limitations = rawLimitations.filter((limitation): limitation is string => typeof limitation === "string");
  const referenceDate = candidate.referenceDate === undefined || typeof candidate.referenceDate === "string"
    ? candidate.referenceDate as string | undefined
    : undefined;
  const calculatedAt = candidate.calculatedAt === undefined || typeof candidate.calculatedAt === "string"
    ? candidate.calculatedAt as string | undefined
    : undefined;

  const removedInvalidShape =
    candidate !== metadata ||
    !Array.isArray(candidate.sources) ||
    (hasInputs && !Array.isArray(candidate.inputs)) ||
    !Array.isArray(candidate.assumptions) ||
    !Array.isArray(candidate.limitations) ||
    sources.length !== rawSources.length ||
    inputs?.length !== rawInputs?.length ||
    assumptions.length !== rawAssumptions.length ||
    limitations.length !== rawLimitations.length ||
    referenceDate !== candidate.referenceDate ||
    calculatedAt !== candidate.calculatedAt;

  return {
    metadata: {
      sources,
      ...(referenceDate !== undefined ? { referenceDate } : {}),
      ...(calculatedAt !== undefined ? { calculatedAt } : {}),
      ...(hasInputs ? { inputs: inputs ?? [] } : {}),
      assumptions,
      limitations: removedInvalidShape
        ? [...limitations, SANITIZED_METADATA_LIMITATION]
        : limitations,
    },
    removedInvalidShape,
  };
}

function resultWithValue<T>(
  value: T,
  status: Extract<CalculationResultStatus, "verified" | "estimated">,
  metadata: ResultMetadataWithoutStatus,
): CalculationResult<T> {
  const sanitized = sanitizeResultMetadata(metadata);
  const safeMetadata = sanitized.metadata;
  const invalidProvenance = hasInvalidCalculationProvenance(safeMetadata);
  const invalidMetadata = sanitized.removedInvalidShape || hasInvalidCalculationMetadata(safeMetadata);
  const invalidNumericValue = hasInvalidNumericResultValue(value);
  const invalidValueShape = !invalidNumericValue && hasInvalidCalculationResultValue(value);

  if (invalidProvenance || invalidMetadata || invalidNumericValue || invalidValueShape) {
    return {
      value: null,
      metadata: {
        ...safeMetadata,
        status: "error",
        limitations: [
          ...safeMetadata.limitations,
          ...(invalidProvenance ? [INVALID_PROVENANCE_LIMITATION] : []),
          ...(invalidMetadata ? [INVALID_METADATA_LIMITATION] : []),
          ...(invalidNumericValue ? [INVALID_VALUE_LIMITATION] : []),
          ...(invalidValueShape ? [INVALID_VALUE_SHAPE_LIMITATION] : []),
        ],
      },
    };
  }

  return {
    value,
    metadata: { ...safeMetadata, status },
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
    metadata: { ...sanitizeResultMetadata(metadata).metadata, status: "unavailable" },
  };
}

export function errorResult<T>(metadata: ResultMetadataWithoutStatus): CalculationResult<T> {
  return {
    value: null,
    metadata: { ...sanitizeResultMetadata(metadata).metadata, status: "error" },
  };
}
