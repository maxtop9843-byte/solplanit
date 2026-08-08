import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../lib/structuredData";
import SolarCalculator from "./SolarCalculator";
import "./home.css";

const homeDescription = "건물 종류와 지붕 면적을 넣으면 설치 가능한 태양광 용량과 예상 패널 수를 계산합니다. 회원가입 없이 계산 기준과 출처까지 확인할 수 있습니다.";

export const metadata: Metadata = {
  title: "태양광 설치 가능 용량 계산기",
  description: homeDescription,
  alternates: { canonical: "/", languages: { ko: "/", "x-default": "/" } },
  openGraph: {
    title: "태양광 설치 가능 용량 계산기 | SolPlanit",
    description: homeDescription,
    url: "/",
  },
};

const homeStructuredData = [
  buildWebPageNode("/", "태양광 설치 가능 용량 계산기 | SolPlanit", homeDescription),
  buildCalculatorNode({
    path: "/",
    name: "SolPlanit 태양광 설치 가능 용량 계산기",
    description: homeDescription,
    features: ["설치 가능 용량 계산", "예상 패널 수", "배치 가능 면적"],
    assumptions: ["건물 종류와 지붕 면적을 이용한 사전 검토용 예상치", "지붕 형태, 음영, 구조 안전과 실제 패널 규격에 따라 결과가 달라질 수 있음"],
  }),
];

const evidence = [
  ["설치 용량", "패널 규격과 통로·점검 공간, 건물 종류별 배치 가능 비율을 반영합니다."],
  ["발전량", "위치를 선택하는 정밀 계산에서는 JRC PVGIS 5.3 데이터를 직접 조회합니다."],
  ["기준일", "2026-08-08"],
  ["꼭 확인할 것", "지붕 구조와 그늘, 이격거리, 전기·소방 기준은 실제 설치 전에 현장에서 확인해야 합니다."],
];

const availableTools = [
  {
    href: "/pro",
    title: "우리 지역에서는 얼마나 발전할까요?",
    description: "지도에서 위치를 고르면 PVGIS 데이터로 월별·연간 예상 발전량을 계산합니다.",
  },
  {
    href: "/guides",
    title: "설치 전에 무엇을 확인해야 할까요?",
    description: "지붕 구조와 그늘, 설치 조건처럼 계산만으로 알 수 없는 내용을 확인합니다.",
  },
];

const pendingAnswers = [
  ["설치하면 얼마가 들까요?", "2026년 공식 사업 기준과 지역별 지원 자료를 확인한 뒤 제공합니다."],
  ["보조금을 받을 수 있을까요?", "정부·지자체 공고를 확인한 지역만 금액과 조건을 보여드립니다."],
  ["전기요금은 얼마나 줄어들까요?", "한국전력 주택용 요금 계산 모델 검증이 끝난 뒤 제공합니다."],
];

export default function HomePage() {
  return (
    <>
      <StructuredData graph={homeStructuredData} />
      <header className="siteHeader" aria-label="주요 탐색">
        <Link className="brand" href="/">SolPlanit</Link>
        <nav className="desktopNav" aria-label="주요 메뉴">
          <Link href="#quick-estimate">설치 용량</Link>
          <Link href="/pro">발전량</Link>
          <Link href="/guides">가이드</Link>
          <Link href="/trust/methodology">계산 기준</Link>
        </nav>
      </header>

      <main>
        <section className="block blockTool" id="quick-estimate" aria-labelledby="tool-title">
          <div className="toolIntro">
            <p className="homeEyebrow">SOLAR CALCULATOR / KOREA</p>
            <h1 id="tool-title">우리 건물에 태양광,<br />얼마나 설치할 수 있을까요?</h1>
            <p className="blockLead">
              건물 종류와 지붕 면적만 넣어보세요. 패널을 몇 장 놓을 수 있는지와 예상 설치 용량을 바로 계산합니다.
            </p>

            <div className="homeFlow" aria-label="지금 사용할 수 있는 다음 계산과 정보">
              <div className="homeFlowCurrent">
                <span className="statusBadge statusReady">지금 가능</span>
                <div>
                  <strong>지붕에 얼마나 설치할 수 있을까요?</strong>
                  <p>건물 종류와 지붕 면적으로 설치 가능 용량을 계산합니다.</p>
                </div>
              </div>
              {availableTools.map((tool) => (
                <Link href={tool.href} key={tool.href}>
                  <span className="statusBadge statusReady">지금 가능</span>
                  <div>
                    <strong>{tool.title}</strong>
                    <p>{tool.description}</p>
                  </div>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>

            <div className="pendingAnswers" aria-labelledby="pending-answers-title">
              <div className="pendingAnswersHeader">
                <strong id="pending-answers-title">금액 관련 계산은 공식 자료 확인 후 제공합니다.</strong>
                <p>확인되지 않은 비용이나 지원금을 화면 완성용 숫자로 채우지 않습니다.</p>
              </div>
              <dl>
                {pendingAnswers.map(([question, reason]) => (
                  <div key={question}>
                    <dt>{question}</dt>
                    <dd>{reason}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="homePromise">전문 용어 입력 없음 · 회원가입 없음 · 계산 기준 공개</p>
          </div>

          <div className="calculatorStage" aria-label="태양광 설치 가능 용량 계산기">
            <div className="calculatorStageHeader">
              <span className="num">ROOF CAPACITY</span>
              <span>간단 계산</span>
            </div>
            <SolarCalculator />
          </div>
        </section>

        <section className="block blockEvidence" aria-labelledby="evidence-title">
          <div className="evidenceIntro">
            <p className="homeEyebrow">HOW IT WORKS</p>
            <h2 id="evidence-title">계산 결과와 함께,<br />그 숫자의 기준도 보여드립니다.</h2>
            <p className="blockLead">
              태양광 계산은 조건이 조금만 달라져도 결과가 달라집니다. 그래서 숫자만 보여주지 않고 어떤 기준을 썼는지, 무엇을 따로 확인해야 하는지도 함께 적습니다.
            </p>
            <Link className="evidenceMethodLink" href="/trust/assumptions">가정과 한계 자세히 보기 →</Link>
          </div>

          <dl className="evidenceRows">
            {evidence.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}
