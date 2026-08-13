"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { createPvgisGenerationResult } from "../../lib/calculations/generation";
import { createPvgisMonthlyGenerationResult } from "../../lib/calculations/pvgis-monthly-generation";
import type { PvgisProxyResult } from "../../lib/pvgis";

const DEFAULT_LAT = 37.5665;
const DEFAULT_LNG = 126.978;
const numberFormat = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

type MonthlyGeneration = { month: number; generationKwh: number };
type AppliedConditions = {
  capacityKw: number;
  lossPercent: number;
  tiltDegrees: number | null;
  azimuthDegrees: number | null;
  radiationDatabase: string;
};
type Result = {
  annualProductionKwh: number;
  monthlyGeneration: MonthlyGeneration[];
  source: string;
  version: string;
  verifiedAt: string;
  retrievedAt: string;
  conditions: AppliedConditions;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function parsePrecisionGenerationResult(payload: unknown): Result {
  const root = record(payload);
  const proxyResult = payload as PvgisProxyResult;
  const annual = createPvgisGenerationResult(proxyResult);
  if (!annual.value) throw new Error(annual.metadata.limitations.at(-1) ?? "PVGIS 응답에서 연간 발전량을 확인하지 못했습니다.");
  const monthlyGeneration = Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
    const monthly = createPvgisMonthlyGenerationResult(proxyResult, month);
    if (!monthly.value) throw new Error(monthly.metadata.limitations.at(-1) ?? `PVGIS 응답에서 ${month}월 발전량을 확인하지 못했습니다.`);
    return monthly.value;
  });
  const request = proxyResult.request;
  return {
    annualProductionKwh: annual.value.annualGenerationKwh,
    monthlyGeneration,
    source: typeof root.source === "string" ? root.source : "PVGIS",
    version: typeof root.version === "string" ? root.version : "5.3",
    verifiedAt: typeof root.verifiedAt === "string" ? root.verifiedAt : "확인된 정보 없음",
    retrievedAt: typeof root.retrievedAt === "string" ? root.retrievedAt : new Date().toISOString(),
    conditions: {
      capacityKw: request.peakPowerKw,
      lossPercent: request.systemLossPercent,
      tiltDegrees: request.tiltDegrees ?? null,
      azimuthDegrees: request.azimuthDegrees ?? null,
      radiationDatabase: request.radiationDatabase ?? "PVGIS-SARAH3",
    },
  };
}

