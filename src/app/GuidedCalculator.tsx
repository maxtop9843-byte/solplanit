"use client";

import { useState } from "react";

const buildingTypes = ["주택", "상가·건물", "공장·창고", "토지"];
const regions = ["서울·경기", "강원", "충청", "전라", "경상", "제주"];

export default function GuidedCalculator() {
  const [step, setStep] = useState(1);
  const [building, setBuilding] = useState("주택");
  const [area, setArea] = useState("");
  const [region, setRegion] = useState("");
  const [goal, setGoal] = useState<"save" | "sell" | "">("");
  const [error, setError] = useState("");

  const next = () => {
    setError("");
    if (step === 1 && !building) return setError("설치할 건물 유형을 선택해주세요.");
    if (step === 2 && (!area || Number(area) <= 0)) return setError("0보다 큰 설치 면적을 입력해주세요.");
    if (step === 3 && !region) return setError("설치 지역을 선택해주세요.");
    if (step === 4 && !goal) return setError("계산 목적을 선택해주세요.");
    if (step < 4) setStep((current) => current + 1);
  };

  const questions = [
    "어디에 설치할 예정인가요?",
    "태양광을 설치할 공간은 얼마나 되나요?",
    "어느 지역에 설치할 예정인가요?",
    "태양광으로 무엇을 기대하시나요?",
  ];

  return (
    <div className="calculatorPanel" aria-live="polite">
      <div className="stepHeader">
        <span>{step} / 4 · {questions[step - 1]}</span>
        <div className="progressTrack" aria-label={`4단계 중 ${step}단계`}><i style={{ width: `${step * 25}%` }} /></div>
      </div>

      {step === 1 && <fieldset><legend>{questions[0]}</legend><div className="typeGrid">{buildingTypes.map((type) => <label key={type} className="typeOption"><input type="radio" name="building" checked={building === type} onChange={() => setBuilding(type)} /><span>{type}</span></label>)}</div></fieldset>}

      {step === 2 && <fieldset><legend>{questions[1]}</legend><label className="inputField"><span>설치 가능 면적</span><div><input inputMode="decimal" type="number" min="1" value={area} onChange={(event) => setArea(event.target.value)} aria-describedby="area-help" /><b>m²</b></div><small id="area-help">옥상이나 토지에서 실제로 사용할 수 있는 대략적인 면적을 입력하세요.</small></label></fieldset>}

      {step === 3 && <fieldset><legend>{questions[2]}</legend><div className="typeGrid">{regions.map((item) => <label key={item} className="typeOption"><input type="radio" name="region" checked={region === item} onChange={() => setRegion(item)} /><span>{item}</span></label>)}</div></fieldset>}

      {step === 4 && <fieldset><legend>{questions[3]}</legend><div className="goalGrid"><label className="typeOption"><input type="radio" name="goal" checked={goal === "save"} onChange={() => setGoal("save")} /><span><strong>전기요금 절감</strong><small>생산한 전기를 건물에서 직접 사용해요.</small></span></label><label className="typeOption"><input type="radio" name="goal" checked={goal === "sell"} onChange={() => setGoal("sell")} /><span><strong>발전 수익 확인</strong><small>생산한 전기를 판매하는 경우를 살펴봐요.</small></span></label></div></fieldset>}

      {error && <p className="formError" role="alert">{error}</p>}
      <div className="calculatorActions">{step > 1 && <button className="secondaryButton" type="button" onClick={() => { setError(""); setStep((current) => current - 1); }}>이전</button>}<button className="primaryButton panelButton" type="button" onClick={next}>{step === 4 ? "입력 내용 확인하기" : "다음 단계"}</button></div>
      <p className="calculatorSummary">{building}{area ? ` · ${area}m²` : ""}{region ? ` · ${region}` : ""}{goal ? ` · ${goal === "save" ? "전기요금 절감" : "발전 수익"}` : ""}</p>
    </div>
  );
}
