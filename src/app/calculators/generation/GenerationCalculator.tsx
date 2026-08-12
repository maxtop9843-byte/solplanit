"use client";

import { useState } from "react";
import { createPvgisGenerationResult } from "../../../lib/calculations/generation";
import { createPvgisMonthlyGenerationResult } from "../../../lib/calculations/pvgis-monthly-generation";
import type { PvgisProxyResult } from "../../../lib/pvgis";
import styles from "../bill-savings/bill-savings.module.css";

type RegionKey = "seoul" | "busan" | "daejeon" | "daegu" | "gwangju";
type Region = { label: string; latitude: number; longitude: number };
const REGIONS: Record<RegionKey, Region> = {
  seoul: { label: "서울", latitude: 37.5665, longitude: 126.978 },
  busan: { label: "부산", latitude: 35.1796, longitude: 129.0756 },
  daejeon: { label: "대전", latitude: 36.3504, longitude: 127.3845 },
  daegu: { label: "대구", latitude: 35.8714, longitude: 128.6014 },
  gwangju: { label: "광주", latitude: 35.1595, longitude: 126.8526 },
};
const number = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });

function optionalNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  return Number(value);
}

export default function GenerationCalculator() {
  const [region, setRegion] = useState<RegionKey>("seoul");
  const [capacityKw, setCapacityKw] = useState("3");
  const [tiltDegrees, setTiltDegrees] = useState("");
  const [azimuthDegrees, setAzimuthDegrees] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [annualGenerationKwh, setAnnualGenerationKwh] = useState<number | null>(null);
  const [monthlyGeneration, setMonthlyGeneration] = useState<Array<{ month: number; generationKwh: number }>>([]);
  const [referenceDate, setReferenceDate] = useState<string | null>(null);
  const [calculatedAt, setCalculatedAt] = useState<string | null>(null);

  async function calculate() {
    const capacity = Number(capacityKw);
    const tilt = optionalNumber(tiltDegrees);
    const azimuth = optionalNumber(azimuthDegrees);

    if (capacityKw.trim() === "" || !Number.isFinite(capacity) || capacity <= 0 || capacity > 100) {
      setError("설치 용량을 0보다 크고 100kW 이하로 입력해 주세요.");
      setAnnualGenerationKwh(null);
      setMonthlyGeneration([]);
      return;
    }
    if (tilt !== undefined && (!Number.isFinite(tilt) || tilt < 0 || tilt > 90)) {
      setError("패널 경사각을 0도에서 90도 사이로 입력해 주세요.");
      setAnnualGenerationKwh(null);
      setMonthlyGeneration([]);
      return;
    }
    if (azimuth !== undefined && (!Number.isFinite(azimuth) || azimuth < -180 || azimuth > 180)) {
      setError("패널 방향을 다시 선택해 주세요.");
      setAnnualGenerationKwh(null);
      setMonthlyGeneration([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnnualGenerationKwh(null);
    setMonthlyGeneration([]);
    setReferenceDate(null);
    setCalculatedAt(null);

    try {
      const location = REGIONS[region];
      const response = await fetch("/api/pvgis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          peakPowerKw: capacity,
          systemLossPercent: 14,
          useHorizon: true,
          radiationDatabase: "PVGIS-SARAH3",
          ...(tilt === undefined ? {} : { tiltDegrees: tilt }),
          ...(azimuth === undefined ? {} : { azimuthDegrees: azimuth }),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const message = payload && typeof payload === "object" ? (payload as { error?: { message?: unknown } }).error?.message : null;
        throw new Error(typeof message === "string" ? message : "발전량을 불러오지 못했습니다.");
      }
      const proxyResult = payload as PvgisProxyResult;
      const annual = createPvgisGenerationResult(proxyResult);
      if (!annual.value) throw new Error(annual.metadata.limitations.at(-1) ?? "연간 발전량을 확인하지 못했습니다.");
      const monthly = Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
        const result = createPvgisMonthlyGenerationResult(proxyResult, month);
        if (!result.value) throw new Error(result.metadata.limitations.at(-1) ?? `${month}월 발전량을 확인하지 못했습니다.`);
        return result.value;
      });
      setAnnualGenerationKwh(annual.value.annualGenerationKwh);
      setMonthlyGeneration(monthly);
      setReferenceDate(annual.metadata.referenceDate ?? null);
      setCalculatedAt(annual.metadata.calculatedAt ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "계산을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  const usesDetailedConditions = tiltDegrees.trim() !== "" || azimuthDegrees.trim() !== "";

  return <div className={styles.calculator}>
    <section className={styles.formPanel} aria-labelledby="generation-input-title">
      <h2 id="generation-input-title">지역과 설치 용량만 넣어보세요</h2>
      <div className={styles.fieldGroup}><label htmlFor="generation-region">지역</label><span id="generation-region-help">선택한 지역의 중심 좌표를 사용한 간단한 예상입니다.</span><select id="generation-region" aria-describedby="generation-region-help" value={region} onChange={(event) => setRegion(event.target.value as RegionKey)}>{Object.entries(REGIONS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></div>
      <div className={styles.fieldGroup}><label htmlFor="generation-capacity">설치 용량</label><span id="generation-capacity-help">가정용 3kW를 보려면 기본값을 그대로 사용해도 됩니다.</span><div className={styles.inputWithUnit}><input id="generation-capacity" aria-describedby="generation-capacity-help" inputMode="decimal" value={capacityKw} onChange={(event) => setCapacityKw(event.target.value)} /><span>kW</span></div></div>
      <details className={styles.advanced}>
        <summary>상세 조건</summary>
        <p>지붕의 경사나 방향을 알고 있을 때만 입력하세요. 비워 두면 PVGIS가 이 위치의 최적 경사와 방향을 계산합니다.</p>
        <div className={styles.fieldGroup}><label htmlFor="generation-tilt">패널 경사각</label><span id="generation-tilt-help">수평 설치는 0도, 세울수록 숫자가 커집니다.</span><div className={styles.inputWithUnit}><input id="generation-tilt" aria-describedby="generation-tilt-help" inputMode="decimal" placeholder="모르면 비워두세요" value={tiltDegrees} onChange={(event) => setTiltDegrees(event.target.value)} /><span>도</span></div></div>
        <div className={styles.fieldGroup}><label htmlFor="generation-azimuth">패널 방향</label><span id="generation-azimuth-help">모르면 자동 계산을 그대로 두세요.</span><select id="generation-azimuth" aria-describedby="generation-azimuth-help" value={azimuthDegrees} onChange={(event) => setAzimuthDegrees(event.target.value)}><option value="">자동 계산</option><option value="0">남향</option><option value="-45">남동향</option><option value="45">남서향</option><option value="-90">동향</option><option value="90">서향</option><option value="180">북향</option></select></div>
      </details>
      <button className={styles.primaryButton} type="button" onClick={calculate} disabled={isLoading}>{isLoading ? "발전량 확인 중…" : "예상 발전량 계산하기"}</button>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
    </section>
    <section className={styles.resultPanel} aria-live="polite" aria-labelledby="generation-result-title">
      <p className={styles.eyebrow}>JRC PVGIS 5.3</p><h2 id="generation-result-title">{annualGenerationKwh === null ? "계산 결과" : `${REGIONS[region].label}의 예상 발전량`}</h2>
      {annualGenerationKwh === null && !error ? <div className={styles.emptyState}>지역과 설치 용량을 넣고 계산하면 월별·연간 예상 발전량을 보여드립니다.</div> : null}
      {annualGenerationKwh !== null ? <><dl className={styles.metrics}><div className={styles.primaryMetric}><dt>연간 예상 발전량</dt><dd>{number.format(annualGenerationKwh)}kWh</dd></div>{monthlyGeneration.map((item) => <div key={item.month}><dt>{item.month}월</dt><dd>{number.format(item.generationKwh)}kWh</dd></div>)}</dl><div className={styles.method}><h3>계산 기준과 출처</h3><p>JRC PVGIS 5.3에서 선택한 지역 중심 좌표와 설치 용량을 사용했습니다. 시스템 손실 14%, 지평선 반영, PVGIS-SARAH3를 적용했습니다. {usesDetailedConditions ? "입력한 경사·방향 조건을 반영했습니다." : "경사와 방향은 PVGIS의 최적 조건 계산을 사용했습니다."}</p><p>검증일: {referenceDate ?? "확인된 정보 없음"}</p><p>조회 시각: {calculatedAt ?? "확인된 정보 없음"}</p><p><a href="https://re.jrc.ec.europa.eu/pvg_tools/en/" target="_blank" rel="noreferrer">JRC PVGIS 공식 도구</a></p></div></> : null}
    </section>
  </div>;
}
