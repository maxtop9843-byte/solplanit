import {
  PVGIS_SOURCE_URL,
  type PvgisProxyResult,
} from "../pvgis";
import {
  errorResult,
  verifiedResult,
  type CalculationResult,
  type CalculationResultMetadata,
} from "./result";

export type GenerationResult = {
  annualGenerationKwh: number;
};

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function readAnnualGenerationKwh(data: unknown): number | null {
  const outputs = asObject(asObject(data)?.outputs);
  const totals = asObject(outputs?.totals);
  const fixed = asObject(totals?.fixed);
  const annualGenerationKwh = fixed?.E_y;

  if (
    typeof annualGenerationKwh !== "number" ||
    !Number.isFinite(annualGenerationKwh) ||
    annualGenerationKwh < 0
  ) {
    return null;
  }

  return annualGenerationKwh;
}

function generationMetadata(
  result: PvgisProxyResult,
): Omit<CalculationResultMetadata, "status"> {
  const request = result.request;

  return {
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
        key: "peakPowerKw",
        value: request.peakPowerKw,
        unit: "kW",
        description: "PVGIS 계산에 사용한 설치 용량",
      },
      {
        key: "systemLossPercent",
        value: request.systemLossPercent,
        unit: "%",
        description: "PVGIS 계산에 적용한 시스템 손실률",
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
  const annualGenerationKwh = readAnnualGenerationKwh(result.data);

  if (annualGenerationKwh === null) {
    return errorResult({
      ...metadata,
      limitations: [
        ...metadata.limitations,
        "PVGIS 응답에서 연간 발전량을 확인하지 못했습니다.",
      ],
    });
  }

  return verifiedResult(
    { annualGenerationKwh },
    metadata,
  );
}
