"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const tabs = ["시스템", "손실", "경제성"] as const;
const INITIAL_LATITUDE = "37.5665";
const INITIAL_LONGITUDE = "126.9780";

type ModuleTechnology = "crystSi" | "CIS" | "CdTe" | "Unknown";
type MountingPosition = "building" | "free";
type RadiationDatabase = "PVGIS-SARAH3" | "PVGIS-ERA5";

export default function ProWorkspace() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("시스템");
  const [latitude, setLatitude] = useState(INITIAL_LATITUDE);
  const [longitude, setLongitude] = useState(INITIAL_LONGITUDE);
  const [peakPowerKw, setPeakPowerKw] = useState("10");
  const [moduleTechnology, setModuleTechnology] = useState<ModuleTechnology>("crystSi");
  const [mountingPosition, setMountingPosition] = useState<MountingPosition>("building");
  const [systemLossPercent, setSystemLossPercent] = useState("14");
  const [tiltDegrees, setTiltDegrees] = useState("30");
  const [azimuthDegrees, setAzimuthDegrees] = useState("0");
  const [useOptimalTilt, setUseOptimalTilt] = useState(false);
  const [useOptimalAzimuth, setUseOptimalAzimuth] = useState(false);
  const [useHorizon, setUseHorizon] = useState(true);
  const [radiationDatabase, setRadiationDatabase] = useState<RadiationDatabase>("PVGIS-SARAH3");

  const validationMessage = useMemo(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const power = Number(peakPowerKw);
    const loss = Number(systemLossPercent);
    const tilt = Number(tiltDegrees);
    const azimuth = Number(azimuthDegrees);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return "위도는 -90도에서 90도 사이여야 합니다.";
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) return "경도는 -180도에서 180도 사이여야 합니다.";
    if (!Number.isFinite(power) || power <= 0 || power > 100000) return "설치 용량은 0보다 크고 100,000kWp 이하여야 합니다.";
    if (!Number.isFinite(loss) || loss < 0 || loss > 100) return "시스템 손실은 0%에서 100% 사이여야 합니다.";
    if (!useOptimalTilt && (!Number.isFinite(tilt) || tilt < 0 || tilt > 90)) return "경사각은 0도에서 90도 사이여야 합니다.";
    if (!useOptimalAzimuth && (!Number.isFinite(azimuth) || azimuth < -180 || azimuth > 180)) return "방위각은 -180도에서 180도 사이여야 합니다.";
    return null;
  }, [azimuthDegrees, latitude, longitude, peakPowerKw, systemLossPercent, tiltDegrees, useOptimalAzimuth, useOptimalTilt]);

  useEffect(() => {
    if (!mapContainer.current) return;
    let disposed = false;
    let map: import("maplibre-gl").Map | undefined;

    void import("maplibre-gl").then(({ default: maplibregl }) => {
      if (disposed || !mapContainer.current) return;
      map = new maplibregl.Map({
        container: mapContainer.current,
        center: [Number(INITIAL_LONGITUDE), Number(INITIAL_LATITUDE)],
        zoom: 11,
        attributionControl: false,
        style: {
          version: 8,
          sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
      const marker = new maplibregl.Marker({ color: "#16823B" }).setLngLat([Number(INITIAL_LONGITUDE), Number(INITIAL_LATITUDE)]).addTo(map);
      map.on("click", (event) => {
        setLatitude(event.lngLat.lat.toFixed(5));
        setLongitude(event.lngLat.lng.toFixed(5));
        marker.setLngLat(event.lngLat);
      });
    });

    return () => { disposed = true; map?.remove(); };
  }, []);

  return (
    <main className="proShell">
      <header className="proHeader">
        <div className="proBrandGroup"><Link className="proBrand" href="/" aria-label="SolPlanit 홈">SolPlanit</Link><span className="proMode">전문가용</span></div>
        <div className="proHeaderActions"><button className="ghostButton" type="button">프로젝트 불러오기</button><button className="darkButton" type="button" disabled={Boolean(validationMessage)} aria-describedby="analysis-status">분석 실행</button></div>
      </header>

      <section className="projectBar" aria-label="프로젝트 요약">
        <div><p className="proEyebrow">새 프로젝트</p><h1>태양광 발전량 분석</h1></div>
        <dl><div><dt>위치</dt><dd>{Number(latitude).toFixed(3)}, {Number(longitude).toFixed(3)}</dd></div><div><dt>데이터 소스</dt><dd>PVGIS 5.3 · {radiationDatabase}</dd></div><div><dt>상태</dt><dd><span className="statusDot" />{validationMessage ? "입력 확인 필요" : "분석 준비"}</dd></div></dl>
      </section>

      <section className="workspace" aria-label="전문가 분석 워크스페이스">
        <div className="mapPane">
          <div className="mapToolbar"><div><strong>분석 위치</strong><span>지도를 클릭해 기준점을 선택하세요.</span></div><button type="button" className="mapToolButton" onClick={() => { setLatitude(INITIAL_LATITUDE); setLongitude(INITIAL_LONGITUDE); }}>서울로 초기화</button></div>
          <div ref={mapContainer} className="proMap" aria-label="태양광 분석 위치 선택 지도" />
          <div className="coordinateBar"><label>위도<input value={latitude} onChange={(event) => setLatitude(event.target.value)} inputMode="decimal" aria-invalid={Boolean(validationMessage?.startsWith("위도"))} /></label><label>경도<input value={longitude} onChange={(event) => setLongitude(event.target.value)} inputMode="decimal" aria-invalid={Boolean(validationMessage?.startsWith("경도"))} /></label><p>MapLibre 기본 지도 · Kakao/Naver 지오코딩 어댑터 교체 가능</p></div>
        </div>

        <aside className="controlPane" aria-label="분석 입력">
          <div className="tabs" role="tablist" aria-label="입력 항목">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>

          {activeTab === "시스템" && (
            <div className="formSection" role="tabpanel" aria-label="시스템 조건">
              <div className="panelHeading"><div><p>고정식 태양광</p><h2>시스템 조건</h2></div><span>필수 입력</span></div>
              <label>설치 용량 <span>kWp</span><input type="number" min="0.1" max="100000" step="0.1" value={peakPowerKw} onChange={(event) => setPeakPowerKw(event.target.value)} /></label>
              <label>모듈 기술<select value={moduleTechnology} onChange={(event) => setModuleTechnology(event.target.value as ModuleTechnology)}><option value="crystSi">결정질 실리콘</option><option value="CIS">CIS 박막</option><option value="CdTe">CdTe 박막</option><option value="Unknown">기술 미정</option></select></label>
              <label>설치 방식<select value={mountingPosition} onChange={(event) => setMountingPosition(event.target.value as MountingPosition)}><option value="building">건물 부착형</option><option value="free">지상 독립형</option></select></label>
              <div className="fieldPair"><label>경사각 <span>°</span><input type="number" min="0" max="90" value={tiltDegrees} disabled={useOptimalTilt} onChange={(event) => setTiltDegrees(event.target.value)} /></label><label>방위각 <span>°</span><input type="number" min="-180" max="180" value={azimuthDegrees} disabled={useOptimalAzimuth} onChange={(event) => setAzimuthDegrees(event.target.value)} /></label></div>
              <div className="toggleGrid"><label className="checkField"><input type="checkbox" checked={useOptimalTilt} onChange={(event) => setUseOptimalTilt(event.target.checked)} /><span>최적 경사각 자동 계산</span></label><label className="checkField"><input type="checkbox" checked={useOptimalAzimuth} onChange={(event) => setUseOptimalAzimuth(event.target.checked)} /><span>최적 방위각 자동 계산</span></label></div>
              <label>복사 데이터베이스<select value={radiationDatabase} onChange={(event) => setRadiationDatabase(event.target.value as RadiationDatabase)}><option value="PVGIS-SARAH3">PVGIS-SARAH3</option><option value="PVGIS-ERA5">PVGIS-ERA5</option></select></label>
              <label className="checkField"><input type="checkbox" checked={useHorizon} onChange={(event) => setUseHorizon(event.target.checked)} /><span>PVGIS 지평선 음영 데이터 사용</span></label>
              <div className="infoNote"><strong>PVGIS 5.3 입력 기준</strong><p>방위각 0°는 남향, 음수는 동쪽, 양수는 서쪽입니다. 데이터베이스 가용 범위는 위치에 따라 달라질 수 있으며 분석 시 서버에서 다시 검증합니다.</p></div>
            </div>
          )}

          {activeTab === "손실" && <div className="formSection" role="tabpanel" aria-label="손실 조건"><div className="panelHeading"><div><p>기본 손실 가정</p><h2>시스템 손실</h2></div><span>0–100%</span></div><label>통합 시스템 손실 <span>%</span><input type="number" min="0" max="100" step="0.1" value={systemLossPercent} onChange={(event) => setSystemLossPercent(event.target.value)} /></label><div className="infoNote"><strong>무엇이 포함되나요?</strong><p>케이블, 인버터, 온도, 오염과 불일치 손실을 합산한 입력입니다. 세부 손실 분해는 결과 단계에서 가정으로 표시합니다.</p></div></div>}
          {activeTab === "경제성" && <div className="emptyPanel" role="tabpanel"><strong>경제성 가정</strong><p>설치비, 전기 가치, SMP·REC 등 확인 가능한 값을 직접 입력하는 구조는 전문가 결과 작업 이후 연결됩니다.</p></div>}
          <p id="analysis-status" className={validationMessage ? "validationMessage" : "readyMessage"} role="status">{validationMessage ?? "필수 입력이 유효합니다. 분석 실행 시 PVGIS 5.3 서버 프록시로 전달됩니다."}</p>
        </aside>

        <section className="resultPane" aria-labelledby="pro-results-title">
          <div className="resultHeader"><div><p className="proEyebrow">분석 결과</p><h2 id="pro-results-title">프로젝트 요약</h2></div><span className="resultState">계산 전</span></div>
          <div className="summaryGrid"><article><span>연간 예상 발전량</span><strong>— <small>kWh</small></strong></article><article><span>연간 일사량</span><strong>— <small>kWh/m²</small></strong></article><article><span>시스템 손실</span><strong>{systemLossPercent || "—"} <small>%</small></strong></article></div>
          <div className="chartPlaceholder" aria-label="월별 발전량 차트 준비 중"><div className="chartBars" aria-hidden="true">{[34,45,58,71,82,91,88,79,65,50,38,29].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div><p>PRO-004에서 PVGIS 5.3 응답을 월별 발전량과 일사량으로 표시합니다.</p></div>
          <div className="resultFooter"><p>결과에는 데이터 출처, 버전, 조회 시각, 가정과 한계를 함께 기록합니다.</p><button type="button" className="ghostButton" disabled>결과 다운로드</button></div>
        </section>
      </section>
    </main>
  );
}
