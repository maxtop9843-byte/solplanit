"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const tabs = ["시스템", "손실", "경제성"] as const;
const INITIAL_LATITUDE = "37.5665";
const INITIAL_LONGITUDE = "126.9780";

export default function ProWorkspace() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("시스템");
  const [latitude, setLatitude] = useState(INITIAL_LATITUDE);
  const [longitude, setLongitude] = useState(INITIAL_LONGITUDE);

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
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
      const marker = new maplibregl.Marker({ color: "#16823B" })
        .setLngLat([Number(INITIAL_LONGITUDE), Number(INITIAL_LATITUDE)])
        .addTo(map);
      map.on("click", (event) => {
        const lat = event.lngLat.lat.toFixed(5);
        const lng = event.lngLat.lng.toFixed(5);
        setLatitude(lat);
        setLongitude(lng);
        marker.setLngLat(event.lngLat);
      });
    });

    return () => {
      disposed = true;
      map?.remove();
    };
  }, []);

  return (
    <main className="proShell">
      <header className="proHeader">
        <div className="proBrandGroup">
          <Link className="proBrand" href="/" aria-label="SolPlanit 홈">SolPlanit</Link>
          <span className="proMode">전문가용</span>
        </div>
        <div className="proHeaderActions">
          <button className="ghostButton" type="button">프로젝트 불러오기</button>
          <button className="darkButton" type="button" disabled>분석 실행</button>
        </div>
      </header>

      <section className="projectBar" aria-label="프로젝트 요약">
        <div>
          <p className="proEyebrow">새 프로젝트</p>
          <h1>태양광 발전량 분석</h1>
        </div>
        <dl>
          <div><dt>위치</dt><dd>서울특별시 중심 좌표</dd></div>
          <div><dt>데이터 소스</dt><dd>PVGIS 5.3 연결 예정</dd></div>
          <div><dt>상태</dt><dd><span className="statusDot" />입력 준비</dd></div>
        </dl>
      </section>

      <section className="workspace" aria-label="전문가 분석 워크스페이스">
        <div className="mapPane">
          <div className="mapToolbar">
            <div>
              <strong>분석 위치</strong>
              <span>지도를 클릭해 기준점을 선택하세요.</span>
            </div>
            <button type="button" className="mapToolButton" onClick={() => { setLatitude(INITIAL_LATITUDE); setLongitude(INITIAL_LONGITUDE); }}>서울로 초기화</button>
          </div>
          <div ref={mapContainer} className="proMap" aria-label="태양광 분석 위치 선택 지도" />
          <div className="coordinateBar">
            <label>위도<input value={latitude} onChange={(event) => setLatitude(event.target.value)} inputMode="decimal" /></label>
            <label>경도<input value={longitude} onChange={(event) => setLongitude(event.target.value)} inputMode="decimal" /></label>
            <p>MapLibre 기본 지도 · Kakao/Naver 지오코딩 어댑터 연결 예정</p>
          </div>
        </div>

        <aside className="controlPane" aria-label="분석 입력">
          <div className="tabs" role="tablist" aria-label="입력 항목">
            {tabs.map((tab) => (
              <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </div>

          {activeTab === "시스템" && (
            <div className="formSection" role="tabpanel">
              <div className="panelHeading"><div><p>고정식 태양광</p><h2>시스템 조건</h2></div><span>필수 입력</span></div>
              <label>설치 용량 <span>kWp</span><input type="number" min="0.1" step="0.1" defaultValue="10" /></label>
              <label>모듈 기술<select defaultValue="crystalline"><option value="crystalline">결정질 실리콘</option><option value="thinfilm">박막형</option><option value="unknown">기술 미정</option></select></label>
              <div className="fieldPair"><label>경사각 <span>°</span><input type="number" min="0" max="90" defaultValue="30" /></label><label>방위각 <span>°</span><input type="number" min="-180" max="180" defaultValue="0" /></label></div>
              <label>설치 방식<select defaultValue="building"><option value="building">건물 부착형</option><option value="free">지상 독립형</option></select></label>
              <div className="infoNote"><strong>PVGIS 입력 흐름 준비 단계</strong><p>현재는 워크스페이스 셸과 입력 구조만 제공합니다. 실제 발전량 계산은 다음 작업에서 PVGIS 5.3 프록시를 연결한 뒤 활성화됩니다.</p></div>
            </div>
          )}

          {activeTab === "손실" && <div className="emptyPanel" role="tabpanel"><strong>시스템 손실 설정</strong><p>케이블, 인버터, 온도, 오염 등 손실 가정은 PVGIS 연동 작업과 함께 제공됩니다.</p></div>}
          {activeTab === "경제성" && <div className="emptyPanel" role="tabpanel"><strong>경제성 가정</strong><p>설치비, 전기 가치, SMP·REC 등 확인 가능한 값을 직접 입력하는 구조로 확장됩니다.</p></div>}
        </aside>

        <section className="resultPane" aria-labelledby="pro-results-title">
          <div className="resultHeader"><div><p className="proEyebrow">분석 결과</p><h2 id="pro-results-title">프로젝트 요약</h2></div><span className="resultState">계산 전</span></div>
          <div className="summaryGrid">
            <article><span>연간 예상 발전량</span><strong>— <small>kWh</small></strong></article>
            <article><span>연간 일사량</span><strong>— <small>kWh/m²</small></strong></article>
            <article><span>시스템 손실</span><strong>— <small>%</small></strong></article>
          </div>
          <div className="chartPlaceholder" aria-label="월별 발전량 차트 준비 중">
            <div className="chartBars" aria-hidden="true">{[34,45,58,71,82,91,88,79,65,50,38,29].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
            <p>PVGIS 5.3 연결 후 월별 발전량과 일사량을 표시합니다.</p>
          </div>
          <div className="resultFooter"><p>결과에는 데이터 출처, 버전, 조회 시각, 가정과 한계를 함께 기록합니다.</p><button type="button" className="ghostButton" disabled>결과 다운로드</button></div>
        </section>
      </section>
    </main>
  );
}
