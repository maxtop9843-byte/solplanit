"use client";

import { useEffect, useRef, useState } from "react";
import type { PvgisProxyResult } from "@/lib/pvgis";
import { createPvgisMonthlyGenerationResult } from "@/lib/calculations/pvgis-monthly-generation";
import {
  calculateResidentialBillSavingsRange,
  type ResidentialBillSavingsRangeValue,
} from "@/lib/calculations/residential-bill-savings-range";
import styles from "./bill-savings.module.css";

const REGIONS = [
  { code: "seoul", label: "서울", latitude: 37.5665, longitude: 126.978 },
  { code: "busan", label: "부산", latitude: 35.1796, longitude: 129.0756 },
  { code: "daegu", label: "대구", latitude: 35.8714, longitude: 128.6014 },
  { code: "incheon", label: "인천", latitude: 37.4563, longitude: 126.7052 },
  { code: "gwangju", label: "광주", latitude: 35.1595, longitude: 126.8526 },
  { code: "daejeon", label: "대전", latitude: 36.3504, longitude: 127.3845 },
  { code: "ulsan", label: "울산", latitude: 35.5384, longitude: 129.3114 },
  { code: "jeju", label: "제주", latitude: 33.4996, longitude: 126.5312 },
] as const;

const MONTHS = [7, 8, 9] as const;
const SYSTEM_LOSS_PERCENT = 14;
const REPRESENTATIVE_TILT_DEGREES = 30;
const REPRESENTATIVE_AZIMUTH_DEGREES = 0;

type ResultView = {
  regionLabel: string;
  month: number;
  capacityKw: number;
  monthlyGenerationKwh: number;
  savings: ResidentialBillSavingsRangeValue;
  pvgisRetrievedAt: string;
  kepcoReferenceDate?: string;
  kepcoSources: ReadonlyArray<{ label: string; url: string }>;
};

const formatWon = (value: number) => `${Math.round(value).toLocaleString("ko-KR")}원`;
const formatKwh = (value: number) => `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}kWh`;

