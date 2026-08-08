import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../lib/structuredData";
import SolarCalculator from "./SolarCalculator";
import "./home.css";

const homeDescription = "지붕에 설치 가능한 태양광 용량을 빠르게 계산하고, PVGIS 기반 정밀 분석과 계산 근거까지 한 흐름에서 확인합니다.";

export const metadata: Metadata = {
  title: "태양광 설치 판단 도구",
  description: homeDescription,
  alternates: { canonical: "/", languages: { ko: "/", "x-default": "/" } },
  openGraph: {
    title: "태양광 설치 판단 도구 | SolPlanit",
    description: homeDescription,
    url: "/",
  },
};

const homeStructuredData = [
  buildWebPageNode("/", "태양광 설치 판단 도구 | SolPlanit", homeDescription),
  buildCalculatorNode({
    path: "/",
    name: "SolPlanit 태양광 설치 가능 용량 계산기",
    description: homeDescription,
    features: ["설치 가능 용량 계산", "예상 패널 수", "배치 가능 면적", "연간 발전량", "자가소비 절감액", "SMP·REC 판매 수익", "단순 회수기간"],
    assumptions: ["입력값과 공개 방법론을 이용한 사전 검토용 예상치", "구조, 음영, 계통, 요금과 제도 조건에 따라 실제 결과가 달라질 수 있음"],
  }),
];

const evidence = [
  ["설치 용량", "건물 유형별 배치 가능 비율과 패널 규격 가정. 한국에너지공단과 미국 에너지부 자료를 참고했습니다"],
  ["발전량", "빠른 계산은 넣어주신 발전시간과 손실률만 사용합니다. 지역 일사량을 자동으로 끼워 넣지 않습니다"],
  ["정밀 분석", "전문가용 화면은 유럽집행위원회 JRC PVGIS 5.3 을 직접 조회합니다"],
  ["갱신일", "2026-08-08"],
  ["한계", "지붕 상태, 구조 안전, 음영과 계통 조건은 현장 검토가 필요합니다"],
];

const paths = [
  {
    href: "/pro",
    index: "02",
    title: "정밀 분석",
    description: "위치·경사·방위와 PVGIS 데이터를 이용해 발전량을 더 깊게 검토합니다.",
  },
  {
    href: "/guides",
    index: "03",
    title: "판단 가이드",
    description: "계산 결과를 실제 설치 검토로 옮길 때 확인해야 할 조건을 정리합니다.",
  },
  {
    href: "/trust/methodology",
    index: "04",
    title: "계산 방법론",
    description: "공식, 가정값, 출처와 계산의 한계를 그대로 공개합니다.",
  },
];

export default function HomePage() {
  return (
    <>
      <StructuredData graph={homeStructuredData} />
      <header className="siteHeader" aria-label="주요 탐색">
        <Link className="brand" href="/">SolPlanit</Link>
        <nav className="desktopNav" aria-label="주요 메뉴">
          <Link href="#quick-estimate">빠른 계산</Link>
          <Link href="/pro">정밀 분석</Link>
          <Link href="/guides">가이드</Link>
          <Link href="/trust/methodology">방법론</Link>
        </nav>
      </header>

      <main>
        <section className="block blockTool" id="quick-estimate" aria-labelledby="tool-title">
          <div className="toolIntro">
            <p className="homeEyebrow">SOLAR DECISION TOOLS / KOREA</p>
            <h1 id="tool-title">태양광 설치,<br />감이 아니라 숫자로 결정하세요.</h1>
            <p className="blockLead">
              우리 건물에 얼마나 올릴 수 있는지 빠르게 확인하고, 필요하면 같은 흐름에서 정밀 분석까지 이어가세요.
            </p>

            <div className="homeFlow" aria-label="SolPlanit 분석 흐름">
              <div className="homeFlowCurrent">
                <span className="num">01</span>
                <div>
                  <strong>빠른 계산</strong>
                  <p>건물 유형과 지붕 면적으로 설치 가능 용량을 먼저 확인합니다.</p>
                </div>
              </div>
              {paths.map((path) => (
                <Link href={path.href} key={path.href}>
                  <span className="num">{path.index}</span>
                  <div>
                    <strong>{path.title}</strong>
                    <p>{path.description}</p>
                  </div>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>

            <p className="homePromise">계정 없음 · 영업 연락 없음 · 계산 근거 공개</p>
          </div>

          <div className="calculatorStage" aria-label="빠른 태양광 계산기">
            <div className="calculatorStageHeader">
              <span className="num">01 / QUICK ESTIMATE</span>
              <span>사전 검토용</span>
            </div>
            <SolarCalculator />
          </div>
        </section>

        <section className="block blockEvidence" aria-labelledby="evidence-title">
          <div className="evidenceIntro">
            <p className="homeEyebrow">WHY THESE NUMBERS</p>
            <h2 id="evidence-title">결과보다 먼저,<br />근거를 확인할 수 있게.</h2>
            <p className="blockLead">
              태양광 계산은 입력 하나와 가정 하나가 결과를 크게 바꿉니다. 그래서 SolPlanit은 숫자만 보여주지 않고 그 숫자가 어디서 왔는지 같이 보여줍니다.
            </p>
            <Link className="evidenceMethodLink" href="/trust/assumptions">가정과 한계 전문 보기 →</Link>
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
