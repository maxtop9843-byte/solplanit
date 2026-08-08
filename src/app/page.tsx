import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../lib/structuredData";
import SolarCalculator from "./SolarCalculator";
import "./home.css";

const homeDescription = "건물 유형과 지붕 면적만 넣으면 설치 가능한 태양광 용량을 계산합니다. 계산에 쓴 가정과 출처를 함께 공개합니다.";

export const metadata: Metadata = {
  title: "태양광 설치 가능 용량 계산",
  description: homeDescription,
  alternates: { canonical: "/", languages: { ko: "/", "x-default": "/" } },
  openGraph: {
    title: "태양광 설치 가능 용량 계산 | SolPlanit",
    description: homeDescription,
    url: "/",
  },
};

const homeStructuredData = [
  buildWebPageNode("/", "태양광 설치 가능 용량 계산 | SolPlanit", homeDescription),
  buildCalculatorNode({
    path: "/",
    name: "SolPlanit 태양광 설치 가능 용량 계산기",
    description: homeDescription,
    features: ["설치 가능 용량 계산", "예상 패널 수", "배치 가능 면적", "연간 발전량", "자가소비 절감액", "SMP·REC 판매 수익", "단순 회수기간"],
    assumptions: ["입력값과 공개 방법론을 이용한 사전 검토용 예상치", "구조, 음영, 계통, 요금과 제도 조건에 따라 실제 결과가 달라질 수 있음"],
  }),
];

const evidence = [
  ["발전량", "유럽집행위원회 JRC PVGIS 5.3 공개 일사량"],
  ["설치 용량", "건물 유형별 배치 가능 비율과 패널 규격 가정"],
  ["갱신일", "2026-08-08"],
  ["한계", "현장 조건에 따라 달라집니다"],
];

export default function HomePage() {
  return (
    <>
      <StructuredData graph={homeStructuredData} />
      <header className="siteHeader" aria-label="주요 탐색">
        <Link className="brand" href="/">SolPlanit</Link>
        <nav className="desktopNav" aria-label="주요 메뉴">
          <Link href="/trust/methodology">방법론</Link>
          <Link href="/trust">이 사이트</Link>
        </nav>
      </header>

      <main>
        <section className="block blockTool" aria-labelledby="tool-title">
          <h1 id="tool-title">우리 건물에 태양광, 얼마나 올릴 수 있나요</h1>
          <p className="blockLead">지붕 면적과 건물 유형만 넣으면 배치 가능한 용량을 계산합니다.</p>
          <SolarCalculator />
        </section>

        <section className="block blockEvidence" aria-labelledby="evidence-title">
          <h2 id="evidence-title">이 숫자가 어디서 왔는지</h2>
          <dl className="evidenceRows">
            {evidence.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <p className="evidenceMore">
            <Link href="/trust/assumptions">가정과 한계 전문 보기 →</Link>
          </p>
        </section>
      </main>
    </>
  );
}
