import Link from "next/link";
import GuidedCalculator from "./GuidedCalculator";
import "./home.css";

const processSteps = [
  ["01", "설치 가능 용량 확인", "건물 유형과 면적을 입력해 설치할 수 있는 용량을 확인해요."],
  ["02", "수익·절감액 계산", "전기를 직접 사용할지 판매할지 선택하고 예상 금액을 계산해요."],
  ["03", "무료 견적 요청", "계산 결과를 첨부해 여러 전문가에게 견적을 요청해요."],
  ["04", "비교하고 결정", "전문가 답변과 실제 설치 사례를 비교한 뒤 선택해요."],
];

export default function HomePage() {
  return (
    <main>
      <header className="siteHeader" aria-label="주요 탐색">
        <Link className="brand" href="/" aria-label="SolPlanit 홈"><span className="brandMark" aria-hidden="true" />SolPlanit</Link>
        <nav className="desktopNav" aria-label="주요 메뉴"><a href="#calculator">설치 알아보기</a><Link href="/cases">설치 사례</Link><Link href="/community">질문·견적</Link><a href="#experts">전문가 찾기</a></nav>
        <Link className="proLink" href="/pro">전문가용</Link>
      </header>
      <section className="hero" aria-labelledby="page-title">
        <div className="heroCopy"><p className="eyebrow">복잡한 태양광 설치, 더 쉽게</p><h1 id="page-title">태양광 설치,<br />처음부터 끝까지 <span style={{ whiteSpace: "nowrap" }}>한 번에</span></h1><p className="description">주소와 설치 면적만 입력하면 설치 가능한 용량과 예상 수익을 확인하고, 내 조건에 맞는 견적까지 받아볼 수 있어요.</p><div className="heroActions"><a className="primaryButton" href="#calculator">무료로 확인하기</a><Link className="secondaryLink" href="/cases">실제 설치 사례 보기 <span aria-hidden="true">→</span></Link></div></div>
        <div className="heroVisual" role="img" aria-label="맑은 날 태양광 패널이 설치된 건물 지붕"><div className="capacityChip" aria-label="예상 설치 용량 약 23.4킬로와트"><span>이 건물의 예상 설치 용량</span><strong>약 23.4kW</strong></div></div>
      </section>
      <section id="calculator" className="calculatorEntry" aria-labelledby="calculator-title"><div className="sectionIntro"><p className="sectionKicker">간단한 사전 확인</p><h2 id="calculator-title">우리 건물에는 태양광을 얼마나 설치할 수 있을까?</h2><p>한 화면에 하나의 질문만 답하면 돼요. 건물 유형, 면적, 지역, 목표를 차례로 확인합니다.</p></div><GuidedCalculator /></section>
      <section className="resultPreview" aria-labelledby="result-title"><div><p className="sectionKicker">결과는 한눈에</p><h2 id="result-title">이 조건이라면 이렇게 예상돼요</h2><p>입력한 정보를 바탕으로 설치 용량부터 발전량, 절감액까지 순서대로 보여드려요.</p></div><div className="resultCards"><article className="resultCard primaryResult"><span>추천 설치 용량</span><strong>23.4 <small>kW</small></strong><p>약 42장의 패널 기준</p></article><article className="resultCard"><span>연간 예상 발전량</span><strong>28,460 <small>kWh</small></strong><p>지역별 일사량 반영</p></article><article className="resultCard"><span>월 예상 절감액</span><strong>약 38 <small>만원</small></strong><p>자가소비 기준 예시</p></article></div><p className="disclaimer">예상 결과이며 실제 설치 가능 여부와 비용은 현장 조건 및 전문가 검토에 따라 달라질 수 있어요.</p></section>
      <section className="processSection" aria-labelledby="process-title"><div className="sectionIntro"><p className="sectionKicker">계산 다음도 막막하지 않게</p><h2 id="process-title">태양광 설치, 이렇게 진행돼요</h2></div><ol className="processGrid">{processSteps.map(([number,title,body]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
      <section id="cases" className="caseSection" aria-labelledby="cases-title"><div className="sectionHeaderRow"><div><p className="sectionKicker">실제 설치 사례</p><h2 id="cases-title">비슷한 건물의 선택을 먼저 살펴보세요</h2></div><Link className="secondaryLink" href="/cases">모든 사례 보기 →</Link></div><div className="caseGrid"><Link className="caseCard caseFactory" href="/cases/hwaseong-factory-48kw"><div><span>공장·창고</span><h3>경기 화성 48.6kW</h3><p>넓은 지붕을 활용한 자가소비형 설치</p></div></Link><Link className="caseCard caseHouse" href="/cases/asan-house-6kw"><div><span>주택</span><h3>충남 아산 6.2kW</h3><p>전기요금 절감을 목표로 한 소규모 설치</p></div></Link></div></section>
      <section id="quote" className="communitySection" aria-labelledby="community-title"><div><p className="sectionKicker">질문과 견적</p><h2 id="community-title">계산으로 부족한 부분은 전문가에게 물어보세요</h2><p>비슷한 조건의 설치 사례를 찾아보고, 계산 결과를 첨부해 일반 사용자와 전문가에게 질문할 수 있어요.</p><Link className="secondaryLink" href="/community">커뮤니티 둘러보기 →</Link></div><div className="communityTopics" aria-label="커뮤니티 주제"><span>설치 전 질문</span><span>견적 검토</span><span>설치 후기</span><span>전문가 답변</span><span>실제 발전량</span></div></section>
      <section id="experts" className="bottomCta" aria-labelledby="bottom-title"><p className="sectionKicker">회원가입 없이 시작</p><h2 id="bottom-title">우리 건물의 태양광 설치 가능성을 지금 확인해보세요</h2><p>간단히 계산하고, 원할 때만 견적을 요청할 수 있어요.</p><a className="primaryButton" href="#calculator">무료로 확인하기</a></section>
    </main>
  );
}
