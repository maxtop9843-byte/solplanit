"use client";

import Link from "next/link";
import { useState } from "react";
import { QuoteRequestInputError, validateQuoteRequest, type QuoteCalculationAttachment } from "../../lib/quotes/request";
import styles from "./quote.module.css";

export default function QuoteRequestForm({ calculation }: { calculation: QuoteCalculationAttachment }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [preferredContact, setPreferredContact] = useState<"phone" | "text">("text");
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      validateQuoteRequest({ name, phone, region, preferredContact, message, privacyAccepted, calculation });
      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof QuoteRequestInputError ? caught.message : "견적 요청 내용을 확인해주세요.");
    }
  };

  const hasCalculation = calculation.capacityKw > 0 && calculation.panelCount > 0 && calculation.annualGenerationKwh > 0;

  if (!hasCalculation) {
    return (
      <main className={styles.page}>
        <Link className={styles.back} href="/#calculator">← 계산기로 돌아가기</Link>
        <section className={styles.emptyState} aria-labelledby="quote-empty-title">
          <p className={styles.kicker}>견적 준비 전 확인</p>
          <h1 id="quote-empty-title">먼저 내 건물 조건을 계산해주세요</h1>
          <p>추천 설치 용량과 예상 발전량을 계산하면, 같은 조건을 바탕으로 견적 요청 내용을 준비할 수 있어요.</p>
          <div className={styles.emptyStateActions}>
            <Link className={styles.emptyPrimary} href="/#calculator">무료로 내 조건 계산하기</Link>
            <Link className={styles.emptySecondary} href="/community">설치 전 질문 살펴보기</Link>
          </div>
        </section>
      </main>
    );
  }

  if (submitted) {
    return <section className={styles.confirmation} role="status"><p>견적 요청 준비 완료</p><h1>계산 결과와 연락 정보를 확인했어요</h1><p>현재는 견적 연결 MVP 화면으로, 실제 업체 전송은 계정·전문가 연결 기능이 추가된 뒤 시작됩니다. 입력 내용은 서버에 저장되지 않았어요.</p><a href="/home">계산기로 돌아가기</a></section>;
  }

  const benefitLabel = calculation.goal === "save" ? "연간 예상 절감액" : "연간 예상 발전 수익";
  return (
    <main className={styles.page}>
      <a className={styles.back} href="/home">← 계산 결과로 돌아가기</a>
      <div className={styles.layout}>
        <section className={styles.intro}>
          <p className={styles.kicker}>계산 결과가 자동으로 첨부됩니다</p>
          <h1>내 조건에 맞는 견적을 준비해보세요</h1>
          <p>전문가가 같은 조건으로 검토할 수 있도록 핵심 계산값을 함께 전달합니다. 결과는 예상값이며 현장 조사 후 달라질 수 있어요.</p>
          <dl className={styles.attachment} aria-label="첨부된 계산 결과">
            <div><dt>추천 설치 용량</dt><dd>{calculation.capacityKw.toLocaleString("ko-KR")}kW</dd></div>
            <div><dt>예상 패널 수</dt><dd>{calculation.panelCount.toLocaleString("ko-KR")}장</dd></div>
            <div><dt>연간 예상 발전량</dt><dd>{calculation.annualGenerationKwh.toLocaleString("ko-KR")}kWh</dd></div>
            <div><dt>{benefitLabel}</dt><dd>{calculation.annualBenefit.toLocaleString("ko-KR")}원</dd></div>
            <div><dt>단순 회수기간</dt><dd>{calculation.paybackYears === null ? "계산 불가" : `${calculation.paybackYears}년`}</dd></div>
          </dl>
        </section>
        <form className={styles.form} onSubmit={submit} noValidate>
          <h2>연락받을 정보를 입력해주세요</h2>
          <label><span>이름</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
          <label><span>휴대전화</span><input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" /></label>
          <label><span>설치 예정 지역</span><input value={region} onChange={(event) => setRegion(event.target.value)} autoComplete="address-level1" placeholder="예: 경기도 수원시" /></label>
          <fieldset><legend>선호 연락 방식</legend><div className={styles.contactChoice}><label><input type="radio" name="contact" checked={preferredContact === "text"} onChange={() => setPreferredContact("text")} /> 문자</label><label><input type="radio" name="contact" checked={preferredContact === "phone"} onChange={() => setPreferredContact("phone")} /> 전화</label></div></fieldset>
          <label><span>전문가에게 전할 내용 <small>(선택)</small></span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} placeholder="건물 상황이나 궁금한 점을 적어주세요." /></label>
          <label className={styles.consent}><input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} /><span>견적 준비를 위한 이름, 연락처, 지역 정보 수집 안내에 동의합니다. 현재 MVP에서는 서버에 저장하거나 업체에 전송하지 않습니다.</span></label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit">견적 요청 내용 확인하기</button>
        </form>
      </div>
    </main>
  );
}
