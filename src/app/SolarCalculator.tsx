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

const num = (value: number, digits = 0) =>
  value.toLocaleString("ko-KR", { maximumFractionDigits: digits, minimumFractionDigits: digits });

export default function SolarCalculator() {
  const [building, setBuilding] = useState<BuildingType>("주택");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("m2");
  const [capacity, setCapacity] = useState<CapacityResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    try {
      setCapacity(estimateInstallableCapacity({ buildingType: building, area: Number(area), areaUnit }));
    } catch (caught) {
      setCapacity(null);
      setError(caught instanceof CapacityInputError ? caught.message : "계산하지 못했습니다. 입력한 값을 다시 확인해주세요.");
    }
  }

  const preciseAnalysisHref = capacity
    ? `/pro?source=general&capacity=${capacity.installableCapacityKw}&panels=${capacity.panelCount}`
    : "/pro";

  return (
    <div className="tool">
      <div className="toolCard">
        <div className="field">
          <label htmlFor="building">건물 종류</label>
          <select id="building" value={building} onChange={(event) => setBuilding(event.target.value as BuildingType)}>
            {BUILDING_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="area">패널을 설치할 수 있는 지붕 면적</label>
          <div className="fieldRow">
            <input
              id="area"
              type="number"
              inputMode="decimal"
              min="0"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              onBlur={() => { if (area && Number(area) <= 0) setError("0보다 큰 면적을 넣어주세요."); }}
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
          <small id="area-help">정확하지 않아도 괜찮아요. 패널을 놓을 수 있을 것 같은 면적을 대략 넣어주세요.</small>
        </div>

        {error && <p className="fieldError" role="alert">{error}</p>}

        <button className="primaryButton" type="button" onClick={calculate}>설치 가능 용량 계산하기</button>
      </div>

      {capacity && (
        <div className="toolResult" aria-live="polite">
          <div className="resultFill">
            <span>예상 설치 가능 용량</span>
            <strong className="num">{num(capacity.installableCapacityKw, 1)}kW</strong>
          </div>

          <dl className="resultRows">
            <div><dt>실제로 패널을 배치하는 면적</dt><dd className="num">약 {num(capacity.usableAreaM2)}m²</dd></div>
            <div><dt>예상 패널 수</dt><dd className="num">약 {num(capacity.panelCount)}장</dd></div>
            <div><dt>계산에 사용한 패널 용량</dt><dd className="num">{num(capacity.panelCapacityKw, 2)}kW/장</dd></div>
          </dl>

          <p className="resultSource">
            계산 방법 {capacity.methodVersion} 기준 · <Link href="/trust/methodology">계산 기준 보기 →</Link>
          </p>

          <div className="resultNextStep">
            <div>
              <strong>이 용량으로 얼마나 발전할지도 확인해보세요.</strong>
              <p>지도에서 위치를 고르면 PVGIS 데이터를 이용해 월별·연간 예상 발전량을 계산합니다.</p>
            </div>
            <Link href={preciseAnalysisHref}>정밀 발전량 계산하기 →</Link>
          </div>

          <details className="toolDetails">
            <summary>이 숫자는 어떻게 계산했나요?</summary>
            <p>패널 한 장을 {capacity.panelCapacityKw}kW로 보고, 통로와 점검 공간을 포함해 한 장당 {capacity.panelFootprintM2}m²가 필요하다고 계산했습니다. {building}은 지붕 면적의 약 {Math.round(capacity.usableAreaRatio * 100)}%를 실제 배치 가능 면적으로 봅니다.</p>
            <p>지붕 모양, 그늘, 구조 안전, 이격거리, 소방·전기 기준과 실제 패널 규격에 따라 설치 가능한 용량은 달라질 수 있습니다. 이 결과만으로 설치 가능 여부를 확정할 수는 없습니다.</p>
            <ul>{CAPACITY_METHOD.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
          </details>
        </div>
      )}
    </div>
  );
}
