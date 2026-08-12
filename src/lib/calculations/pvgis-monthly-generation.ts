import {
  PVGIS_VERIFIED_AT,
  PVGIS_VERSION,
  validatePvgisRequest,
  type PvgisProxyResult,
} from "../pvgis";
import {
  errorResult,
  unavailableResult,
  verifiedResult,
  type CalculationResult,
} from "./result";

export type PvgisMonthlyGenerationValue = {
  month: number;
  generationKwh: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function baseMetadata(result: PvgisProxyResult, month: number) {
  return {
    inputs: [
      { key: "latitude", value: result.request.latitude, unit: "°", description: "지역 중심 기준 위도" },
      { key: "longitude", value: result.request.longitude, unit: "°", description: "지역 중심 기준 경도" },
      { key: "peakPowerKw", value: result.request.peakPowerKw, unit: "kW", description: "설치 용량" },
      { key: "month", value: month, description: "비교 월" },
    ],
    sources: [{ label: `JRC PVGIS ${result.version}`, url: "https://re.jrc.ec.europa.eu/pvg_tools/en/" }],
    referenceDate: result.verifiedAt,
    calculatedAt: result.retrievedAt,
    assumptions: [
      { key: "systemLossPercent", value: result.request.systemLossPercent, unit: "%", description: "PVGIS 계산에 적용한 시스템 손실률" },
      { key: "angleMode", value: "PVGIS 최적 경사·방위 자동 계산", description: "간단 계산에서는 경사와 방위를 직접 묻지 않고 PVGIS 최적 각도 계산을 사용함" },
    ],
    limitations: ["지역 중심 좌표 기준 예상치이며 실제 주소, 음영, 지붕 방향과 설비 상태에 따라 달라질 수 있습니다."],
  };
}

export function createPvgisMonthlyGenerationResult(
  result: PvgisProxyResult,
  month: number,
): CalculationResult<PvgisMonthlyGenerationValue> {
  const metadata = baseMetadata(result, month);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return errorResult({ ...metadata, limitations: [...metadata.limitations, "비교 월이 올바르지 않습니다."] });
  }

  if (
    result.source !== "PVGIS" ||
    result.version !== PVGIS_VERSION ||
    result.verifiedAt !== PVGIS_VERIFIED_AT ||
    !Number.isFinite(Date.parse(result.retrievedAt))
  ) {
    return errorResult({ ...metadata, limitations: [...metadata.limitations, "PVGIS 결과의 출처·버전 또는 기준일을 확인할 수 없습니다."] });
  }

  try {
    validatePvgisRequest(result.request);
  } catch {
    return errorResult({ ...metadata, limitations: [...metadata.limitations, "PVGIS 요청 조건이 올바르지 않습니다."] });
  }

  const outputs = asRecord(asRecord(result.data)?.outputs);
  const monthly = asRecord(outputs?.monthly);
  const fixed = monthly?.fixed;
  if (!Array.isArray(fixed)) {
    return unavailableResult({ ...metadata, limitations: [...metadata.limitations, "PVGIS 응답에 월별 발전량 데이터가 없습니다."] });
  }

  const row = fixed.find((item) => asRecord(item)?.month === month);
  const generationKwh = asRecord(row)?.E_m;
  if (generationKwh === undefined || generationKwh === null) {
    return unavailableResult({ ...metadata, limitations: [...metadata.limitations, "선택한 달의 발전량 데이터가 없습니다."] });
  }
  if (typeof generationKwh !== "number" || !Number.isFinite(generationKwh) || generationKwh < 0) {
    return errorResult({ ...metadata, limitations: [...metadata.limitations, "선택한 달의 발전량 값이 올바르지 않습니다."] });
  }

  return verifiedResult({ month, generationKwh }, metadata);
}