export default function BillSavingsCalculator() {
  const [regionCode, setRegionCode] = useState("");
  const [usage, setUsage] = useState("");
  const [capacity, setCapacity] = useState("3");
  const [month, setMonth] = useState("8");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultView | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  function invalidateResult() {
    setResult(null);
    setError("");
  }

  async function calculate() {
    setError("");
    setResult(null);

    const region = REGIONS.find((item) => item.code === regionCode);
    const monthlyUsageKwh = Number(usage);
    const peakPowerKw = Number(capacity);
    const selectedMonth = Number(month);

    if (!region) {
      setError("지역을 선택해 주세요.");
      return;
    }
    if (!usage.trim() || !Number.isFinite(monthlyUsageKwh) || monthlyUsageKwh < 0) {
      setError("월 전기 사용량을 0 이상의 숫자로 입력해 주세요.");
      return;
    }
    if (!capacity.trim() || !Number.isFinite(peakPowerKw) || peakPowerKw <= 0 || peakPowerKw > 100) {
      setError("설치 용량을 0보다 크고 100kW 이하로 입력해 주세요.");
      return;
    }
    if (!MONTHS.includes(selectedMonth as (typeof MONTHS)[number])) {
      setError("현재 검증된 전기요금 기준은 7월부터 9월까지입니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/pvgis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: region.latitude,
          longitude: region.longitude,
          peakPowerKw,
          systemLossPercent: SYSTEM_LOSS_PERCENT,
          tiltDegrees: REPRESENTATIVE_TILT_DEGREES,
          azimuthDegrees: REPRESENTATIVE_AZIMUTH_DEGREES,
          mountingPosition: "building",
          moduleTechnology: "crystSi",
          useHorizon: true,
          radiationDatabase: "PVGIS-SARAH3",
        }),
      });

      const body: unknown = await response.json();
      if (!response.ok) {
        const apiError = body as { error?: { message?: string } };
        throw new Error(apiError.error?.message ?? "발전량 데이터를 불러오지 못했습니다.");
      }

      const pvgisResult = body as PvgisProxyResult;
      const monthlyGeneration = createPvgisMonthlyGenerationResult(pvgisResult, selectedMonth);
      if (monthlyGeneration.metadata.status !== "verified" || !monthlyGeneration.value) {
        throw new Error(monthlyGeneration.metadata.limitations.at(-1) ?? "월별 발전량을 확인하지 못했습니다.");
      }

      const savingsResult = calculateResidentialBillSavingsRange({
        monthlyUsageKwh,
        monthlySolarGenerationKwh: monthlyGeneration.value.monthlyGenerationKwh,
        month: selectedMonth,
        calculatedAt: new Date().toISOString(),
      });
      if (savingsResult.metadata.status !== "estimated" || !savingsResult.value) {
        throw new Error(savingsResult.metadata.limitations.at(-1) ?? "전기요금 절감 범위를 계산하지 못했습니다.");
      }

      setResult({
        regionLabel: region.label,
        month: selectedMonth,
        capacityKw: peakPowerKw,
        monthlyGenerationKwh: monthlyGeneration.value.monthlyGenerationKwh,
        savings: savingsResult.value,
        pvgisRetrievedAt: pvgisResult.retrievedAt,
        kepcoReferenceDate: savingsResult.metadata.referenceDate,
        kepcoSources: savingsResult.metadata.sources,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "계산하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.calculator} aria-label="태양광 전기요금 절감 계산기">
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void calculate();
        }}
      >
        <div className={styles.field}>
          <label htmlFor="region">지역</label>
          <select id="region" value={regionCode} onChange={(event) => { setRegionCode(event.target.value); invalidateResult(); }}>
            <option value="">선택해 주세요</option>
            {REGIONS.map((region) => <option value={region.code} key={region.code}>{region.label}</option>)}
          </select>
          <small>선택한 지역의 중심 좌표로 PVGIS 발전량을 계산합니다.</small>
        </div>

        <div className={styles.field}>
          <label htmlFor="usage">월 전기 사용량</label>
          <div className={styles.inputWithUnit}>
            <input id="usage" type="number" inputMode="decimal" min="0" step="any" placeholder="예: 350" value={usage} onChange={(event) => { setUsage(event.target.value); invalidateResult(); }} />
            <span>kWh</span>
          </div>
          <small>전기요금 고지서의 월 사용량을 입력해 주세요.</small>
        </div>

        <div className={styles.field}>
          <label htmlFor="capacity">설치 용량</label>
          <div className={styles.inputWithUnit}>
            <input id="capacity" type="number" inputMode="decimal" min="0.1" max="100" step="0.1" value={capacity} onChange={(event) => { setCapacity(event.target.value); invalidateResult(); }} />
            <span>kW</span>
          </div>
          <small>모르면 가정용에서 많이 확인하는 3kW부터 비교해 볼 수 있어요.</small>
        </div>

        <div className={styles.field}>
          <label htmlFor="month">계산할 달</label>
          <select id="month" value={month} onChange={(event) => { setMonth(event.target.value); invalidateResult(); }}>
            {MONTHS.map((value) => <option value={value} key={value}>{value}월</option>)}
          </select>
          <small>현재 한국전력 요금 모델이 검증된 2026년 3분기만 계산합니다.</small>
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.primaryButton} type="submit" disabled={loading}>
          {loading ? "발전량을 확인하고 있어요" : "예상 절감액 계산하기"}
        </button>
      </form>

      <div className={styles.resultPanel}>
        {!result && !loading && (
          <div className={styles.emptyState}>
            <p className={styles.resultEyebrow}>RESULT</p>
            <h2>입력한 조건의 절감 범위를 보여드려요.</h2>
            <p>시간대별 전력 사용을 모르기 때문에 자가소비율을 임의로 정하지 않습니다. 실제 절감액은 범위로 표시합니다.</p>
          </div>
        )}
        {loading && <div className={styles.loadingState} role="status">PVGIS에서 월별 발전량을 확인하고 있습니다.</div>}
        {result && (
          <div ref={resultRef} className={styles.result} role="region" aria-label="계산 결과" aria-live="polite" tabIndex={-1}>
            <p className={styles.resultEyebrow}>{result.regionLabel} / {result.month}월 / {result.capacityKw}kW</p>
            <div className={styles.primaryMetric}>
              <span>월 예상 절감액</span>
              <strong>{formatWon(result.savings.monthlySavingsRangeWon.min)} ~ {formatWon(result.savings.monthlySavingsRangeWon.max)}</strong>
            </div>
            <dl className={styles.metrics}>
              <div><dt>설치 전 예상 전기요금</dt><dd>{formatWon(result.savings.beforeBillWon)}</dd></div>
              <div><dt>설치 후 예상 전기요금</dt><dd>{formatWon(result.savings.afterBillRangeWon.min)} ~ {formatWon(result.savings.afterBillRangeWon.max)}</dd></div>
              <div><dt>PVGIS 예상 발전량</dt><dd>{formatKwh(result.monthlyGenerationKwh)}</dd></div>
              <div><dt>집에서 바로 쓸 수 있는 발전량 범위</dt><dd>{formatKwh(result.savings.selfConsumedSolarRangeKwh.min)} ~ {formatKwh(result.savings.selfConsumedSolarRangeKwh.max)}</dd></div>
            </dl>
            <p className={styles.notice}>발전하는 시간과 전기를 쓰는 시간이 얼마나 겹치는지 알 수 없어 범위로 계산했습니다. 남는 전력의 판매·상계 가치는 포함하지 않았습니다.</p>
            <div className={styles.sources}>
              <h3>출처와 기준</h3>
              <ul>
                <li><a href="https://re.jrc.ec.europa.eu/api/v5_3/PVcalc" target="_blank" rel="noreferrer">JRC PVGIS 5.3</a> · 월별 발전량 · 조회 {new Date(result.pvgisRetrievedAt).toLocaleDateString("ko-KR")}</li>
                {result.kepcoSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>{result.kepcoReferenceDate ? ` · 기준 ${result.kepcoReferenceDate}` : ""}</li>)}
              </ul>
            </div>
            <details className={styles.details}>
              <summary>계산 기준 보기</summary>
              <p>지역 중심 좌표, 결정질 실리콘 모듈, 건물 부착형, 남향 0°, 경사 30°, 시스템 손실 14%, 지평선 음영 반영, PVGIS-SARAH3 조건으로 발전량을 조회합니다. 저장소에서 PVGIS 5.3 입력 매핑을 검증한 대표 조건을 사용합니다.</p>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
