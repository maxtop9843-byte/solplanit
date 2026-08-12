"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateSolar3kwCost,
  type Solar3kwRegionKey,
} from "../../../lib/calculations/solar-3kw-cost";
import styles from "./solar-3kw-cost.module.css";

const REGION_OPTIONS: { value: Solar3kwRegionKey; label: string }[] = [
  { value: "gyeonggi", label: "경기도" },
  { value: "gyeonggi-uijeongbu", label: "경기도 의정부시" },
  { value: "seoul-gwanak", label: "서울특별시 관악구" },
  { value: "other", label: "그 외 지역" },
];

const won = new Intl.NumberFormat("ko-KR");

function formatWon(value: number | null) {
  return value === null ? "확인된 정보 없음" : `${won.format(value)}원`;
}

export default function Solar3kwCostCalculator() {
  const [region, setRegion] = useState<Solar3kwRegionKey>("gyeonggi");
  const result = useMemo(() => calculateSolar3kwCost(region), [region]);

  return (
    <div className={styles.calculator}>
      <div className={styles.fieldGroup}>
        <label htmlFor="solar-3kw-region">설치 지역</label>
        <p id="solar-3kw-region-help">현재 2026년 공식 자료를 확인한 지역부터 제공합니다.</p>
        <select
          id="solar-3kw-region"
          aria-describedby="solar-3kw-region-help"
          value={region}
          onChange={(event) => setRegion(event.target.value as Solar3kwRegionKey)}
        >
          {REGION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <section className={styles.result} aria-live="polite" aria-labelledby="solar-3kw-result-title">
        <p className={styles.resultEyebrow}>3kW / 2026 공식 자료 기준</p>
        <h2 id="solar-3kw-result-title">{result.regionLabel} 설치비 확인 결과</h2>

        <dl className={styles.metrics}>
          <div className={styles.primaryMetric}>
            <dt>{result.officialProjectCostLabel ?? "공식 사업 기준 설치비"}</dt>
            <dd>{formatWon(result.officialProjectCostKrw)}</dd>
          </div>
          <div>
            <dt>확인된 지원액</dt>
            <dd>
              {result.supportLines.length === 0
                ? "확인된 정보 없음"
                : result.supportLines.length === 1 && result.supportLines[0].amountKrw !== null
                  ? `${result.supportLines[0].qualifier === "about" ? "약 " : ""}${formatWon(result.supportLines[0].amountKrw)}`
                  : "지원 조건을 각각 확인하세요"}
            </dd>
          </div>
          <div>
            <dt>계산 가능한 자부담</dt>
            <dd>{formatWon(result.simpleSelfPayKrw)}</dd>
          </div>
        </dl>

        {result.selfPayReason ? <p className={styles.notice}>{result.selfPayReason}</p> : null}

        {result.supportLines.length > 0 ? (
          <div className={styles.supportList}>
            <h3>확인된 지원 내용</h3>
            {result.supportLines.map((line) => (
              <article key={line.id}>
                <div>
                  <strong>{line.label}</strong>
                  <span>
                    {line.amountKrw !== null
                      ? `${line.qualifier === "about" ? "약 " : ""}${formatWon(line.amountKrw)}`
                      : line.ratePercent !== null
                        ? `${line.qualifier === "about" ? "약 " : ""}${line.ratePercent}%`
                        : "지원 기준 확인"}
                  </span>
                </div>
                <a href={line.sourceUrl} target="_blank" rel="noreferrer">공식 출처 보기</a>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <strong>이 지역은 아직 확인된 2026년 지원 정보가 없습니다.</strong>
            <p>다른 지역 금액을 대신 넣지 않습니다. 공식 공고를 확인한 뒤 순서대로 추가합니다.</p>
          </div>
        )}

        <div className={styles.method}>
          <h3>이 숫자는 어떻게 봐야 하나요?</h3>
          <p>경기도의 4,541,000원은 실제 견적 평균이 아니라 2026년 경기도 지원사업에서 정한 3kW 총사업비 상한입니다. 실제 계약 금액은 참여기업과 설치 조건에 따라 달라질 수 있습니다.</p>
          <p>지원사업이 여러 개 보이는 지역은 중복 적용 여부를 확인하기 전까지 합산 자부담액을 만들지 않습니다.</p>
          <p>확인일: {result.referenceDate}</p>
          <Link href="/trust/methodology">SolPlanit 계산 기준 보기</Link>
        </div>
      </section>
    </div>
  );
}
