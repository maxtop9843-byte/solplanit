"use client";

import { useCallback, useState } from "react";
import {
  BUILDING_TYPES,
  CAPACITY_METHOD,
  CapacityInputError,
  convertAreaToSquareMeters,
  estimateInstallableCapacity,
  type AreaUnit,
  type BuildingType,
  type CapacityResult,
} from "../lib/calculations/capacity";
import {
  ECONOMICS_METHOD,
  EconomicsInputError,
  calculateSolarEconomics,
  type EconomicsResult,
} from "../lib/calculations/economics";
import type { GeoPoint } from "../lib/maps/types";
import MapLocationPicker, { DEFAULT_SOLPLANIT_LOCATION } from "./MapLocationPicker";
import ResultSummary from "./ResultSummary";

export default function GuidedCalculator() {
  const [step, setStep] = useState(1);
  const [building, setBuilding] = useState<BuildingType>("주택");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("m2");
  const [location, setLocation] = useState<GeoPoint>(DEFAULT_SOLPLANIT_LOCATION);
  const [goal, setGoal] = useState<"save" | "sell" | "">("");
  const [error, setError] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [capacityResult, setCapacityResult] = useState<CapacityResult | null>(null);
  const [economicsResult, setEconomicsResult] = useState<EconomicsResult | null>(null);
  const [showEconomics, setShowEconomics] = useState(false);
  const [dailyHours, setDailyHours] = useState("");
  const [lossRate, setLossRate] = useState("");
  const [costPerKw, setCostPerKw] = useState("");
  const [selfConsumptionRate, setSelfConsumptionRate] = useState("");
  const [electricityValue, setElectricityValue] = useState("");
  const [smpPrice, setSmpPrice] = useState("");
  const [recPrice, setRecPrice] = useState("");
  const [recWeight, setRecWeight] = useState("");
  const updateLocation = useCallback((point: GeoPoint) => setLocation(point), []);

  const numericArea = Number(area);
  const areaUnitLabel = areaUnit === "m2" ? "m²" : "평";
  const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;

  // 라이브 프리뷰용 예상 용량 계산
  const getLiveCapacity = () => {
    if (!building || !area || numericArea <= 0) return null;
    try {
      const result = estimateInstallableCapacity({ buildingType: building, area: numericArea, areaUnit });
      return result.installableCapacityKw;
    } catch {
      return null;
    }
  };

  const next = () => {
    setError("");
    if (step === 1 && !building) return setError("설치할 건물 유형을 선택해주세요.");
    if (step === 2) {
      if (!area || !Number.isFinite(numericArea) || numericArea <= 0) return setError("0보다 큰 설치 면적을 입력해주세요.");
      if (convertAreaToSquareMeters(numericArea, areaUnit) < CAPACITY_METHOD.minimumAreaM2) {
        return setError(`설치 면적은 ${CAPACITY_METHOD.minimumAreaM2}m² 이상 입력해주세요.`);
      }
    }
    if (step === 3 && (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude))) return setError("올바른 위도와 경도를 입력해주세요.");
    if (step === 4 && !goal) return setError("계산 목적을 선택해주세요.");
    if (step < 4) setStep((current) => current + 1);
    else setIsReviewing(true);
  };

  const calculateCapacity = () => {
    setError("");
    try {
      const result = estimateInstallableCapacity({ buildingType: building, area: numericArea, areaUnit });
      setCapacityResult(result);
      setIsReviewing(false);
    } catch (caught) {
      setError(caught instanceof CapacityInputError ? caught.message : "설치 가능 용량을 계산하지 못했어요. 입력값을 확인해주세요.");
    }
  };

  const calculateEconomics = () => {
    if (!capacityResult || !goal) return;
    setError("");
    try {
      const result = calculateSolarEconomics({
        capacityKw: capacityResult.installableCapacityKw,
        goal,
        averageDailyGenerationHours: Number(dailyHours),
        systemLossRate: Number(lossRate) / 100,
        installationCostPerKw: Number(costPerKw),
        selfConsumptionRate: goal === "save" ? Number(selfConsumptionRate) / 100 : undefined,
        electricityValuePerKwh: goal === "save" ? Number(electricityValue) : undefined,
        smpPricePerKwh: goal === "sell" ? Number(smpPrice) : undefined,
        recPricePerRec: goal === "sell" ? Number(recPrice) : undefined,
        recWeight: goal === "sell" ? Number(recWeight) : undefined,
      });
      setEconomicsResult(result);
    } catch (caught) {
      setError(caught instanceof EconomicsInputError ? caught.message : "발전량과 경제성을 계산하지 못했어요. 가정값을 확인해주세요.");
    }
  };

  const questions = [
    "어디에 설치할 예정인가요?",
    "설치 위치를 지도에서 선택해주세요",
    "태양광을 설치할 공간은 얼마나 되나요?",
    "태양광으로 무엇을 기대하시나요?",
  ];

  const locationLabel = `위도 ${location.latitude.toFixed(4)} · 경도 ${location.longitude.toFixed(4)}`;
  const summary = `${building} · ${area}${areaUnitLabel} · ${locationLabel} · ${goal === "save" ? "전기요금 절감" : "발전 수익"}`;

  if (capacityResult && goal) {
    return (
      <div className="calculatorPanel capacityResultPanel" aria-live="polite">
        <div className="stepHeader">
          <span>{economicsResult ? "발전량·경제성 결과" : "설치 가능 용량 결과"}</span>
          <div className="progressTrack" aria-label="계산 완료"><i style={{ width: "100%" }} /></div>
        </div>

        <ResultSummary capacity={capacityResult} economics={economicsResult} goal={goal} />

        {economicsResult ? (
          <>
            {goal === "sell" && <dl className="revenueBreakdown"><div><dt>SMP 수익</dt><dd>{won(economicsResult.annualSmpRevenue)}</dd></div><div><dt>REC 수익</dt><dd>{won(economicsResult.annualRecRevenue)}</dd></div></dl>}
            <details className="assumptionDetails" open>
              <summary>적용한 경제성 가정과 한계</summary>
              <p>입력한 평균 발전시간, 손실률, 전력 가치 또는 SMP·REC 단가, 설치비를 그대로 사용한 시나리오 계산입니다. SolPlanit이 현재 시장가격이나 정책값을 보장하지 않습니다.</p>
              <p>단순 회수기간은 금융비용, 유지보수비, 세금, 출력 제한, 가격 변동과 설비 성능 저하를 포함하지 않습니다.</p>
              <p>방법론 검증일: {economicsResult.methodVersion}</p>
              <ul>{ECONOMICS_METHOD.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
            </details>
          </>
        ) : (
          <>
            <dl className="capacityFacts">
              <div><dt>입력 면적</dt><dd>{capacityResult.inputArea.toLocaleString("ko-KR")} {areaUnitLabel}</dd></div>
              <div><dt>환산 면적</dt><dd>{capacityResult.areaM2.toLocaleString("ko-KR")}m²</dd></div>
              <div><dt>배치 가능 면적</dt><dd>{capacityResult.usableAreaM2.toLocaleString("ko-KR")}m²</dd></div>
              <div><dt>적용 가능 비율</dt><dd>{Math.round(capacityResult.usableAreaRatio * 100)}%</dd></div>
            </dl>
            {showEconomics && (
              <fieldset className="economicsInputs">
                <legend>계산에 사용할 가정값을 입력해주세요</legend>
                <p>현재 시장 단가를 임의로 넣지 않습니다. 계약서, 고지서, 전력거래소·신재생에너지센터에서 확인한 값을 직접 입력해주세요.</p>
                <div className="assumptionGrid">
                  <label><span>평균 일 발전시간</span><input type="number" min="0.01" max="24" step="0.01" value={dailyHours} onChange={(event) => setDailyHours(event.target.value)} /><b>시간/일</b></label>
                  <label><span>시스템 손실률</span><input type="number" min="0" max="100" step="0.1" value={lossRate} onChange={(event) => setLossRate(event.target.value)} /><b>%</b></label>
                  <label><span>kW당 설치비</span><input type="number" min="0" step="1000" value={costPerKw} onChange={(event) => setCostPerKw(event.target.value)} /><b>원/kW</b></label>
                  {goal === "save" ? <><label><span>자가소비율</span><input type="number" min="0" max="100" step="0.1" value={selfConsumptionRate} onChange={(event) => setSelfConsumptionRate(event.target.value)} /><b>%</b></label><label><span>자가소비 전력 가치</span><input type="number" min="0" step="0.1" value={electricityValue} onChange={(event) => setElectricityValue(event.target.value)} /><b>원/kWh</b></label></> : <><label><span>SMP 단가</span><input type="number" min="0" step="0.1" value={smpPrice} onChange={(event) => setSmpPrice(event.target.value)} /><b>원/kWh</b></label><label><span>REC 단가</span><input type="number" min="0" step="1" value={recPrice} onChange={(event) => setRecPrice(event.target.value)} /><b>원/REC</b></label><label><span>REC 가중치</span><input type="number" min="0" step="0.01" value={recWeight} onChange={(event) => setRecWeight(event.target.value)} /><b>배</b></label></>}
                </div>
                {error && <p className="formError" role="alert">{error}</p>}
                <button className="primaryButton panelButton" type="button" onClick={calculateEconomics}>발전량과 경제성 계산하기</button>
              </fieldset>
            )}
            <details className="assumptionDetails">
              <summary>설치 용량 계산 가정과 한계 보기</summary>
              <p>패널 1장 {capacityResult.panelCapacityKw}kW, 패널·통로 포함 장당 {capacityResult.panelFootprintM2}m²를 적용했어요. 건물 유형별로 장애물과 유지보수 공간을 고려한 배치 가능 비율을 다르게 적용합니다.</p>
              <p>지붕 형태, 음영, 구조 안전, 이격거리, 소방·전기 기준과 실제 모듈 규격에 따라 결과가 달라질 수 있으며 설치 가능 여부를 보장하지 않아요.</p>
              <p>방법론 검증일: {capacityResult.methodVersion}</p>
              <ul>{CAPACITY_METHOD.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
            </details>
          </>
        )}
        <p className="disclaimer">예상 결과이며 실제 발전량, 절감액, 수익과 설치 가능 여부는 현장 조건, 계약, 시장가격 및 전문가 검토에 따라 달라질 수 있어요.</p>
        <div className="calculatorActions">
          <button className="secondaryButton" type="button" onClick={() => { setEconomicsResult(null); setShowEconomics(false); setCapacityResult(null); setIsReviewing(true); }}>입력 수정하기</button>
          {!economicsResult && !showEconomics && <button className="primaryButton panelButton" type="button" onClick={() => setShowEconomics(true)}>{goal === "save" ? "절감액 계산하기" : "발전 수익 계산하기"}</button>}
          {economicsResult && <button className="primaryButton panelButton" type="button" onClick={() => setEconomicsResult(null)}>가정값 다시 계산하기</button>}
        </div>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="calculatorPanel" aria-live="polite">
        <div className="stepHeader"><span>입력 내용 확인</span><div className="progressTrack" aria-label="4단계 입력 완료"><i style={{ width: "100%" }} /></div></div>
        <div className="calculatorReview" role="status"><p className="sectionKicker">계산 전 마지막 확인</p><h3>입력한 조건이 맞나요?</h3><p>{summary}</p><small>선택한 건물 유형과 면적을 기준으로 패널 수와 설치 가능 용량을 먼저 계산해요.</small></div>
        {error && <p className="formError" role="alert">{error}</p>}
        <div className="calculatorActions"><button className="secondaryButton" type="button" onClick={() => setIsReviewing(false)}>수정하기</button><button className="primaryButton panelButton" type="button" onClick={calculateCapacity}>설치 가능 용량 계산하기</button></div>
      </div>
    );
  }

  const liveCapacity = getLiveCapacity();

  return (
    <div className="calculatorPanel calculatorPanelWizard" aria-live="polite">
      <div className="stepHeader">
        <div className="stepIndicator">
          <span className="stepNumber">{step}/4</span>
          <span className="stepQuestion">{questions[step - 1]}</span>
        </div>
        <div className="progressTrack" aria-label={`4단계 중 ${step}단계`}><i style={{ width: `${step * 25}%` }} /></div>
        <div className="stepDots" aria-hidden="true">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`stepDot ${num <= step ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="calculatorContent">
        <div className="calculatorMain">
          {step === 1 && <fieldset><legend>{questions[0]}</legend><div className="typeGrid">{BUILDING_TYPES.map((type) => <label key={type} className="typeOption"><input type="radio" name="building" checked={building === type} onChange={() => setBuilding(type)} /><span>{type}</span></label>)}</div></fieldset>}
          {step === 2 && <fieldset><legend>{questions[2]}</legend><label className="inputField"><span>설치 가능 면적</span><div><input inputMode="decimal" type="number" min="0" value={area} onChange={(event) => setArea(event.target.value)} aria-describedby="area-help" /><div className="unitToggle" aria-label="면적 단위">{(["m2", "pyeong"] as const).map((unit) => <button key={unit} type="button" aria-pressed={areaUnit === unit} onClick={() => setAreaUnit(unit)}>{unit === "m2" ? "m²" : "평"}</button>)}</div></div><small id="area-help">정확하지 않아도 괜찮아요. 옥상이나 토지에서 실제로 사용할 수 있는 대략적인 면적을 입력해주세요.</small></label></fieldset>}
          {step === 3 && <fieldset><legend>{questions[1]}</legend><MapLocationPicker value={location} onChange={updateLocation} /></fieldset>}
          {step === 4 && <fieldset><legend>{questions[3]}</legend><div className="goalGrid"><label className="typeOption"><input type="radio" name="goal" checked={goal === "save"} onChange={() => setGoal("save")} /><span><strong>전기요금 절감</strong><small>생산한 전기를 건물에서 직접 사용해요.</small></span></label><label className="typeOption"><input type="radio" name="goal" checked={goal === "sell"} onChange={() => setGoal("sell")} /><span><strong>발전 수익 확인</strong><small>생산한 전기를 판매하는 경우를 살펴봐요.</small></span></label></div></fieldset>}
          {error && <p className="formError" role="alert">{error}</p>}
          <div className="calculatorActions">{step > 1 && <button className="secondaryButton" type="button" onClick={() => { setError(""); setStep((current) => current - 1); }}>이전</button>}<button className="primaryButton panelButton" type="button" onClick={next}>{step === 4 ? "입력 내용 확인하기" : "다음 단계"}</button></div>
          <p className="calculatorSummary">{building}{area ? ` · ${area}${areaUnitLabel}` : ""}{step >= 3 ? ` · ${locationLabel}` : ""}{goal ? ` · ${goal === "save" ? "전기요금 절감" : "발전 수익"}` : ""}</p>
        </div>

        <aside className="calculatorPreview">
          <div className="previewCard">
            <div className="previewLabel">예상 설치 용량</div>
            <div className="previewValue">
              {liveCapacity !== null ? (
                <>
                  <span className="previewNumber">{liveCapacity.toFixed(1)}</span>
                  <span className="previewUnit">kW</span>
                </>
              ) : (
                <span className="previewPlaceholder">—</span>
              )}
            </div>
            <div className="previewHint">실시간 업데이트</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
