import {
  PVGIS_SOURCE_URL,
  PVGIS_VERIFIED_AT,
  PVGIS_VERSION,
  type PvgisProxyResult,
} from "../pvgis";
import {
  errorResult,
  unavailableResult,
  verifiedResult,
  type CalculationResult,
  type CalculationResultMetadata,
} from "./result";

export type GenerationResult = {
  annualGenerationKwh: number;
};

type JsonObject = Record<string, unknown>;

type AnnualGenerationReading =
  | { kind: "value"; value: number }
  | { kind: "missing" }
  | { kind: "invalid" };

function asObject(value: unknown): JsonObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function readAnnualGenerationKwh(data: unknown): AnnualGenerationReading {
  const outputs = asObject(asObject(data)?.outputs);
  const totals = asObject(outputs?.totals);
  const fixed = asObject(totals?.fixed);
  const annualGenerationKwh = fixed?.E_y;

  if (annualGenerationKwh === undefined || annualGenerationKwh === null) {
    return { kind: "missing" };
  }

  if (
    typeof annualGenerationKwh !== "number" ||
    !Number.isFinite(annualGenerationKwh) ||
    annualGenerationKwh < 0
  ) {
    return { kind: "invalid" };
  }

  return { kind: "value", value: annualGenerationKwh };
}

function isIsoTimestamp(value: string): boolean {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function hasInvalidPvgisProvenance(result: PvgisProxyResult): boolean {
  return (
    result.source !== "PVGIS" ||
    result.version !== PVGIS_VERSION ||
    result.verifiedAt !== PVGIS_VERIFIED_AT ||
    !isIsoTimestamp(result.retrievedAt)
  );
}

function generationMetadata(
  result: PvgisProxyResult,
): Omit<CalculationResultMetadata, "status"> {
  const request = result.request;
  const usesOptimalAngles =
    request.tiltDegrees === undefined && request.azimuthDegrees === undefined;
  const usesOptimalInclination =
    request.tiltDegrees === undefined && request.azimuthDegrees !== undefined;
  const usesDefaultAzimuth =
    request.tiltDegrees !== undefined && request.azimuthDegrees === undefined;

  return {
    inputs: [
      {
        key: "latitude",
        value: request.latitude,
        unit: "°",
        description: "PVGIS 계산에 사용한 위도",
      },
      {
        key: "longitude",
        value: request.longitude,
        unit: "°",
        description: "PVGIS 계산에 사용한 경도",
      },
      {
        key: "peakPowerKw",
        value: request.peakPowerKw,
        unit: "kW",
        description: "PVGIS 계산에 사용한 설치 용량",
      },
    ],
    sources: [
      {
        label: `JRC PVGIS ${result.version}`,
        url: PVGIS_SOURCE_URL,
      },
    ],
    referenceDate: result.verifiedAt,
    calculatedAt: result.retrievedAt,
    assumptions: [
      {
        key: "systemLossPercent",
        value: request.systemLossPercent,
        unit: "%",
        description: "PVGIS 계산에 적용한 시스템 손실률",
      },
      {
        key: "useHorizon",
        value: request.useHorizon === false ? "사용 안 함" : "사용",
        description: "PVGIS 지평선 음영 반영 여부",
      },
      {
        key: "radiationDatabase",
        value: request.radiationDatabase ?? "PVGIS-SARAH3",
        description: "PVGIS 계산에 사용한 복사 데이터베이스",
      },
      ...(request.tiltDegrees === undefined
        ? []
        : [
            {
              key: "tiltDegrees",
              value: request.tiltDegrees,
              unit: "°",
              description: "PVGIS 계산에 사용한 경사각",
            },
          ]),
      ...(request.azimuthDegrees === undefined
        ? []
        : [
            {
              key: "azimuthDegrees",
              value: request.azimuthDegrees,
              unit: "°",
              description: "PVGIS 계산에 사용한 방위각",
            },
          ]),
      ...(usesDefaultAzimuth
        ? [
            {
              key: "azimuthDegrees",
              value: 0,
              unit: "°",
              description: "방위를 입력하지 않아 적용된 PVGIS 기본 방위각(남향)",
            },
          ]
        : []),
      ...(usesOptimalAngles
        ? [
            {
              key: "angleMode",
              value: "PVGIS 최적 경사·방위 자동 계산",
              description: "경사와 방위를 입력하지 않아 PVGIS 최적 각도 계산을 사용함",
            },
          ]
        : []),
      ...(usesOptimalInclination
        ? [
            {
              key: "tiltMode",
              value: "PVGIS 최적 경사 자동 계산",
              description: "경사를 입력하지 않아 PVGIS 최적 경사 계산을 사용함",
            },
          ]
        : []),
      {
        key: "mountingPosition",
        value: request.mountingPosition ?? "free",
        description: request.mountingPosition === undefined
          ? "설치 방식을 입력하지 않아 적용된 PVGIS 기본 설치 방식"
          : "PVGIS 계산에 사용한 설치 방식",
      },
      {
        key: "moduleTechnology",
        value: request.moduleTechnology ?? "crystSi",
        description: request.moduleTechnology === undefined
          ? "모듈 기술을 입력하지 않아 적용된 PVGIS 기본 모듈 기술"
          : "PVGIS 계산에 사용한 모듈 기술",
      },
    ],
    limitations: [
      "PVGIS의 위치·기상 데이터 기반 발전량이며 실제 음영, 오염, 설비 상태와 현장 조건에 따라 달라질 수 있습니다.",
    ],
  };
}

/**
 * PVGIS 5.3 응답을 주택용 위치 기반 발전량 결과 계약으로 변환한다.
 * 평균 일 발전시간 같은 legacy 사용자 가정으로 조용히 대체하지 않는다.
 */
export function createPvgisGenerationResult(
  result: PvgisProxyResult,
): CalculationResult<GenerationResult> {
  const metadata = generationMetadata(result);

  if (hasInvalidPvgisProvenance(result)) {
    return errorResult({
      ...metadata,
      limitations: [
        ...metadata.limitations,
        "PVGIS 결과의 출처·버전·기준일 또는 조회 시각이 올바르지 않습니다.",
      ],
    });
  }

  const annualGeneration = readAnnualGenerationKwh(result.data);

  if (annualGeneration.kind === "missing") {
    return unavailableResult({
      ...metadata,
      limitations: [
        ...metadata.limitations,
        "PVGIS 응답에 연간 발전량 데이터가 없습니다.",
      ],
    });
  }

  if (annualGeneration.kind === "invalid") {
    return errorResult({
      ...metadata,
      limitations: [
        ...metadata.limitations,
        "PVGIS 응답의 연간 발전량 값이 올바르지 않습니다.",
      ],
    });
  }

  return verifiedResult(
    { annualGenerationKwh: annualGeneration.value },
    metadata,
  );
}
