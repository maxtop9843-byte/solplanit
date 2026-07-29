"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import ResultDownloads from "./ResultDownloads";

const tabs = ["시스템", "손실", "경제성"] as const;
const INITIAL_LATITUDE = "37.5665";
const INITIAL_LONGITUDE = "126.9780";
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

type ModuleTechnology = "crystSi" | "CIS" | "CdTe" | "Unknown";
type MountingPosition = "building" | "free";
type RadiationDatabase = "PVGIS-SARAH3" | "PVGIS-ERA5";
type MonthlyOutput = { month: number; productionKwh: number; irradiationKwhM2: number; variationKwh: number };
type ImportedCalculation = { capacityKw: number; panelCount: number | null; annualGenerationKwh: number | null; annualBenefit: number | null; paybackYears: number | null; goal: "save" | "sell" | null };
type AnalysisResult = { annualProductionKwh: number; annualIrradiationKwhM2: number; annualVariationKwh: number; totalLossPercent: number; monthly: MonthlyOutput[]; horizon: { azimuth: number; height: number }[]; source: string; version: string; verifiedAt: string; retrievedAt: string };

function numberValue(value: unknown): number | null { return typeof value === "number" && Number.isFinite(value) ? value : null; }
function recordValue(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function parseOptionalNumber(value: string | null): number | null { if (value === null || value === "null" || value.trim() === "") return null; const parsed = Number(value); return Number.isFinite(parsed) ? parsed : null; }
function readGeneralCalculation(search: string): ImportedCalculation | null {
  const params = new URLSearchParams(search);
  if (params.get("source") !== "general") return null;
  const capacityKw = parseOptionalNumber(params.get("capacity"));
  if (capacityKw === null || capacityKw <= 0 || capacityKw > 100000) return null;
  const goal = params.get("goal");
  return { capacityKw, panelCount: parseOptionalNumber(params.get("panels")), annualGenerationKwh: parseOptionalNumber(params.get("generation")), annualBenefit: parseOptionalNumber(params.get("benefit")), paybackYears: parseOptionalNumber(params.get("payback")), goal: goal === "save" || goal === "sell" ? goal : null };
}
function parseAnalysisResult(payload: unknown): AnalysisResult {
  const proxy = recordValue(payload); const data = recordValue(proxy.data); const outputs = recordValue(data.outputs); const totals = recordValue(recordValue(outputs.totals).fixed); const monthlyRaw = recordValue(outputs.monthly).fixed; const horizonRaw = outputs.horizon_profile;
  const monthly = Array.isArray(monthlyRaw) ? monthlyRaw.map((item, index) => { const row = recordValue(item); return { month: numberValue(row.month) ?? index + 1, productionKwh: numberValue(row.E_m) ?? 0, irradiationKwhM2: numberValue(row["H(i)_m"]) ?? 0, variationKwh: numberValue(row.SD_m) ?? 0 }; }).filter((item) => item.month >= 1 && item.month <= 12) : [];
  const horizon = Array.isArray(horizonRaw) ? horizonRaw.map((item) => { const row = recordValue(item); return { azimuth: numberValue(row.A) ?? 0, height: numberValue(row.H_hor) ?? 0 }; }) : [];
  const annualProductionKwh = numberValue(totals.E_y); const annualIrradiationKwhM2 = numberValue(totals["H(i)_y"]);
  if (annualProductionKwh === null || annualIrradiationKwhM2 === null || monthly.length === 0) throw new Error("PVGIS 응답에서 필수 발전량 결과를 확인하지 못했습니다.");
  return { annualProductionKwh, annualIrradiationKwhM2, annualVariationKwh: numberValue(totals.SD_y) ?? 0, totalLossPercent: numberValue(totals.l_total) ?? 0, monthly, horizon, source: typeof proxy.source === "string" ? proxy.source : "PVGIS", version: typeof proxy.version === "string" ? proxy.version : "5.3", verifiedAt: typeof proxy.verifiedAt === "string" ? proxy.verifiedAt : "—", retrievedAt: typeof proxy.retrievedAt === "string" ? proxy.retrievedAt : new Date().toISOString() };
}
function formatNumber(value: number, maximumFractionDigits = 0) { return new Intl.NumberFormat("ko-KR", { maximumFractionDigits }).format(value); }

export default function ProWorkspace() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("시스템");
  const [latitude, setLatitude] = useState(INITIAL_LATITUDE); const [longitude, setLongitude] = useState(INITIAL_LONGITUDE); const [peakPowerKw, setPeakPowerKw] = useState("10");
  const [moduleTechnology, setModuleTechnology] = useState<ModuleTechnology>("crystSi"); const [mountingPosition, setMountingPosition] = useState<MountingPosition>("building"); const [systemLossPercent, setSystemLossPercent] = useState("14"); const [tiltDegrees, setTiltDegrees] = useState("30"); const [azimuthDegrees, setAzimuthDegrees] = useState("0");
  const [useOptimalTilt, setUseOptimalTilt] = useState(false); const [useOptimalAzimuth, setUseOptimalAzimuth] = useState(false); const [useHorizon, setUseHorizon] = useState(true); const [radiationDatabase, setRadiationDatabase] = useState<RadiationDatabase>("PVGIS-SARAH3");
  const [importedCalculation, setImportedCalculation] = useState<ImportedCalculation | null>(null); const [result, setResult] = useState<AnalysisResult | null>(null); const [analysisError, setAnalysisError] = useState<string | null>(null); const [isAnalyzing, setIsAnalyzing] = useState(false);

  const validationMessage = useMemo(() => {
    const lat = Number(latitude); const lng = Number(longitude); const power = Number(peakPowerKw); const loss = Number(systemLossPercent); const tilt = Number(tiltDegrees); const azimuth = Number(azimuthDegrees);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return "위도는 -90도에서 90도 사이여야 합니다.";
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) return "경도는 -180도에서 180도 사이여야 합니다.";
    if (!Number.isFinite(power) || power <= 0 || power > 100000) return "설치 용량은 0보다 크고 100,000kWp 이하여야 합니다.";
    if (!Number.isFinite(loss) || loss < 0 || loss > 100) return "시스템 손실은 0%에서 100% 사이여야 합니다.";
    if (!useOptimalTilt && (!Number.isFinite(tilt) || tilt < 0 || tilt > 90)) return "경사각은 0도에서 90도 사이여야 합니다.";
    if (!useOptimalAzimuth && (!Number.isFinite(azimuth) || azimuth < -180 || azimuth > 180)) return "방위각은 -180도에서 180도 사이여야 합니다.";
    return null;
  }, [azimuthDegrees, latitude, longitude, peakPowerKw, systemLossPercent, tiltDegrees, useOptimalAzimuth, useOptimalTilt]);

  useEffect(() => {
    const imported = readGeneralCalculation(window.location.search);
    if (!imported) return;
    queueMicrotask(() => { setImportedCalculation(imported); setPeakPowerKw(String(imported.capacityKw)); });
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;
    let disposed = false; let map: import("maplibre-gl").Map | undefined;
    void import("maplibre-gl").then(({ default: maplibregl }) => {
      if (disposed || !mapContainer.current) return;
      map = new maplibregl.Map({ container: mapContainer.current, center: [Number(INITIAL_LONGITUDE), Number(INITIAL_LATITUDE)], zoom: 11, attributionControl: false, style: { version: 8, sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } }, layers: [{ id: "osm", type: "raster", source: "osm" }] } });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right"); map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
      const marker = new maplibregl.Marker({ color: "#16823B" }).setLngLat([Number(INITIAL_LONGITUDE), Number(INITIAL_LATITUDE)]).addTo(map);
      map.on("click", (event) => { setLatitude(event.lngLat.lat.toFixed(5)); setLongitude(event.lngLat.lng.toFixed(5)); marker.setLngLat(event.lngLat); });
    });
    return () => { disposed = true; map?.remove(); };
  }, []);

  async function runAnalysis() {
    if (validationMessage || isAnalyzing) return; setIsAnalyzing(true); setAnalysisError(null);
    try {
      const response = await fetch("/api/pvgis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: Number(latitude), longitude: Number(longitude), peakPowerKw: Number(peakPowerKw), systemLossPercent: Number(systemLossPercent), tiltDegrees: useOptimalTilt ? undefined : Number(tiltDegrees), azimuthDegrees: useOptimalAzimuth ? undefined : Number(azimuthDegrees), mountingPosition, moduleTechnology }) });
      const payload = await response.json();
      if (!response.ok) { const message = recordValue(recordValue(payload).error).message; throw new Error(typeof message === "string" ? message : "PVGIS 분석을 완료하지 못했습니다."); }
      setResult(parseAnalysisResult(payload));
    } catch (error) { setResult(null); setAnalysisError(error instanceof Error ? error.message : "PVGIS 분석을 완료하지 못했습니다."); } finally { setIsAnalyzing(false); }
  }

  const maxMonthlyProduction = Math.max(...(result?.monthly.map((item) => item.productionKwh) ?? [1]), 1); const maxHorizonHeight = Math.max(...(result?.horizon.map((item) => item.height) ?? [1]), 1);
  const importedBenefit = importedCalculation?.annualBenefit ?? null;

  return (
    <main className="proShell">
      <header className="proHeader"><div className="proBrandGroup"><Link className="proBrand" href="/" aria-label="SolPlanit 홈">SolPlanit</Link><span className="proMode">전문가용</span></div><div className="proHeaderActions"><button className="ghostButton" type="button">프로젝트 불러오기</button><button className="darkButton" type="button" disabled={Boolean(validationMessage) || isAnalyzing} aria-describedby="analysis-status" onClick={runAnalysis}>{isAnalyzing ? "분석 중…" : "분석 실행"}</button></div></header>
      <section className="projectBar" aria-label="프로젝트 요약"><div><p className="proEyebrow">{importedCalculation ? "일반 사용자 계산에서 가져옴" : "새 프로젝트"}</p><h1>태양광 발전량 분석</h1>{importedCalculation && <p role="status">추천 용량 {formatNumber(importedCalculation.capacityKw, 1)}kW{importedCalculation.panelCount !== null ? ` · 패널 약 ${formatNumber(importedCalculation.panelCount)}장` : ""}을 불러왔습니다. 위치와 전문 조건을 확인한 뒤 다시 분석하세요.</p>}</div><dl><div><dt>위치</dt><dd>{Number(latitude).toFixed(3)}, {Number(longitude).toFixed(3)}</dd></div><div><dt>데이터 소스</dt><dd>PVGIS 5.3 · {radiationDatabase}</dd></div><div><dt>상태</dt><dd><span className="statusDot" />{isAnalyzing ? "분석 중" : validationMessage ? "입력 확인 필요" : result ? "분석 완료" : importedCalculation ? "가져오기 완료" : "분석 준비"}</dd></div></dl></section>
      <section className="workspace" aria-label="전문가 분석 워크스페이스">
        <div className="mapPane"><div className="mapToolbar"><div><strong>분석 위치</strong><span>지도를 클릭해 기준점을 선택하세요.</span></div><button type="button" className="mapToolButton" onClick={() => { setLatitude(INITIAL_LATITUDE); setLongitude(INITIAL_LONGITUDE); }}>서울로 초기화</button></div><div ref={mapContainer} className="proMap" aria-label="태양광 분석 위치 선택 지도" /><div className="coordinateBar"><label>위도<input value={latitude} onChange={(event) => setLatitude(event.target.value)} inputMode="decimal" aria-invalid={Boolean(validationMessage?.startsWith("위도"))} /></label><label>경도<input value={longitude} onChange={(event) => setLongitude(event.target.value)} inputMode="decimal" aria-invalid={Boolean(validationMessage?.startsWith("경도"))} /></label><p>MapLibre 기본 지도 · Kakao/Naver 지오코딩 어댑터 교체 가능</p></div></div>
        <aside className="controlPane" aria-label="분석 입력"><div className="tabs" role="tablist" aria-label="입력 항목">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
          {activeTab === "시스템" && <div className="formSection" role="tabpanel" aria-label="시스템 조건"><div className="panelHeading"><div><p>고정식 태양광</p><h2>시스템 조건</h2></div><span>필수 입력</span></div><label>설치 용량 <span>kWp</span><input type="number" min="0.1" max="100000" step="0.1" value={peakPowerKw} onChange={(event) => setPeakPowerKw(event.target.value)} /></label><label>모듈 기술<select value={moduleTechnology} onChange={(event) => setModuleTechnology(event.target.value as ModuleTechnology)}><option value="crystSi">결정질 실리콘</option><option value="CIS">CIS 박막</option><option value="CdTe">CdTe 박막</option><option value="Unknown">기술 미정</option></select></label><label>설치 방식<select value={mountingPosition} onChange={(event) => setMountingPosition(event.target.value as MountingPosition)}><option value="building">건물 부착형</option><option value="free">지상 독립형</option></select></label><div className="fieldPair"><label>경사각 <span>°</span><input type="number" min="0" max="90" value={tiltDegrees} disabled={useOptimalTilt} onChange={(event) => setTiltDegrees(event.target.value)} /></label><label>방위각 <span>°</span><input type="number" min="-180" max="180" value={azimuthDegrees} disabled={useOptimalAzimuth} onChange={(event) => setAzimuthDegrees(event.target.value)} /></label></div><div className="toggleGrid"><label className="checkField"><input type="checkbox" checked={useOptimalTilt} onChange={(event) => setUseOptimalTilt(event.target.checked)} /><span>최적 경사각 자동 계산</span></label><label className="checkField"><input type="checkbox" checked={useOptimalAzimuth} onChange={(event) => setUseOptimalAzimuth(event.target.checked)} /><span>최적 방위각 자동 계산</span></label></div><label>복사 데이터베이스<select value={radiationDatabase} onChange={(event) => setRadiationDatabase(event.target.value as RadiationDatabase)}><option value="PVGIS-SARAH3">PVGIS-SARAH3</option><option value="PVGIS-ERA5">PVGIS-ERA5</option></select></label><label className="checkField"><input type="checkbox" checked={useHorizon} onChange={(event) => setUseHorizon(event.target.checked)} /><span>PVGIS 지평선 음영 데이터 사용</span></label><div className="infoNote"><strong>PVGIS 5.3 입력 기준</strong><p>방위각 0°는 남향, 음수는 동쪽, 양수는 서쪽입니다. 데이터베이스 가용 범위는 위치에 따라 달라질 수 있으며 분석 시 서버에서 다시 검증합니다.</p></div></div>}
          {activeTab === "손실" && <div className="formSection" role="tabpanel" aria-label="손실 조건"><div className="panelHeading"><div><p>기본 손실 가정</p><h2>시스템 손실</h2></div><span>0–100%</span></div><label>통합 시스템 손실 <span>%</span><input type="number" min="0" max="100" step="0.1" value={systemLossPercent} onChange={(event) => setSystemLossPercent(event.target.value)} /></label><div className="infoNote"><strong>무엇이 포함되나요?</strong><p>케이블, 인버터, 온도, 오염과 불일치 손실을 합산한 입력입니다. PVGIS의 계산 손실과 입력 가정을 결과에서 함께 표시합니다.</p></div></div>}
          {activeTab === "경제성" && <div className="emptyPanel" role="tabpanel"><strong>경제성 가정</strong><p>{importedCalculation && importedBenefit !== null ? `일반 계산의 연간 예상 ${importedCalculation.goal === "sell" ? "발전 수익" : "절감액"} ${formatNumber(importedBenefit)}원을 참고값으로 가져왔습니다. 전문 분석 결과와 직접 비교해 확인하세요.` : "설치비, 전기 가치, SMP·REC 등 확인 가능한 값을 직접 입력하는 구조는 발전량 결과 이후 연결됩니다."}</p></div>}
          <p id="analysis-status" className={validationMessage || analysisError ? "validationMessage" : "readyMessage"} role="status">{validationMessage ?? analysisError ?? (result ? "PVGIS 5.3 분석 결과를 불러왔습니다." : importedCalculation ? "일반 사용자 계산의 설치 용량을 불러왔습니다. 전문 조건을 확인한 뒤 분석을 실행하세요." : "필수 입력이 유효합니다. 분석 실행 시 PVGIS 5.3 서버 프록시로 전달됩니다.")}</p>
        </aside>
        <section className="resultPane" aria-labelledby="pro-results-title" aria-busy={isAnalyzing}><div className="resultHeader"><div><p className="proEyebrow">분석 결과</p><h2 id="pro-results-title">프로젝트 요약</h2></div><span className="resultState">{isAnalyzing ? "계산 중" : result ? "계산 완료" : "계산 전"}</span></div>
          <div className="summaryGrid"><article><span>연간 예상 발전량</span><strong>{result ? formatNumber(result.annualProductionKwh) : "—"} <small>kWh</small></strong>{result && <em>± {formatNumber(result.annualVariationKwh)} kWh</em>}</article><article><span>연간 경사면 일사량</span><strong>{result ? formatNumber(result.annualIrradiationKwhM2) : "—"} <small>kWh/m²</small></strong></article><article><span>PVGIS 계산 총손실</span><strong>{result ? formatNumber(result.totalLossPercent, 1) : systemLossPercent || "—"} <small>%</small></strong></article></div>
          {!result && !isAnalyzing && <div className="resultEmpty"><strong>입력 조건을 확인한 뒤 분석을 실행하세요.</strong><p>결과가 생성되면 월별 발전량, 일사량, 연간 변동성과 손실 요약을 한 화면에서 비교할 수 있습니다.</p></div>}
          {isAnalyzing && <div className="resultEmpty" role="status"><strong>PVGIS 5.3 데이터를 계산하고 있습니다.</strong><p>위치와 시스템 조건에 따라 잠시 걸릴 수 있습니다.</p></div>}
          {result && <><div className="resultCharts"><section className="chartPanel" aria-labelledby="monthly-chart-title"><div className="chartTitle"><div><h3 id="monthly-chart-title">월별 발전량</h3><p>막대 높이는 월간 예상 발전량을 나타냅니다.</p></div><span>kWh/월</span></div><div className="monthlyChart">{result.monthly.map((item) => <div className="monthColumn" key={item.month}><div className="barValue">{formatNumber(item.productionKwh)}</div><div className="barTrack"><span style={{ height: `${Math.max(4, item.productionKwh / maxMonthlyProduction * 100)}%` }} /></div><small>{MONTHS[item.month - 1]}</small></div>)}</div></section><section className="detailPanel" aria-labelledby="assumption-title"><div><h3 id="assumption-title">가정과 출처</h3><dl><div><dt>설치 용량</dt><dd>{formatNumber(Number(peakPowerKw), 1)} kWp</dd></div><div><dt>경사 / 방위</dt><dd>{useOptimalTilt ? "최적" : `${tiltDegrees}°`} / {useOptimalAzimuth ? "최적" : `${azimuthDegrees}°`}</dd></div><div><dt>입력 손실</dt><dd>{systemLossPercent}%</dd></div><div><dt>출처</dt><dd>{result.source} {result.version}</dd></div><div><dt>출처 검증일</dt><dd>{result.verifiedAt}</dd></div><div><dt>조회 시각</dt><dd>{new Date(result.retrievedAt).toLocaleString("ko-KR")}</dd></div></dl></div><p>이 결과는 기상 데이터와 모델 가정을 이용한 추정치이며 실제 발전량이나 수익을 보장하지 않습니다.</p></section></div>
          <div className="monthlyTableWrap"><table><caption>월별 발전량과 일사량 상세</caption><thead><tr><th>월</th><th>발전량</th><th>경사면 일사량</th><th>표준편차</th></tr></thead><tbody>{result.monthly.map((item) => <tr key={item.month}><th>{MONTHS[item.month - 1]}</th><td>{formatNumber(item.productionKwh)} kWh</td><td>{formatNumber(item.irradiationKwhM2, 1)} kWh/m²</td><td>± {formatNumber(item.variationKwh)} kWh</td></tr>)}</tbody></table></div>
          <section className="horizonPanel" aria-labelledby="horizon-title"><div><h3 id="horizon-title">지평선 프로파일</h3><p>{result.horizon.length ? "방위별 지평선 높이를 표시합니다." : "PVGIS 응답에 지평선 프로파일이 포함되지 않았습니다."}</p></div>{result.horizon.length > 0 && <div className="horizonChart" aria-label="방위별 지평선 높이 차트">{result.horizon.map((item, index) => <span key={`${item.azimuth}-${index}`} title={`${item.azimuth}° · ${item.height}°`} style={{ height: `${Math.max(2, item.height / maxHorizonHeight * 100)}%` }} />)}</div>}</section></>}
          <div className="resultFooter"><p>{result ? "출처와 면책 정보를 포함해 원하는 형식으로 저장하세요." : "분석을 완료하면 CSV, JSON, 차트 이미지와 PDF 보고서를 저장할 수 있습니다."}</p><ResultDownloads result={result} project={{ latitude: Number(latitude), longitude: Number(longitude), peakPowerKw: Number(peakPowerKw), systemLossPercent: Number(systemLossPercent), tilt: useOptimalTilt ? "최적" : `${tiltDegrees}°`, azimuth: useOptimalAzimuth ? "최적" : `${azimuthDegrees}°`, radiationDatabase }} /></div>
        </section>
      </section>
    </main>
  );
}
