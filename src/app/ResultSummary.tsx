"use client";

import Link from "next/link";
import type { CapacityResult } from "../lib/calculations/capacity";
import type { EconomicsResult } from "../lib/calculations/economics";
import SaveCalculationButton from "./SaveCalculationButton";
import "./result-summary.css";

type Goal = "save" | "sell";

// 카운트업 애니메이션은 쓰지 않는다. 없는 정밀함을 연출하는 것이라 이 사이트의 취지에 반한다.
function formatNumber(value: number, fractionDigits = 0) {
  return value.toLocaleString("ko-KR", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
}

export default function ResultSummary({ capacity, economics, goal }: { capacity: CapacityResult; economics?: EconomicsResult | null; goal: Goal }) {
  const benefitLabel = goal === "save" ? "연간 예상 절감액" : "연간 예상 발전 수익";
  const sharedParameters = economics ? {
    capacity: String(capacity.installableCapacityKw),
    panels: String(capacity.panelCount),
    generation: String(economics.annualGenerationKwh),
    benefit: String(economics.annualBenefit),
    payback: economics.paybackYears === null ? "null" : String(economics.paybackYears),
    goal,
  } : null;
  const proHref = sharedParameters ? `/pro?${new URLSearchParams({ source: "general", ...sharedParameters }).toString()}` : null;
  const accountHref = "/account";

  return (
    <section className="resultSummary" aria-labelledby="result-summary-heading">
      <div className="resultIntro">
        <p className="sectionKicker">입력 조건 기준 예상값</p>
        <h3 id="result-summary-heading">이 조건이라면 이렇게 예상돼요</h3>
        <p>가장 중요한 결과부터 순서대로 확인하고, 다음 행동을 선택해보세요.</p>
      </div>

      <div className="resultCardGrid">
        <article className="resultCard resultCardPrimary">
          <span>추천 설치 용량</span>
          <strong>{formatNumber(capacity.installableCapacityKw, 1)}kW</strong>
        </article>
        {economics && <>
          <article className="resultCard"><span>연간 예상 발전량</span><strong>{formatNumber(economics.annualGenerationKwh)}kWh</strong></article>
          <article className="resultCard"><span>{benefitLabel}</span><strong>₩{formatNumber(economics.annualBenefit)}</strong></article>
          <article className="resultCard"><span>예상 단순 회수기간</span><strong>{economics.paybackYears === null ? "계산 불가" : `${formatNumber(economics.paybackYears, 1)}년`}</strong></article>
        </>}
        <article className="resultCard"><span>예상 패널 수</span><strong>{formatNumber(capacity.panelCount)}장</strong></article>
      </div>

      <div className="resultNextAction" role="region" aria-label="다음 행동 안내">
        <div><p className="sectionKicker">다음 단계</p><h4>{economics ? "이 숫자가 어디서 왔는지 확인해보세요" : "이 용량으로 절감액과 수익을 확인해보세요"}</h4><p>{economics ? "계산에 쓰인 데이터 출처와 가정을 그대로 공개합니다. 실제 결과는 현장 조건에 따라 달라질 수 있어요." : "확인한 단가와 조건을 입력하면 발전량, 절감액 또는 수익, 회수기간을 계산할 수 있어요."}</p></div>
        {economics && sharedParameters && <SaveCalculationButton calculation={{ href: proHref ?? "/pro", capacityKw: capacity.installableCapacityKw, panelCount: capacity.panelCount, annualGenerationKwh: economics.annualGenerationKwh, annualBenefit: economics.annualBenefit, paybackYears: economics.paybackYears, goal }} />}
        {proHref && <Link className="secondaryButton panelButton" href={proHref}>전문가 분석으로 이어가기</Link>}
        <Link className="secondaryButton panelButton" href={accountHref}>내 작업 보기</Link>
      </div>
    </section>
  );
}
