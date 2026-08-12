"use client";

import Link from "next/link";
import { useState } from "react";
import { createPvgisMonthlyGenerationResult } from "../../../lib/calculations/pvgis-monthly-generation";
import { calculateResidentialBillSavingsRange } from "../../../lib/calculations/residential-bill-savings-range";
import type { PvgisProxyResult } from "../../../lib/pvgis";
import styles from "./bill-savings.module.css";

type RegionKey = "seoul" | "busan" | "daejeon" | "daegu" | "gwangju";
type Region = { label: string; latitude: number; longitude: number };

const REGIONS: Record<RegionKey, Region> = {
  seoul: { label: "서울", latitude: 37.5665, longitude: 126.978 },
  busan: { label: "부산", latitude: 35.1796, longitude: 129.0756 },
  daejeon: { label: "대전", latitude: 36.3504, longitude: 127.3845 },
  daegu: { label: "대구", latitude: 35.8714, longitude: 128.6014 },
  gwangju: { label: "광주", latitude: 35.1595, longitude: 126.8526 },
};
const MONTHS = [7, 8, 9] as const;
const won = new Intl.NumberFormat("ko-KR");
const number = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });

export default function BillSavingsCalculator() {
  const [region, setRegion] = useState<RegionKey>("seoul");
  const [monthlyUsage, setMonthlyUsage] = useState("");
  const [capacityKw, setCapacityKw] = useState("");
  const [month, setMonth] = useState<(typeof MONTHS)[number]>(8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateResidentialBillSavingsRange> | null>(null);
  const [generationKwh, setGenerationKwh] = useState<number | null>(null);
  const [generationReferenceDate, setGenerationReferenceDate] = useState<string | null>(null);

  async function calculate() {
    const usage = Number(monthlyUsage);
    const capacity = Number(capacityKw);
    if (monthlyUsage.trim() === "" || !Number.isFinite(usage) || usage < 0) {
      setError("월 전기 사용량을 0kWh 이상의 숫자로 입력해 주세요.");
      setResult(null);
      return;
    }
    if (capacityKw.trim() === "" || !Number.isFinite(capacity) || capacity <= 0 || capacity > 100) {
      setError("설치 용량을 0보다 크고 100kW 이하로 입력해 주세요.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setGenerationKwh(null);
    setGenerationReferenceDate(null);

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
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const message = payload && typeof payload === "object"
          ? (payload as { error?: { message?: unknown } }).error?.message
          : null;
        throw new Error(typeof message === "string" ? message : "발전량을 불러오지 못했습니다.");
      }

      const generationResult = createPvgisMonthlyGenerationResult(payload as PvgisProxyResult, month);
      if (!generationResult.value) {
        throw new Error(generationResult.metadata.limitations.at(-1) ?? "선택한 달의 발전량을 확인하지 못했습니다.");
      }
      const monthlyGeneration = generationResult.value.generationKwh;
      const savingsResult = calculateResidentialBillSavingsRange({
        monthlyUsageKwh: usage,
        monthlySolarGenerationKwh: monthlyGeneration,
        month,
      });
      if (!savingsResult.value) {
        throw new Error(savingsResult.metadata.limitations.at(-1) ?? "전기요금 절감액을 계산하지 못했습니다.");
      }

      setGenerationKwh(monthlyGeneration);
      setGenerationReferenceDate(generationResult.metadata.referenceDate ?? null);
      setResult(savingsResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "계산을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  const value = result?.value ?? null;

  return (
    <div className={styles.calculator}>
      <section className={styles.formPanel} aria-labelledby="bill-savings-input-title">
        <h2 id="bill-savings-input-title">알고 있는 값만 넣어보세요</h2>
        <div className={styles.fieldGroup}>
          <label htmlFor="bill-region">지역</label>
          <span id="bill-region-help">지역 중심 좌표를 사용한 간단한 발전량 예상입니다.</span>
          <select id="bill-region" aria-describedby="bill-region-help" value={region} onChange={(event) => setRegion(event.target.value as RegionKey)}>
            {Object.entries(REGIONS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="bill-usage">월 전기 사용량</label>
          <span id="bill-usage-help">전기요금 고지서의 사용량(kWh)을 입력해 주세요.</span>
          <div className={styles.inputWithUnit}><input id="bill-usage" aria-describedby="bill-usage-help" inputMode="decimal" value={monthlyUsage} onChange={(event) => setMonthlyUsage(event.target.value)} /><span>kWh</span></div>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="bill-capacity">설치 용량</label>
          <span id="bill-capacity-help">용량을 모르면 먼저 설치 가능 용량을 계산해 보세요.</span>
          <div className={styles.inputWithUnit}><input id="bill-capacity" aria-describedby="bill-capacity-help" inputMode="decimal" value={capacityKw} onChange={(event) => setCapacityKw(event.target.value)} /><span>kW</span></div>
          <Link className={styles.helperLink} href="/#quick-estimate">설치 가능 용량 계산하기</Link>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="bill-month">비교할 달</label>
          <span id="bill-month-help">현재 한전 요금 모델이 검증된 2026년 3분기만 계산합니다.</span>
          <select id="bill-month" aria-describedby="bill-month-help" value={month} onChange={(event) => setMonth(Number(event.target.value) as (typeof MONTHS)[number])}>
            {MONTHS.map((item) => <option key={item} value={item}>{item}월</option>)}
          </select>
        </div>
        <button className={styles.primaryButton} type="button" onClick={calculate} disabled={isLoading}>{isLoading ? "발전량 확인 중…" : "전기요금 절감액 계산하기"}</button>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
      </section>

      <section className={styles.resultPanel} aria-live="polite" aria-labelledby="bill-savings-result-title">
        <p className={styles.eyebrow}>KEPCO + JRC PVGIS 5.3</p>
        <h2 id="bill-savings-result-title">{value ? "한 달 전기요금은 이 범위에서 줄어들 수 있어요" : "계산 결과"}</h2>
        {!value && !error ? <div className={styles.emptyState}>지역, 월 사용량, 설치 용량을 넣고 계산하면 설치 전후 요금 범위를 보여드립니다.</div> : null}
        {value ? (
          <>
            <dl className={styles.metrics}>
              <div className={styles.primaryMetric}><dt>예상 월 절감액</dt><dd>{won.format(value.monthlySavingsRangeWon.min)}~{won.format(value.monthlySavingsRangeWon.max)}원</dd></div>
              <div><dt>설치 전 예상 요금</dt><dd>{won.format(value.beforeBillWon)}원</dd></div>
              <div><dt>설치 후 예상 요금</dt><dd>{won.format(value.afterBillRangeWon.min)}~{won.format(value.afterBillRangeWon.max)}원</dd></div>
              <div><dt>{REGIONS[region].label} 중심 기준 예상 발전량</dt><dd>{generationKwh === null ? "확인된 정보 없음" : `${number.format(generationKwh)}kWh / ${month}월`}</dd></div>
            </dl>
            <div className={styles.notice}>
              <strong>왜 범위로 보여주나요?</strong>
              <p>태양광이 발전하는 시간과 집에서 전기를 쓰는 시간이 얼마나 겹치는지에 따라 실제 절감액이 달라집니다. 시간대별 사용량을 모르는 상태에서 자가소비율을 임의로 정하지 않았습니다.</p>
            </div>
            <div className={styles.method}>
              <h3>계산 기준과 출처</h3>
              <p>발전량은 선택한 지역의 중심 좌표와 JRC PVGIS 5.3을 사용합니다. 간단 계산에서는 PVGIS 검증 설정인 시스템 손실 14%, 지평선 반영, PVGIS-SARAH3와 최적 경사·방위 계산을 적용합니다.</p>
              <p>전기요금은 2026년 3분기 한국전력 주택용 저압 표준요금 모델을 사용합니다.</p>
              <p>PVGIS 검증일: {generationReferenceDate ?? "확인된 정보 없음"}</p>
              <p>한국전력 요금 기준일: {result.metadata.referenceDate ?? "확인된 정보 없음"}</p>
              <p>
                공식 출처: {result.metadata.sources.map((source, index) => (
                  <span key={`${source.label}-${source.url}`}>
                    {index > 0 ? ", " : ""}
                    <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                  </span>
                ))}
                {result.metadata.sources.length > 0 ? ", " : ""}
                <a href="https://re.jrc.ec.europa.eu/pvg_tools/en/" target="_blank" rel="noreferrer">JRC PVGIS 5.3</a>
              </p>
              <Link href="/trust/methodology">SolPlanit 계산 기준 보기</Link>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
