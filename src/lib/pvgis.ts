export const PVGIS_VERSION = "5.3";
export const PVGIS_SOURCE_URL = "https://re.jrc.ec.europa.eu/api/v5_3/PVcalc";
export const PVGIS_VERIFIED_AT = "2026-07-30";

const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 12_000;

export type PvgisRequest = {
  latitude: number;
  longitude: number;
  peakPowerKw: number;
  systemLossPercent: number;
  tiltDegrees?: number;
  azimuthDegrees?: number;
  mountingPosition?: "free" | "building";
  moduleTechnology?: "crystSi" | "CIS" | "CdTe" | "Unknown";
  useHorizon?: boolean;
  radiationDatabase?: "PVGIS-SARAH3" | "PVGIS-ERA5";
};

export type PvgisProxyResult = {
  source: "PVGIS";
  version: typeof PVGIS_VERSION;
  verifiedAt: typeof PVGIS_VERIFIED_AT;
  retrievedAt: string;
  request: PvgisRequest;
  data: unknown;
};

export class PvgisError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "PvgisError";
  }
}

function finiteNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new PvgisError(`${field} 값이 올바르지 않습니다.`, 400, "INVALID_INPUT");
  }
  return value;
}

export function validatePvgisRequest(input: unknown): PvgisRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new PvgisError("분석 입력 형식이 올바르지 않습니다.", 400, "INVALID_INPUT");
  }

  const value = input as Record<string, unknown>;
  const latitude = finiteNumber(value.latitude, "위도");
  const longitude = finiteNumber(value.longitude, "경도");
  const peakPowerKw = finiteNumber(value.peakPowerKw, "설치 용량");
  const systemLossPercent = finiteNumber(value.systemLossPercent, "시스템 손실");
  const tiltDegrees = value.tiltDegrees === undefined ? undefined : finiteNumber(value.tiltDegrees, "경사각");
  const azimuthDegrees = value.azimuthDegrees === undefined ? undefined : finiteNumber(value.azimuthDegrees, "방위각");

  if (latitude < -90 || latitude > 90) throw new PvgisError("위도는 -90도에서 90도 사이여야 합니다.", 400, "INVALID_LATITUDE");
  if (longitude < -180 || longitude > 180) throw new PvgisError("경도는 -180도에서 180도 사이여야 합니다.", 400, "INVALID_LONGITUDE");
  if (peakPowerKw <= 0 || peakPowerKw > 100_000) throw new PvgisError("설치 용량은 0보다 크고 100,000kW 이하여야 합니다.", 400, "INVALID_PEAK_POWER");
  if (systemLossPercent < 0 || systemLossPercent > 100) throw new PvgisError("시스템 손실은 0%에서 100% 사이여야 합니다.", 400, "INVALID_LOSS");
  if (tiltDegrees !== undefined && (tiltDegrees < 0 || tiltDegrees > 90)) throw new PvgisError("경사각은 0도에서 90도 사이여야 합니다.", 400, "INVALID_TILT");
  if (azimuthDegrees !== undefined && (azimuthDegrees < -180 || azimuthDegrees > 180)) throw new PvgisError("방위각은 -180도에서 180도 사이여야 합니다.", 400, "INVALID_AZIMUTH");

  const mountingPosition = value.mountingPosition;
  if (mountingPosition !== undefined && mountingPosition !== "free" && mountingPosition !== "building") {
    throw new PvgisError("설치 방식이 올바르지 않습니다.", 400, "INVALID_MOUNTING");
  }

  const moduleTechnology = value.moduleTechnology;
  if (moduleTechnology !== undefined && moduleTechnology !== "crystSi" && moduleTechnology !== "CIS" && moduleTechnology !== "CdTe" && moduleTechnology !== "Unknown") {
    throw new PvgisError("모듈 기술 값이 올바르지 않습니다.", 400, "INVALID_MODULE_TECHNOLOGY");
  }

  const useHorizon = value.useHorizon;
  if (useHorizon !== undefined && typeof useHorizon !== "boolean") {
    throw new PvgisError("지평선 음영 사용 값이 올바르지 않습니다.", 400, "INVALID_HORIZON");
  }

  const radiationDatabase = value.radiationDatabase;
  if (radiationDatabase !== undefined && radiationDatabase !== "PVGIS-SARAH3" && radiationDatabase !== "PVGIS-ERA5") {
    throw new PvgisError("복사 데이터베이스 값이 올바르지 않습니다.", 400, "INVALID_RADIATION_DATABASE");
  }

  return {
    latitude,
    longitude,
    peakPowerKw,
    systemLossPercent,
    tiltDegrees,
    azimuthDegrees,
    mountingPosition,
    moduleTechnology,
    useHorizon,
    radiationDatabase,
  };
}

export function buildPvgisUrl(request: PvgisRequest): string {
  const params = new URLSearchParams({
    lat: String(request.latitude),
    lon: String(request.longitude),
    peakpower: String(request.peakPowerKw),
    loss: String(request.systemLossPercent),
    outputformat: "json",
    usehorizon: request.useHorizon === false ? "0" : "1",
    raddatabase: request.radiationDatabase ?? "PVGIS-SARAH3",
  });

  if (request.tiltDegrees === undefined && request.azimuthDegrees === undefined) {
    params.set("optimalangles", "1");
  } else {
    if (request.tiltDegrees === undefined) params.set("optimalinclination", "1");
    else params.set("angle", String(request.tiltDegrees));
    if (request.azimuthDegrees !== undefined) params.set("aspect", String(request.azimuthDegrees));
  }
  if (request.mountingPosition) params.set("mountingplace", request.mountingPosition);
  if (request.moduleTechnology) params.set("pvtechchoice", request.moduleTechnology);

  return `${PVGIS_SOURCE_URL}?${params.toString()}`;
}

function retryable(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function fetchPvgis(request: PvgisRequest, fetcher: typeof fetch = fetch): Promise<PvgisProxyResult> {
  const url = buildPvgisUrl(request);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetcher(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "force-cache",
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.ok) {
        return {
          source: "PVGIS",
          version: PVGIS_VERSION,
          verifiedAt: PVGIS_VERIFIED_AT,
          retrievedAt: new Date().toISOString(),
          request,
          data: await response.json(),
        };
      }

      if (!retryable(response.status) || attempt === MAX_RETRIES) {
        if (response.status === 429) throw new PvgisError("PVGIS 요청이 많아 잠시 후 다시 시도해 주세요.", 503, "PVGIS_RATE_LIMITED");
        throw new PvgisError("PVGIS 분석 서비스를 불러오지 못했습니다.", 502, "PVGIS_UPSTREAM_ERROR");
      }
    } catch (error) {
      if (error instanceof PvgisError) throw error;
      if (attempt === MAX_RETRIES) {
        const timedOut = error instanceof DOMException && error.name === "TimeoutError";
        throw new PvgisError(
          timedOut ? "PVGIS 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요." : "PVGIS 분석 서비스에 연결하지 못했습니다.",
          503,
          timedOut ? "PVGIS_TIMEOUT" : "PVGIS_UNAVAILABLE",
        );
      }
    }

    await wait(250 * 2 ** attempt);
  }

  throw new PvgisError("PVGIS 분석 서비스에 연결하지 못했습니다.", 503, "PVGIS_UNAVAILABLE");
}
