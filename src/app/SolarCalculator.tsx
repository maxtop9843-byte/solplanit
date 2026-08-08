"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BUILDING_TYPES,
  CAPACITY_METHOD,
  CapacityInputError,
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
import SaveCalculationButton from "./SaveCalculationButton";

type Goal = "save" | "sell";

const num = (value: number, digits = 0) =>
  value.toLocaleString("ko-KR", { maximumFractionDigits: digits, minimumFractionDigits: digits });

export default function SolarCalculator() {
  const [building, setBuilding] = useState<BuildingType>("주택");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("m2");
  const [capacity, setCapacity] = useState<CapacityResult | null>(null);
  const [error, setError] = useState("");

  const [goal, setGoal] = useState<Goal>("save");
  const [dailyHours, setDailyHours] = useState("");
  const [lossRate, setLossRate] = useState("");
  const [costPerKw, setCostPerKw] = useState("");
  const [selfConsumptionRate, setSelfConsumptionRate] = useState("");
  const [electricityValue, setElectricityValue] = useState("");
  const [smpPrice, setSmpPrice] = useState("");
  const [recPrice, setRecPrice] = useState("");
  const [recWeight, setRecWeight] = useState("");
  const [economics, setEconomics] = useState<EconomicsResult | null>(null);
  const [economicsError, setEconomicsError] = useState("");

  function calculate() {
    setError("");
    setEconomics(null);
    try {
      setCapacity(estimateInstallableCapacity({ buildingType: building, area: Number(area), areaUnit }));
    } catch (caught) {
      setCapacity(null);
      setError(caught instanceof CapacityInputError ? caught.message : "설치 가능 용량을 계산하지 못했어요. 입력값을 확인해주세요.");
    }
  }

  function calculateEconomics() {
    if (!capacity) return;
    setEconomicsError("");
    try {
      setEconomics(calculateSolarEconomics({
        capacityKw: capacity.installableCapacityKw,
        goal,
        averageDailyGenerationHours: Number(dailyHours),
        systemLossRate: Number(lossRate) / 100,
        installationCostPerKw: Number(costPerKw),
        selfConsumptionRate: goal === "save" ? Number(selfConsumptionRate) / 100 : undefined,
        electricityValuePerKwh: goal === "save" ? Number(electricityValue) : undefined,
        smpPricePerKwh: goal === "sell" ? Number(smpPrice) : undefined,
        recPricePerRec: goal === "sell" ? Number(recPrice) : undefined,
        recWeight: goal === "sell" ? Number(recWeight) : undefined,
      }));
    } catch (caught) {
      setEconomics(null);
      setEconomicsError(caught instanceof EconomicsInputError ? caught.message : "발전량과 수익을 계산하지 못했어요. 입력한 값을 확인해주세요.");
    }
  }

  return (
    <div className="tool">
      <div className="toolCard">
        <div className="field">
          <label htmlFor="building">건물 유형</label>
          <select id="building" value={building} onChange={(event) => setBuilding(event.target.value as BuildingType)}>
            {BUILDING_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="area">지붕 면적</label>
          <div className="fieldRow">
            <input
              id="area"
              type="number"
              inputMode="decimal"
              min="0"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              onBlur={() => { if (area && Number(area) <= 0) setError("0보다 큰 면적을 입력해주세요."); }}
              aria-describedby="area-help"
            />
            <div className="unitToggle" role="group" aria-label="면적 단위">
              {(["m2", "pyeong"] as const).map((unit) => (
                <button key={unit} type="button" aria-pressed={areaUnit === unit} onClick={() => setAreaUnit(unit)}>
                  {unit === "m2" ? "m²" : "평"}
                </button>
              ))}
            </div>
          </div>
          <small id="area-help">정확하지 않아도 됩니다. 실제로 패널을 올릴 수 있는 대략의 면적을 넣어주세요.</small>
        </div>

        {error && <p className="fieldError" role="alert">{error}</p>}

        <button className="primaryButton" type="button" onClick={calculate}>계산하기</button>
      </div>

      {capacity && (
        <div className="toolResult" aria-live="polite">
          <dl className="resultRows">
            <div><dt>패널을 올릴 수 있는 면적</dt><dd className="num">{num(capacity.usableAreaM2)} m²</dd></div>
            <div><dt>예상 패널 수</dt><dd className="num">{num(capacity.panelCount)} 장</dd></div>
            <div><dt>패널 한 장 출력</dt><dd className="num">{num(capacity.panelCapacityKw, 2)} kW</dd></div>
          </dl>

          <div className="resultFill">
            <span>설치 가능 용량</span>
            <strong className="num">{num(capacity.installableCapacityKw, 1)} kW</strong>
          </div>

          <p className="resultSource">
            계산 방법 {capacity.methodVersion} 기준 · <Link href="/trust/methodology">계산 방법 보기 →</Link>
          </p>

          <details className="toolDetails">
            <summary>이 용량이 나온 근거와 한계</summary>
            <p>패널 한 장을 {capacity.panelCapacityKw}kW, 통로를 포함한 장당 차지 면적을 {capacity.panelFootprintM2}m²로 잡았습니다. 건물 유형마다 장애물과 점검 공간을 감안해 배치 가능 비율을 다르게 적용합니다. 이번 계산은 {Math.round(capacity.usableAreaRatio * 100)}%입니다.</p>
            <p>지붕 형태, 음영, 구조 안전, 이격거리, 소방·전기 기준, 실제 모듈 규격에 따라 결과가 달라집니다. 설치 가능 여부를 보장하지 않습니다.</p>
            <ul>{CAPACITY_METHOD.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
          </details>

          <details className="toolDetails">
            <summary>발전량과 수익까지 계산하기</summary>
            <p>현재 시장 단가를 임의로 넣지 않습니다. 고지서, 계약서, 전력거래소와 신재생에너지센터에서 직접 확인한 값을 넣어주세요.</p>

            <div className="field">
              <span className="fieldLabel">계산 목적</span>
              <div className="choiceRow">
                <label><input type="radio" name="goal" checked={goal === "save"} onChange={() => setGoal("save")} /> 전기요금 절감</label>
                <label><input type="radio" name="goal" checked={goal === "sell"} onChange={() => setGoal("sell")} /> 발전 수익</label>
              </div>
            </div>

            <div className="assumptionGrid">
              <label><span>평균 일 발전시간</span><input type="number" min="0.01" max="24" step="0.01" value={dailyHours} onChange={(event) => setDailyHours(event.target.value)} /><b>시간/일</b></label>
              <label><span>시스템 손실률</span><input type="number" min="0" max="100" step="0.1" value={lossRate} onChange={(event) => setLossRate(event.target.value)} /><b>%</b></label>
              <label><span>kW당 설치비</span><input type="number" min="0" step="1000" value={costPerKw} onChange={(event) => setCostPerKw(event.target.value)} /><b>원/kW</b></label>
              {goal === "save" ? <>
                <label><span>자가소비율</span><input type="number" min="0" max="100" step="0.1" value={selfConsumptionRate} onChange={(event) => setSelfConsumptionRate(event.target.value)} /><b>%</b></label>
                <label><span>자가소비 전력 가치</span><input type="number" min="0" step="0.1" value={electricityValue} onChange={(event) => setElectricityValue(event.target.value)} /><b>원/kWh</b></label>
              </> : <>
                <label><span>SMP 단가</span><input type="number" min="0" step="0.1" value={smpPrice} onChange={(event) => setSmpPrice(event.target.value)} /><b>원/kWh</b></label>
                <label><span>REC 단가</span><input type="number" min="0" step="1" value={recPrice} onChange={(event) => setRecPrice(event.target.value)} /><b>원/REC</b></label>
                <label><span>REC 가중치</span><input type="number" min="0" step="0.01" value={recWeight} onChange={(event) => setRecWeight(event.target.value)} /><b>배</b></label>
              </>}
            </div>

            {economicsError && <p className="fieldError" role="alert">{economicsError}</p>}
            <button className="secondaryButton" type="button" onClick={calculateEconomics}>발전량과 수익 계산하기</button>

            {economics && <>
              <dl className="resultRows">
                <div><dt>연간 예상 발전량</dt><dd className="num">{num(economics.annualGenerationKwh)} kWh</dd></div>
                {goal === "save"
                  ? <div><dt>연간 예상 절감액</dt><dd className="num">{num(economics.annualSavings)} 원</dd></div>
                  : <>
                    <div><dt>연간 SMP 수익</dt><dd className="num">{num(economics.annualSmpRevenue)} 원</dd></div>
                    <div><dt>연간 REC 수익</dt><dd className="num">{num(economics.annualRecRevenue)} 원</dd></div>
                  </>}
                <div><dt>입력한 설치비</dt><dd className="num">{num(economics.installationCost)} 원</dd></div>
                <div><dt>단순 회수기간</dt><dd className="num">{economics.paybackYears === null ? "계산 불가" : `${num(economics.paybackYears, 1)} 년`}</dd></div>
              </dl>
              <p className="resultSource">
                계산 방법 {economics.methodVersion} 기준 · 넣어주신 가정값을 그대로 사용했습니다.
              </p>
              <p>단순 회수기간에는 금융비용, 유지보수비, 세금, 출력 제한, 가격 변동, 설비 성능 저하가 들어 있지 않습니다.</p>
              <ul>{ECONOMICS_METHOD.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
              <SaveCalculationButton calculation={{
                href: "/pro",
                capacityKw: capacity.installableCapacityKw,
                panelCount: capacity.panelCount,
                annualGenerationKwh: economics.annualGenerationKwh,
                annualBenefit: economics.annualBenefit,
                paybackYears: economics.paybackYears,
                goal,
              }} />
            </>}
          </details>
        </div>
      )}
    </div>
  );
}
