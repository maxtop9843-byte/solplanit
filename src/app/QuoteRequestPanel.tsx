"use client";

import { useState, type FormEvent } from "react";

import type { CapacityResult } from "../lib/calculations/capacity";
import type { EconomicsResult } from "../lib/calculations/economics";
import styles from "./QuoteRequestPanel.module.css";

type QuoteRequestPanelProps = {
  building: string;
  areaLabel: string;
  locationLabel: string;
  goal: "save" | "sell";
  capacity: CapacityResult;
  economics: EconomicsResult;
};

type QuoteForm = {
  name: string;
  phone: string;
  region: string;
  message: string;
  consent: boolean;
};

const INITIAL_FORM: QuoteForm = {
  name: "",
  phone: "",
  region: "",
  message: "",
  consent: false,
};

export default function QuoteRequestPanel({
  building,
  areaLabel,
  locationLabel,
  goal,
  capacity,
  economics,
}: QuoteRequestPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<QuoteForm>(INITIAL_FORM);
  const [error, setError] = useState("");

  const annualValue = goal === "save" ? economics.annualSavings : economics.annualRevenue;
  const goalLabel = goal === "save" ? "전기요금 절감" : "발전 수익";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("이름을 입력해주세요.");
    if (!/^01\d-?\d{3,4}-?\d{4}$/.test(form.phone.trim())) return setError("연락 가능한 휴대전화 번호를 입력해주세요.");
    if (!form.region.trim()) return setError("설치 예정 지역을 입력해주세요.");
    if (!form.consent) return setError("견적 연결을 위한 개인정보 수집·이용에 동의해주세요.");

    setIsSubmitted(true);
  };

  if (!isOpen) {
    return (
      <section className={styles.callout} aria-labelledby="quote-callout-title">
        <div>
          <p className={styles.kicker}>다음 단계</p>
          <h3 id="quote-callout-title">이 계산 결과로 무료 견적을 요청해보세요</h3>
          <p>건물 조건과 계산 결과가 자동으로 첨부되어 같은 내용을 다시 입력하지 않아도 돼요.</p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={() => setIsOpen(true)}>
          내 조건으로 무료 견적받기
        </button>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <section className={styles.success} role="status" aria-live="polite">
        <p className={styles.kicker}>요청 내용 저장 완료</p>
        <h3>견적 요청 준비가 끝났어요</h3>
        <p>
          현재는 전문가 연결 시스템을 준비 중이라 실제 업체 전송은 이루어지지 않아요. 입력한 내용과 계산 결과가 함께 전달될 구조를 먼저 검증했어요.
        </p>
        <button className={styles.secondaryButton} type="button" onClick={() => { setIsSubmitted(false); setIsOpen(false); setForm(INITIAL_FORM); }}>
          결과로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="quote-form-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>계산 결과 자동 첨부</p>
          <h3 id="quote-form-title">견적 요청에 필요한 연락처만 알려주세요</h3>
        </div>
        <button className={styles.closeButton} type="button" onClick={() => { setIsOpen(false); setError(""); }} aria-label="견적 요청 닫기">
          닫기
        </button>
      </div>

      <dl className={styles.attachment} aria-label="견적 요청에 첨부되는 계산 결과">
        <div><dt>설치 조건</dt><dd>{building} · {areaLabel}</dd></div>
        <div><dt>설치 위치</dt><dd>{locationLabel}</dd></div>
        <div><dt>계산 목적</dt><dd>{goalLabel}</dd></div>
        <div><dt>추천 설치 용량</dt><dd>{capacity.installableCapacityKw.toLocaleString("ko-KR")}kW</dd></div>
        <div><dt>연간 예상 발전량</dt><dd>{economics.annualGenerationKwh.toLocaleString("ko-KR")}kWh</dd></div>
        <div><dt>연간 예상 {goal === "save" ? "절감액" : "수익"}</dt><dd>{annualValue.toLocaleString("ko-KR")}원</dd></div>
      </dl>

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.grid}>
          <label><span>이름</span><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} autoComplete="name" /></label>
          <label><span>휴대전화 번호</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" /></label>
          <label className={styles.full}><span>설치 예정 지역</span><input value={form.region} onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))} autoComplete="address-level1" placeholder="예: 경기도 수원시" /></label>
          <label className={styles.full}><span>전문가에게 남길 내용 <small>선택</small></span><textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} rows={4} placeholder="현장 조건이나 궁금한 점을 적어주세요." /></label>
        </div>

        <label className={styles.consent}>
          <input type="checkbox" checked={form.consent} onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))} />
          <span>견적 연결을 위해 이름, 연락처, 설치 예정 지역과 계산 결과를 수집·이용하는 데 동의합니다.</span>
        </label>
        <p className={styles.notice}>실제 전문가 전송 기능은 후속 연결 작업에서 활성화됩니다. 지금은 요청 데이터 구조와 사용자 흐름을 안전하게 검증합니다.</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}>
          <button className={styles.secondaryButton} type="button" onClick={() => { setIsOpen(false); setError(""); }}>취소</button>
          <button className={styles.primaryButton} type="submit">계산 결과와 함께 요청하기</button>
        </div>
      </form>
    </section>
  );
}
