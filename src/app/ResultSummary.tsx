"use client";

import { useEffect, useMemo, useState } from "react";
import type { CapacityResult } from "../lib/calculations/capacity";
import type { EconomicsResult } from "../lib/calculations/economics";
import "./result-summary.css";

type Goal = "save" | "sell";

type AnimatedNumberProps = {
  value: number;
  maximumFractionDigits?: number;
  prefix?: string;
  suffix?: string;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function AnimatedNumber({ value, maximumFractionDigits = 0, prefix = "", suffix = "" }: AnimatedNumberProps) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 760;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, value]);

  const formatted = useMemo(
    () =>
      displayValue.toLocaleString("ko-KR", {
        maximumFractionDigits,
        minimumFractionDigits: maximumFractionDigits,
      }),
    [displayValue, maximumFractionDigits],
  );

  return <>{prefix}{formatted}{suffix}</>;
}

export default function ResultSummary({
  capacity,
  economics,
  goal,
  onQuote,
}: {
  capacity: CapacityResult;
  economics?: EconomicsResult | null;
  goal: Goal;
  onQuote?: () => void;
}) {
  const benefitLabel = goal === "save" ? "연간 예상 절감액" : "연간 예상 발전 수익";

  return (
    <section className="resultSummary" aria-labelledby="result-summary-heading">
      <div className="resultIntro">
        <p className="sectionKicker">입력 조건 기준 예상값</p>
        <h3 id="result-summary-heading">이 조건이라면 이렇게 예상돼요</h3>
        <p>가장 중요한 결과부터 순서대로 확인하고, 다음 행동을 선택해보세요.</p>
      </div>

      <div className="resultCardGrid">
        <article className="resultCard resultCardPrimary" style={{ "--result-order": 0 } as React.CSSProperties}>
          <span>추천 설치 용량</span>
          <strong><AnimatedNumber value={capacity.installableCapacityKw} maximumFractionDigits={1} suffix="kW" /></strong>
          <small>입력한 면적과 건물 유형 기준</small>
        </article>

        {economics && (
          <>
            <article className="resultCard" style={{ "--result-order": 1 } as React.CSSProperties}>
              <span>연간 예상 발전량</span>
              <strong><AnimatedNumber value={economics.annualGenerationKwh} suffix="kWh" /></strong>
              <small>월평균 {economics.monthlyAverageGenerationKwh.toLocaleString("ko-KR")}kWh</small>
            </article>
            <article className="resultCard" style={{ "--result-order": 2 } as React.CSSProperties}>
              <span>{benefitLabel}</span>
              <strong><AnimatedNumber value={economics.annualBenefit} prefix="₩" /></strong>
              <small>입력한 단가와 가정값 기준</small>
            </article>
            <article className="resultCard" style={{ "--result-order": 3 } as React.CSSProperties}>
              <span>예상 단순 회수기간</span>
              <strong>{economics.paybackYears === null ? "계산 불가" : <AnimatedNumber value={economics.paybackYears} maximumFractionDigits={1} suffix="년" />}</strong>
              <small>금융비용·유지보수비 제외</small>
            </article>
          </>
        )}

        <article className="resultCard" style={{ "--result-order": economics ? 4 : 1 } as React.CSSProperties}>
          <span>예상 패널 수</span>
          <strong><AnimatedNumber value={capacity.panelCount} suffix="장" /></strong>
          <small>패널 1장 {capacity.panelCapacityKw}kW 기준</small>
        </article>
      </div>

      <div className="resultNextAction" role="region" aria-label="다음 행동 안내">
        <div>
          <p className="sectionKicker">다음 단계</p>
          <h4>{economics ? "계산 결과를 바탕으로 견적을 준비해보세요" : "이 용량으로 절감액과 수익을 확인해보세요"}</h4>
          <p>{economics ? "현장 조건을 확인할 전문가에게 계산 결과를 함께 전달하면 비교가 쉬워져요." : "확인한 단가와 조건을 입력하면 발전량, 절감액 또는 수익, 회수기간을 계산할 수 있어요."}</p>
        </div>
        {economics && <button type="button" className="primaryButton resultQuoteButton" onClick={onQuote} disabled={!onQuote}>내 조건으로 무료 견적받기</button>}
      </div>
    </section>
  );
}
