import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../lib/structuredData";
import GuidedCalculator from "./GuidedCalculator";
import "./home.css";

export const metadata: Metadata = {
  title: "태양광 설치 계산부터 견적까지",
  description: "건물 유형과 면적을 입력해 태양광 설치 가능 용량, 예상 발전량과 수익·절감액을 확인하고 견적까지 이어가세요.",
  alternates: { canonical: "/", languages: { ko: "/", "x-default": "/" } },
  openGraph: {
    title: "태양광 설치, 처음부터 끝까지 한 번에 | SolPlanit",
    description: "태양광 설치 가능 용량과 예상 발전량·수익을 계산하고 견적까지 이어가세요.",
    url: "/",
  },
};

const homeDescription = "건물 유형과 면적을 입력해 태양광 설치 가능 용량, 예상 발전량과 수익·절감액을 확인하고 견적까지 이어가세요.";
const homeStructuredData = [
  buildWebPageNode("/", "태양광 설치 계산부터 견적까지 | SolPlanit", homeDescription),
  buildCalculatorNode({
    path: "/",
    name: "SolPlanit 태양광 설치 계산기",
    description: homeDescription,
    features: ["설치 가능 용량 계산", "예상 패널 수", "연간 발전량", "자가소비 절감액", "SMP·REC 판매 수익", "단순 회수기간"],
    assumptions: ["입력값과 지역 평균을 이용한 사전 검토용 예상치", "구조, 음영, 계통, 요금과 제도 조건에 따라 실제 결과가 달라질 수 있음"],
  }),
];

export default function HomePage() {
  return (
    <main>
      <StructuredData graph={homeStructuredData} />
      <header className="siteHeader" aria-label="주요 탐색">
        <Link className="brand" href="/" aria-label="SolPlanit 홈"><span className="brandMark" aria-hidden="true" />SolPlanit</Link>
        <nav className="desktopNav" aria-label="주요 메뉴"><a href="#calculator">설치 알아보기</a><Link href="/trust/methodology">계산 방법</Link><Link href="/trust">이 사이트</Link></nav>
        <Link className="proLink" href="/pro">전문가용</Link>
      </header>
      <section className="hero" aria-labelledby="page-title">
        <div className="heroCopy"><p className="eyebrow">복잡한 태양광 설치, 더 쉽게</p><h1 id="page-title">태양광 설치,<br />처음부터 끝까지 <span style={{ whiteSpace: "nowrap" }}>한 번에</span></h1><p className="description">주소와 설치 면적만 입력하면 설치 가능한 용량과 예상 수익을 확인할 수 있어요.</p><div className="heroActions"><a className="primaryButton" href="#calculator">무료로 확인하기</a></div></div>
      </section>
      <section id="calculator" className="calculatorEntry" aria-labelledby="calculator-title"><div className="sectionIntro"><p className="sectionKicker">간단한 사전 확인</p><h2 id="calculator-title">우리 건물에는 태양광을 얼마나 설치할 수 있을까?</h2><p>한 화면에 하나의 질문만 답하면 돼요. 건물 유형, 면적, 지역, 목표를 차례로 확인합니다.</p></div><GuidedCalculator /></section>
      <section className="resultPreview" aria-labelledby="result-title"><div><p className="sectionKicker">결과는 한눈에</p><h2 id="result-title">이 조건이라면 이렇게 예상돼요</h2><p>입력한 정보를 바탕으로 설치 용량부터 발전량, 절감액까지 순서대로 보여드려요.</p></div><div className="resultCards"><article className="resultCard primaryResult"><span>추천 설치 용량</span><strong>23.4 <small>kW</small></strong><p>약 42장의 패널 기준</p></article><article className="resultCard"><span>연간 예상 발전량</span><strong>28,460 <small>kWh</small></strong><p>지역별 일사량 반영</p></article><article className="resultCard"><span>월 예상 절감액</span><strong>약 38 <small>만원</small></strong><p>자가소비 기준 예시</p></article></div><p className="disclaimer">예상 결과이며 실제 설치 가능 여부와 비용은 현장 조건 및 전문가 검토에 따라 달라질 수 있어요.</p></section>
      <section id="experts" className="bottomCta" aria-labelledby="bottom-title"><p className="sectionKicker">회원가입 없이 시작</p><h2 id="bottom-title">우리 건물의 태양광 설치 가능성을 지금 확인해보세요</h2><p>간단히 계산하고, 결과는 그대로 가져갈 수 있어요.</p><a className="primaryButton" href="#calculator">무료로 확인하기</a></section>
    </main>
  );
}
