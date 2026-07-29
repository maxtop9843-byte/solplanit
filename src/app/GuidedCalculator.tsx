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
import type { GeoPoint } from "../lib/maps/types";
import MapLocationPicker, { DEFAULT_SOLPLANIT_LOCATION } from "./MapLocationPicker";

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
  const updateLocation = useCallback((point: GeoPoint) => setLocation(point), []);

  const numericArea = Number(area);
  const areaUnitLabel = areaUnit === "m2" ? "m²" : "평";

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

  const questions = [
    "어디에 설치할 예정인가요?",
    "태양광을 설치할 공간은 얼마나 되나요?",
    "설치 위치를 지도에서 선택해주세요",
    "태양광으로 무엇을 기대하시나요?",
  ];

  const locationLabel = `위도 ${location.latitude.toFixed(4)} · 경도 ${location.longitude.toFixed(4)}`;
  const summary = `${building} · ${area}${areaUnitLabel} · ${locationLabel} · ${goal === "save" ? "전기요금 절감" : "발전 수익"}`;

  if (capacityResult) {
    return (
      <div className="calculatorPanel capacityResultPanel" aria-live="polite">
        <div className="stepHeader">
          <span>설치 가능 용량 결과</span>
          <div className="progressTrack" aria-label="설치 가능 용량 계산 완료"><i style={{ width: "100%" }} /></div>
        </div>
        <div className="capacityHeadline" role="status">
          <p className="sectionKicker">입력 조건 기준 예상값</p>
          <h3>약 {capacityResult.installableCapacityKw.toLocaleString("ko-KR")}kW를 설치할 수 있어요</h3>
          <p>예상 패널 수 {capacityResult.panelCount.toLocaleString("ko-KR")}장</p>
        </div>
        <dl className="capacityFacts">
          <div><dt>입력 면적</dt><dd>{capacityResult.inputArea.toLocaleString("ko-KR")} {areaUnitLabel}</dd></div>
          <div><dt>환산 면적</dt><dd>{capacityResult.areaM2.toLocaleString("ko-KR")}m²</dd></div>
          <div><dt>배치 가능 면적</dt><dd>{capacityResult.usableAreaM2.toLocaleString("ko-KR")}m²</dd></div>
          <div><dt>적용 가능 비율</dt><dd>{Math.round(capacityResult.usableAreaRatio * 100)}%</dd></div>
        </dl>
        <details className="assumptionDetails">
          <summary>계산 가정과 한계 보기</summary>
          <p>패널 1장 {capacityResult.panelCapacityKw}kW, 패널·통로 포함 장당 {capacityResult.panelFootprintM2}m²를 적용했어요. 건물 유형별로 장애물과 유지보수 공간을 고려한 배치 가능 비율을 다르게 적용합니다.</p>
          <p>지붕 형태, 음영, 구조 안전, 이격거리, 소방·전기 기준과 실제 모듈 규격에 따라 결과가 달라질 수 있으며 설치 가능 여부를 보장하지 않아요.</p>
          <p>방법론 검증일: {capacityResult.methodVersion}</p>
          <ul>{CAPACITY_METHOD.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
        </details>
        <p className="disclaimer">입력한 정보를 바탕으로 계산한 예상 결과입니다. 실제 설치 가능 여부와 비용은 현장 조건 및 전문가 검토에 따라 달라질 수 있어요.</p>
        <div className="calculatorActions">
          <button className="secondaryButton" type="button" onClick={() => { setCapacityResult(null); setIsReviewing(true); }}>입력 수정하기</button>
          <button className="primaryButton panelButton" type="button" disabled aria-disabled="true">수익·절감 계산 준비 중</button>
        </div>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="calculatorPanel" aria-live="polite">
        <div className="stepHeader">
          <span>입력 내용 확인</span>
          <div className="progressTrack" aria-label="4단계 입력 완료"><i style={{ width: "100%" }} /></div>
        </div>
        <div className="calculatorReview" role="status">
          <p className="sectionKicker">계산 전 마지막 확인</p>
          <h3>입력한 조건이 맞나요?</h3>
          <p>{summary}</p>
          <small>선택한 건물 유형과 면적을 기준으로 패널 수와 설치 가능 용량을 먼저 계산해요.</small>
        </div>
        {error && <p className="formError" role="alert">{error}</p>}
        <div className="calculatorActions">
          <button className="secondaryButton" type="button" onClick={() => setIsReviewing(false)}>수정하기</button>
          <button className="primaryButton panelButton" type="button" onClick={calculateCapacity}>설치 가능 용량 계산하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="calculatorPanel" aria-live="polite">
      <div className="stepHeader">
        <span>{step} / 4 · {questions[step - 1]}</span>
        <div className="progressTrack" aria-label={`4단계 중 ${step}단계`}><i style={{ width: `${step * 25}%` }} /></div>
      </div>

      {step === 1 && <fieldset><legend>{questions[0]}</legend><div className="typeGrid">{BUILDING_TYPES.map((type) => <label key={type} className="typeOption"><input type="radio" name="building" checked={building === type} onChange={() => setBuilding(type)} /><span>{type}</span></label>)}</div></fieldset>}

      {step === 2 && <fieldset><legend>{questions[1]}</legend><label className="inputField"><span>설치 가능 면적</span><div><input inputMode="decimal" type="number" min="0" value={area} onChange={(event) => setArea(event.target.value)} aria-describedby="area-help" /><div className="unitToggle" aria-label="면적 단위">{(["m2", "pyeong"] as const).map((unit) => <button key={unit} type="button" aria-pressed={areaUnit === unit} onClick={() => setAreaUnit(unit)}>{unit === "m2" ? "m²" : "평"}</button>)}</div></div><small id="area-help">정확하지 않아도 괜찮아요. 옥상이나 토지에서 실제로 사용할 수 있는 대략적인 면적을 입력해주세요.</small></label></fieldset>}

      {step === 3 && <fieldset><legend>{questions[2]}</legend><MapLocationPicker value={location} onChange={updateLocation} /></fieldset>}

      {step === 4 && <fieldset><legend>{questions[3]}</legend><div className="goalGrid"><label className="typeOption"><input type="radio" name="goal" checked={goal === "save"} onChange={() => setGoal("save")} /><span><strong>전기요금 절감</strong><small>생산한 전기를 건물에서 직접 사용해요.</small></span></label><label className="typeOption"><input type="radio" name="goal" checked={goal === "sell"} onChange={() => setGoal("sell")} /><span><strong>발전 수익 확인</strong><small>생산한 전기를 판매하는 경우를 살펴봐요.</small></span></label></div></fieldset>}

      {error && <p className="formError" role="alert">{error}</p>}
      <div className="calculatorActions">{step > 1 && <button className="secondaryButton" type="button" onClick={() => { setError(""); setStep((current) => current - 1); }}>이전</button>}<button className="primaryButton panelButton" type="button" onClick={next}>{step === 4 ? "입력 내용 확인하기" : "다음 단계"}</button></div>
      <p className="calculatorSummary">{building}{area ? ` · ${area}${areaUnitLabel}` : ""}{step >= 3 ? ` · ${locationLabel}` : ""}{goal ? ` · ${goal === "save" ? "전기요금 절감" : "발전 수익"}` : ""}</p>
    </div>
  );
}
