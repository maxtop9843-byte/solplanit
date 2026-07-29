"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CommunityCategoryId } from "../communityData";
import {
  getCommunityAttachmentLabel,
  type CommunityCalculationAttachment,
} from "../communityAttachment";

const number = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });

export default function CommunityPostComposer({
  calculation,
}: {
  calculation: CommunityCalculationAttachment;
}) {
  const [category, setCategory] = useState<Extract<CommunityCategoryId, "pre-install" | "quote-review">>("pre-install");
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [region, setRegion] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const isComplete = title.trim().length >= 5 && question.trim().length >= 20;
  const benefitLabel = getCommunityAttachmentLabel(calculation.goal);
  const previewTitle = useMemo(() => title.trim() || "게시물 제목이 여기에 표시돼요", [title]);

  return (
    <main className="communityComposerPage">
      <header className="communityHeader" aria-label="게시물 작성 탐색">
        <Link className="communityBrand" href="/" aria-label="SolPlanit 홈">
          <span aria-hidden="true" />SolPlanit
        </Link>
        <nav aria-label="게시물 작성 메뉴"><Link href="/community">커뮤니티로 돌아가기</Link></nav>
      </header>

      <section className="composerHero" aria-labelledby="composer-title">
        <p>계산 결과 첨부</p>
        <h1 id="composer-title">내 조건을 다시 적지 않고<br />질문을 시작해보세요</h1>
        <span>계산값은 예상치이며 상세 주소나 연락처는 포함되지 않아요.</span>
      </section>

      <section className="composerLayout">
        <form className="composerForm" onSubmit={(event) => event.preventDefault()}>
          <fieldset>
            <legend>무엇을 물어볼까요?</legend>
            <div className="composerChoiceGrid">
              <label className={category === "pre-install" ? "selected" : ""}>
                <input type="radio" name="category" value="pre-install" checked={category === "pre-install"} onChange={() => setCategory("pre-install")} />
                <strong>설치 전 질문</strong><span>설치 조건과 준비 순서를 물어봐요.</span>
              </label>
              <label className={category === "quote-review" ? "selected" : ""}>
                <input type="radio" name="category" value="quote-review" checked={category === "quote-review"} onChange={() => setCategory("quote-review")} />
                <strong>견적 검토</strong><span>개인정보를 지운 견적 조건을 비교해요.</span>
              </label>
            </div>
          </fieldset>

          <label className="composerField">
            <span>제목</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} minLength={5} maxLength={80} placeholder={category === "quote-review" ? "예: 20kW 견적에서 꼭 확인할 항목이 궁금해요" : "예: 이 용량으로 설치 전에 무엇을 확인해야 하나요?"} />
            <small>{title.length}/80</small>
          </label>

          <label className="composerField">
            <span>궁금한 점</span>
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} minLength={20} maxLength={1000} rows={8} placeholder="건물 조건, 이미 확인한 내용, 답변 받고 싶은 항목을 적어주세요. 이름·전화번호·상세 주소는 제외해주세요." />
            <small>{question.length}/1000</small>
          </label>

          <div className="composerFieldRow">
            <label className="composerField"><span>지역 선택사항</span><input value={region} onChange={(event) => setRegion(event.target.value)} maxLength={30} placeholder="예: 경기 화성" /></label>
            <label className="composerField"><span>건물 유형 선택사항</span><select value={buildingType} onChange={(event) => setBuildingType(event.target.value)}><option value="">선택하지 않음</option><option>주택</option><option>상가·건물</option><option>공장·창고</option><option>토지</option></select></label>
          </div>

          <div className="composerPrivacy" role="note">
            <strong>공개 전에 확인해주세요</strong>
            <p>계산 결과는 자동 첨부되지만 상세 주소, 연락처, 계약서 식별정보는 수집하거나 표시하지 않아요. 실제 설치 가능 여부와 수익은 현장 검토에 따라 달라질 수 있어요.</p>
          </div>

          <button className="communityPrimary" type="submit" disabled={!isComplete} aria-describedby="composer-submit-help">게시 준비 완료</button>
          <p id="composer-submit-help" className="composerHelp">계정과 실제 게시 저장은 ACCOUNT-001에서 연결돼요. 지금은 첨부 내용과 공개 범위를 안전하게 미리 확인할 수 있어요.</p>
        </form>

        <aside className="composerPreview" aria-label="게시물 미리보기">
          <p>게시물 미리보기</p>
          <span className="composerBadge">{category === "quote-review" ? "견적 검토" : "설치 전 질문"}</span>
          <h2>{previewTitle}</h2>
          <p>{question.trim() || "궁금한 점을 작성하면 이곳에서 공개될 내용을 미리 볼 수 있어요."}</p>
          {(region || buildingType) && <dl>{region && <div><dt>지역</dt><dd>{region}</dd></div>}{buildingType && <div><dt>건물</dt><dd>{buildingType}</dd></div>}</dl>}

          <section className="calculationAttachment" aria-labelledby="attachment-title">
            <div><span>자동 첨부</span><strong id="attachment-title">일반 계산 결과</strong></div>
            <dl>
              <div><dt>추천 설치 용량</dt><dd>{number.format(calculation.capacityKw)}kW</dd></div>
              <div><dt>예상 패널 수</dt><dd>{number.format(calculation.panelCount)}장</dd></div>
              <div><dt>연간 예상 발전량</dt><dd>{number.format(calculation.annualGenerationKwh)}kWh</dd></div>
              <div><dt>{benefitLabel}</dt><dd>₩{number.format(calculation.annualBenefit)}</dd></div>
              <div><dt>예상 단순 회수기간</dt><dd>{calculation.paybackYears === null ? "계산 불가" : `${number.format(calculation.paybackYears)}년`}</dd></div>
            </dl>
            <small>입력 조건을 바탕으로 한 예상값이며 전문가의 현장 확인을 대신하지 않아요.</small>
          </section>
        </aside>
      </section>
    </main>
  );
}
