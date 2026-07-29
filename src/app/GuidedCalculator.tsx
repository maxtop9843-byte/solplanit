"use client";

import { useCallback, useState } from "react";
import type { GeoPoint } from "../lib/maps/types";
import MapLocationPicker, { DEFAULT_SOLPLANIT_LOCATION } from "./MapLocationPicker";

const buildingTypes = ["주택", "상가·건물", "공장·창고", "토지"];

export default function GuidedCalculator() {
  const [step, setStep] = useState(1);
  const [building, setBuilding] = useState("주택");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState<GeoPoint>(DEFAULT_SOLPLANIT_LOCATION);
  const [goal, setGoal] = useState<"save" | "sell" | "">("");
  const [error, setError] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const updateLocation = useCallback((point: GeoPoint) => setLocation(point), []);

  const next = () => {
    setError("");
    if (step === 1 && !building) return setError("설치할 건물 유형을 선택해주세요.");
    if (step === 2 && (!area || Number(area) <= 0)) return setError("0보다 큰 설치 면적을 입력해주세요.");
    if (step === 3 && (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude))) return setError("올바른 위도와 경도를 입력해주세요.");
    if (step === 4 && !goal) return setError("계산 목적을 선택해주세요.");
    if (step < 4) setStep((current) => current + 1);
    else setIsReviewing(true);
  };

  const questions = [
    "어디에 설치할 예정인가요?",
    "태양광을 설치할 공간은 얼마나 되나요?",
    "설치 위치를 지도에서 선택해주세요",
    "태양광으로 무엇을 기대하시나요?",
  ];

  const locationLabel = `위도 ${location.latitude.toFixed(4)} · 경도 ${location.longitude.toFixed(4)}`;
  const summary = `${building} · ${area}m² · ${locationLabel} · ${goal === "save" ? "전기요금 절감" : "발전 수익"}`;

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
          <small>주소 검색 서비스가 없어도 선택한 좌표는 이후 발전량 분석에 그대로 사용할 수 있어요.</small>
        </div>
        <div className="calculatorActions">
          <button className="secondaryButton" type="button" onClick={() => setIsReviewing(false)}>수정하기</button>
          <button className="primaryButton panelButton" type="button" disabled aria-disabled="true">계산 기능 준비 중</button>
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

      {step === 1 && <fieldset><legend>{questions[0]}</legend><div className="typeGrid">{buildingTypes.map((type) => <label key={type} className="typeOption"><input type="radio" name="building" checked={building === type} onChange={() => setBuilding(type)} /><span>{type}</span></label>)}</div></fieldset>}

      {step === 2 && <fieldset><legend>{questions[1]}</legend><label className="inputField"><span>설치 가능 면적</span><div><input inputMode="decimal" type="number" min="1" value={area} onChange={(event) => setArea(event.target.value)} aria-describedby="area-help" /><b>m²</b></div><small id="area-help">옥상이나 토지에서 실제로 사용할 수 있는 대략적인 면적을 입력하세요.</small></label></fieldset>}

      {step === 3 && <fieldset><legend>{questions[2]}</legend><MapLocationPicker value={location} onChange={updateLocation} /></fieldset>}

      {step === 4 && <fieldset><legend>{questions[3]}</legend><div className="goalGrid"><label className="typeOption"><input type="radio" name="goal" checked={goal === "save"} onChange={() => setGoal("save")} /><span><strong>전기요금 절감</strong><small>생산한 전기를 건물에서 직접 사용해요.</small></span></label><label className="typeOption"><input type="radio" name="goal" checked={goal === "sell"} onChange={() => setGoal("sell")} /><span><strong>발전 수익 확인</strong><small>생산한 전기를 판매하는 경우를 살펴봐요.</small></span></label></div></fieldset>}

      {error && <p className="formError" role="alert">{error}</p>}
      <div className="calculatorActions">{step > 1 && <button className="secondaryButton" type="button" onClick={() => { setError(""); setStep((current) => current - 1); }}>이전</button>}<button className="primaryButton panelButton" type="button" onClick={next}>{step === 4 ? "입력 내용 확인하기" : "다음 단계"}</button></div>
      <p className="calculatorSummary">{building}{area ? ` · ${area}m²` : ""}{step >= 3 ? ` · ${locationLabel}` : ""}{goal ? ` · ${goal === "save" ? "전기요금 절감" : "발전 수익"}` : ""}</p>
    </div>
  );
}
