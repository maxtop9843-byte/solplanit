"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const [areaUnknown, setAreaUnknown] = useState(false);
  const [capacity, setCapacity] = useState<CapacityResult | null>(null);
  const [error, setError] = useState("");
  const areaInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (capacity) resultRef.current?.focus();
  }, [capacity]);

  function calculate() {
    setError("");
    try {
      setCapacity(estimateInstallableCapacity({ buildingType: building, area: Number(area), areaUnit }));
    } catch (caught) {
      setCapacity(null);
      setError(caught instanceof CapacityInputError ? caught.message : "계산하지 못했습니다. 입력한 값을 다시 확인해 주세요.");
      areaInputRef.current?.focus();
    }
  }

  function invalidateResult() {
    setCapacity(null);
    if (error) setError("");
  }

  function updateArea(value: string) {
    setArea(value);
    invalidateResult();
  }

  function updateBuilding(value: BuildingType) {
    setBuilding(value);
    invalidateResult();
  }

  function updateAreaUnit(value: AreaUnit) {
    setAreaUnit(value);
    invalidateResult();
  }

  function showUnknownAreaHelp() {
    setAreaUnknown(true);
    setArea("");
    setCapacity(null);
    setError("");
  }

  function returnToAreaInput() {
    setAreaUnknown(false);
    setError("");
  }

  const preciseAnalysisHref = capacity
    ? `/pro?source=general&capacity=${capacity.installableCapacityKw}&panels=${capacity.panelCount}`
    : "/pro";
  const areaDescribedBy = error ? "area-help area-error" : "area-help";

  return (
    <div className="tool">
      <form
        className="toolCard"
        onSubmit={(event) => {
          event.preventDefault();
          calculate();
        }}
      >
        <div className="field">
          <label htmlFor="building">건물 종류</label>
          <select id="building" value={building} onChange={(event) => updateBuilding(event.target.value as BuildingType)}>
            {BUILDING_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="area">지붕 면적</label>
          {!areaUnknown ? (
            <>
              <div className="fieldRow">
                <input
                  ref={areaInputRef}
                  id="area"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={area}
                  onChange={(event) => updateArea(event.target.value)}
                  onBlur={() => { if (area && Number(area) <= 0) setError("0보다 큰 면적을 넣어 주세요."); }}
                  aria-describedby={areaDescribedBy}
                  aria-invalid={error ? true : undefined}
                />
                <div className="unitToggle" role="group" aria-label="면적 단위">
                  {(["m2", "pyeong"] as const).map((unit) => (
                    <button key={unit} type="button" aria-pressed={areaUnit === unit} onClick={() => updateAreaUnit(unit)}>
                      {unit === "m2" ? "m²" : "평"}
                    </button>
                  ))}
                </div>
              </div>
              <small id="area-help">전체 지붕 면적을 대략 넣어도 됩니다. 통로와 점검 공간은 계산할 때 따로 반영합니다.</small>
              {error && <p className="fieldError" id="area-error" role="alert">{error}</p>}
              <button className="fieldTextButton" type="button" onClick={showUnknownAreaHelp} aria-controls="unknown-area-help">
                지붕 면적을 잘 모르겠어요
              </button>
            </>
          ) : (
            <div className="fieldUnknown" id="unknown-area-help" role="status">
              <strong>면적을 모르면 용량을 임의로 계산하지 않습니다.</strong>
              <p>지붕 면적을 확인한 뒤 다시 계산해 주세요. 주소나 건물 정보만으로 면적을 추정하는 기능은 공식 근거를 확인한 뒤 추가할 예정입니다.</p>
              <div className="fieldUnknownActions">
                <button className="secondaryButton" type="button" onClick={returnToAreaInput}>지붕 면적 입력하기</button>
                <Link href="/guides">설치 전 확인사항 보기 →</Link>
              </div>
            </div>
          )}
        </div>

        {!areaUnknown && <button className="primaryButton" type="submit">설치 가능 용량 계산하기</button>}
      </form>

      {capacity && (
        <div ref={resultRef} className="toolResult" role="region" aria-label="계산 결과" aria-live="polite" tabIndex={-1}>
          <p className="resultSource"><strong>간단 예상치</strong> · 입력한 면적과 배치 가정을 이용한 사전 검토 결과입니다.</p>

          <div className="resultFill">
            <span>예상 설치 가능 용량</span>
            <strong className="num">{num(capacity.installableCapacityKw, 1)}kW</strong>
          </div>

          <dl className="resultRows">
            <div>
              <dt>입력한 지붕 면적</dt>
              <dd className="num">{num(capacity.inputArea, Number.isInteger(capacity.inputArea) ? 0 : 1)}{capacity.inputUnit === "m2" ? "m²" : "평"}</dd>
            </div>
            <div><dt>적용한 배치 가능 비율</dt><dd className="num">약 {Math.round(capacity.usableAreaRatio * 100)}%</dd></div>
            <div><dt>실제로 패널을 배치하는 면적</dt><dd className="num">약 {num(capacity.usableAreaM2)}m²</dd></div>
            <div><dt>예상 패널 수</dt><dd className="num">약 {num(capacity.panelCount)}장</dd></div>
            <div><dt>계산에 사용한 패널 용량</dt><dd className="num">{num(capacity.panelCapacityKw, 2)}kW/장</dd></div>
          </dl>

          <p className="resultSource">
            계산 기준 {capacity.methodVersion} · <Link href="/trust/methodology">가정과 출처 보기 →</Link>
          </p>

          <div className="resultNextStep">
            <div>
              <strong>이 용량으로 얼마나 발전할지도 확인해 보세요.</strong>
              <p>지도에서 위치를 고르면 PVGIS 데이터를 이용해 월별·연간 예상 발전량을 계산합니다.</p>
            </div>
            <Link href={preciseAnalysisHref}>정밀 발전량 계산하기 →</Link>
          </div>

          <div className="resultAvailability" role="note" aria-label="아직 제공하지 않는 금액 결과">
            <strong>설치비·보조금·전기요금 절감액은 아직 표시하지 않습니다.</strong>
            <p>2026년 공식 지원 자료와 한국전력 요금 모델 검증이 끝난 값만 보여드리기 위해, 지금은 임의 금액을 만들지 않습니다.</p>
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