export default function PrecisionGenerationCalculator() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<import("maplibre-gl").Marker | null>(null);
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);
  const [capacity, setCapacity] = useState("3");
  const [showDetails, setShowDetails] = useState(false);
  const [tilt, setTilt] = useState("30");
  const [azimuth, setAzimuth] = useState("0");
  const [loss, setLoss] = useState("14");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validation = useMemo(() => {
    const power = Number(capacity);
    const tiltValue = Number(tilt);
    const azimuthValue = Number(azimuth);
    const lossValue = Number(loss);
    if (!Number.isFinite(power) || power <= 0 || power > 100000) return "설치 용량은 0보다 크고 100,000kW 이하여야 합니다.";
    if (showDetails && (!Number.isFinite(tiltValue) || tiltValue < 0 || tiltValue > 90)) return "경사는 0°에서 90° 사이로 입력해 주세요.";
    if (showDetails && (!Number.isFinite(azimuthValue) || azimuthValue < -180 || azimuthValue > 180)) return "방위는 -180°에서 180° 사이로 입력해 주세요.";
    if (showDetails && (!Number.isFinite(lossValue) || lossValue < 0 || lossValue > 100)) return "예상 손실은 0%에서 100% 사이로 입력해 주세요.";
    return null;
  }, [azimuth, capacity, loss, showDetails, tilt]);

  useEffect(() => {
    if (!mapContainer.current) return;
    let disposed = false;
    let map: import("maplibre-gl").Map | undefined;
    void import("maplibre-gl").then(({ default: maplibregl }) => {
      if (disposed || !mapContainer.current) return;
      map = new maplibregl.Map({
        container: mapContainer.current,
        center: [DEFAULT_LNG, DEFAULT_LAT],
        zoom: 11,
        attributionControl: false,
        style: { version: 8, sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } }, layers: [{ id: "osm", type: "raster", source: "osm" }] },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
      markerRef.current = new maplibregl.Marker().setLngLat([DEFAULT_LNG, DEFAULT_LAT]).addTo(map);
      map.on("click", ({ lngLat }) => {
        setLatitude(lngLat.lat);
        setLongitude(lngLat.lng);
        markerRef.current?.setLngLat(lngLat);
      });
    });
    return () => { disposed = true; markerRef.current = null; map?.remove(); };
  }, []);

  async function calculate() {
    if (validation || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/pvgis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude,
          longitude,
          peakPowerKw: Number(capacity),
          systemLossPercent: showDetails ? Number(loss) : 14,
          tiltDegrees: showDetails ? Number(tilt) : undefined,
          azimuthDegrees: showDetails ? Number(azimuth) : undefined,
          mountingPosition: "building",
          moduleTechnology: "crystSi",
          useHorizon: true,
          radiationDatabase: "PVGIS-SARAH3",
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const message = record(record(payload).error).message;
        throw new Error(typeof message === "string" ? message : "PVGIS 계산을 완료하지 못했습니다.");
      }
      setResult(parsePrecisionGenerationResult(payload));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "PVGIS 계산을 완료하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="precisionCalculator" aria-labelledby="precision-title">
      <div className="precisionIntro">
        <p className="precisionEyebrow">PVGIS 5.3 기반</p>
        <h1 id="precision-title">정밀 태양광 발전량 계산기</h1>
        <p>지도에서 위치를 고르고 설치 용량만 입력하면 월별·연간 발전량 계산에 필요한 조건을 자동으로 적용합니다.</p>
      </div>
      <div className="precisionGrid">
        <div className="precisionMapBlock">
          <div className="stepHeading"><span>1</span><div><strong>위치를 고르세요</strong><p>지도를 눌러 설치 위치를 선택합니다.</p></div></div>
          <div ref={mapContainer} className="precisionMap" aria-label="태양광 설치 위치 선택 지도" />
          <p className="coordinateSummary">선택 위치: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
        </div>
        <div className="precisionFormBlock">
          <div className="stepHeading"><span>2</span><div><strong>설치 용량을 입력하세요</strong><p>모르면 일반 발전량 계산기에서 먼저 확인할 수 있어요.</p></div></div>
          <label className="precisionField" htmlFor="precision-capacity">설치 용량 <span>kW</span></label>
          <input id="precision-capacity" className="precisionInput" type="number" min="0.1" max="100000" step="0.1" value={capacity} onChange={(event) => setCapacity(event.target.value)} aria-invalid={Boolean(validation)} />
          <details className="precisionDetails" open={showDetails} onToggle={(event) => setShowDetails(event.currentTarget.open)}>
            <summary>상세 조건</summary>
            <p>경사·방위·예상 손실 값을 알고 있을 때만 조정하세요. 열지 않으면 경사와 방위는 PVGIS가 위치에 맞춰 계산하고 예상 손실은 14%를 적용합니다.</p>
            <div className="precisionDetailGrid">
              <label>경사 <span>°</span><input type="number" min="0" max="90" value={tilt} onChange={(event) => setTilt(event.target.value)} /></label>
              <label>방위 <span>°</span><input type="number" min="-180" max="180" value={azimuth} onChange={(event) => setAzimuth(event.target.value)} /></label>
              <label>예상 손실 <span>%</span><input type="number" min="0" max="100" step="0.1" value={loss} onChange={(event) => setLoss(event.target.value)} /></label>
            </div>
          </details>
          <p className="precisionValidation" role="status">{validation ?? error ?? "위치와 용량을 확인한 뒤 계산하세요."}</p>
          <button className="precisionButton" type="button" onClick={calculate} disabled={Boolean(validation) || loading}>{loading ? "계산 중…" : "발전량 계산하기"}</button>
        </div>
      </div>
      <section className="precisionResult" aria-live="polite" aria-busy={loading}>
        <div className="stepHeading"><span>3</span><div><strong>계산 결과</strong><p>연간·월별 예상 발전량과 사용한 데이터 출처를 함께 보여줍니다.</p></div></div>
        {!result && !loading && !error && <div className="precisionEmpty">아직 계산 전입니다.</div>}
        {loading && <div className="precisionEmpty">PVGIS 데이터를 불러오고 있습니다.</div>}
        {error && <div className="precisionError"><strong>계산하지 못했습니다.</strong><p>{error}</p></div>}
        {result && <div className="precisionResultCard">
          <span>연간 예상 발전량</span>
          <strong>{numberFormat.format(result.annualProductionKwh)} <small>kWh</small></strong>
          <div className="precisionMonthly" aria-label="월별 예상 발전량">
            {result.monthlyGeneration.map((item) => <div key={item.month}><span>{item.month}월</span><strong>{numberFormat.format(item.generationKwh)}kWh</strong></div>)}
          </div>
          <p>계산 조건: {result.conditions.capacityKw}kW · 예상 손실 {result.conditions.lossPercent}% · {result.conditions.tiltDegrees === null && result.conditions.azimuthDegrees === null ? "경사·방위 PVGIS 자동 계산" : `경사 ${result.conditions.tiltDegrees ?? "자동"}° · 방위 ${result.conditions.azimuthDegrees ?? "자동"}°`} · {result.conditions.radiationDatabase}</p>
          <p>{result.source} {result.version} · 출처 검증일 {result.verifiedAt} · 조회 {new Date(result.retrievedAt).toLocaleString("ko-KR")}</p>
        </div>}
      </section>
    </section>
  );
}
