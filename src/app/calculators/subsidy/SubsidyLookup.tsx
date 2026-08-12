"use client";

import { useMemo, useState } from "react";
import { getResidentialSolarSupport2026, type ResidentialSolarSupportRecord } from "../../../lib/support/residentialSolarSupport2026";
import styles from "./subsidy.module.css";

type RegionKey = "gyeonggi" | "gyeonggi-uijeongbu" | "seoul-gwanak" | "other";

const REGION_OPTIONS: { value: RegionKey; label: string }[] = [
  { value: "gyeonggi", label: "경기도" },
  { value: "gyeonggi-uijeongbu", label: "경기도 의정부시" },
  { value: "seoul-gwanak", label: "서울특별시 관악구" },
  { value: "other", label: "그 외 지역" },
];

const REGION_QUERY: Record<RegionKey, { province: string; district?: string }> = {
  gyeonggi: { province: "경기도" },
  "gyeonggi-uijeongbu": { province: "경기도", district: "의정부시" },
  "seoul-gwanak": { province: "서울특별시", district: "관악구" },
  other: { province: "미확인 지역" },
};

function formatCapacity(program: ResidentialSolarSupportRecord) {
  if (program.capacity.minKw === program.capacity.maxKw) return `${program.capacity.maxKw}kW`;
  if (program.capacity.minKw === 0) return `${program.capacity.maxKw}kW 이하`;
  return `${program.capacity.minKw}~${program.capacity.maxKw}kW`;
}

function formatSupport(program: ResidentialSolarSupportRecord) {
  if (!program.support) return "지원 조건은 공식 공고에서 확인하세요.";
  if (program.support.kind === "fixed") {
    return `${new Intl.NumberFormat("ko-KR").format(program.support.amountKrw)}원 지원`;
  }
  const qualifier = program.support.qualifier === "about" ? "약 " : "";
  const cap = program.support.projectCostCapKrw
    ? ` · 사업비 상한 ${new Intl.NumberFormat("ko-KR").format(program.support.projectCostCapKrw)}원`
    : "";
  return `${qualifier}${program.support.ratePercent}% 지원${cap}`;
}

export default function SubsidyLookup() {
  const [region, setRegion] = useState<RegionKey>("gyeonggi");
  const result = useMemo(() => {
    const query = REGION_QUERY[region];
    return getResidentialSolarSupport2026({ ...query, capacityKw: 3 });
  }, [region]);

  return (
    <section className={styles.lookup} aria-labelledby="subsidy-result-title">
      <div className={styles.fieldGroup}>
        <label htmlFor="subsidy-region">설치 지역</label>
        <p id="subsidy-region-help">현재 2026년 공식 자료를 확인한 지역부터 제공합니다. 조회 기준 용량은 주택용 3kW입니다.</p>
        <select
          id="subsidy-region"
          aria-describedby="subsidy-region-help"
          value={region}
          onChange={(event) => setRegion(event.target.value as RegionKey)}
        >
          {REGION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <div className={styles.result} aria-live="polite">
        <p className={styles.eyebrow}>2026 RESIDENTIAL SOLAR SUPPORT</p>
        <h2 id="subsidy-result-title">
          {result.status === "available" ? `확인된 지원 ${result.programs.length}건` : "확인된 정보 없음"}
        </h2>

        {result.status === "available" ? (
          <div className={styles.programList}>
            {result.programs.map((program) => (
              <article className={styles.program} key={program.id}>
                <div className={styles.programHeader}>
                  <div>
                    <p>{program.source.organization}</p>
                    <h3>{formatSupport(program)}</h3>
                  </div>
                  <span>{formatCapacity(program)}</span>
                </div>
                <dl>
                  <div><dt>신청 대상</dt><dd>{program.target}</dd></div>
                  <div><dt>신청 기간</dt><dd>{program.applicationPeriod ?? "공식 공고에서 확인"}</dd></div>
                  <div><dt>확인일</dt><dd>{program.checkedAt}</dd></div>
                </dl>
                {program.notes?.length ? (
                  <ul>{program.notes.map((note) => <li key={note}>{note}</li>)}</ul>
                ) : null}
                <a href={program.source.url} target="_blank" rel="noreferrer">{program.source.title} 원문 보기</a>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} role="status">
            <strong>이 지역은 아직 확인된 2026년 지원 정보가 없습니다.</strong>
            <p>지원이 없다는 뜻은 아닙니다. 다른 지역 금액을 대신 적용하지 않으며, 공식 자료가 확인되면 추가합니다.</p>
          </div>
        )}

        <p className={styles.disclaimer}>지원사업은 예산 소진, 대상 조건, 다른 사업과의 중복 가능 여부에 따라 실제 적용이 달라질 수 있습니다. 지원액을 합산해 확정 자부담으로 표시하지 않습니다.</p>
      </div>
    </section>
  );
}
