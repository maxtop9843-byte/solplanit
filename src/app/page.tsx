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
  ["설치 용량", "건물 유형별 배치 가능 비율과 패널 규격 가정. 한국에너지공단과 미국 에너지부 자료를 참고했습니다"],
  ["발전량", "넣어주신 발전시간과 손실률로만 계산합니다. 지역 일사량을 자동으로 넣지 않습니다"],
  ["정밀 분석", "전문가용 화면은 유럽집행위원회 JRC PVGIS 5.3 을 직접 조회합니다"],
  ["갱신일", "2026-08-08"],
  ["한계", "지붕 상태와 음영은 현장에서 봐야 압니다"],
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
          <p className="blockLead">건물 유형과 지붕 면적만 넣으면 됩니다. 무리한 용량은 권하지 않습니다.</p>
          <SolarCalculator />
        </section>

        <section className="block blockEvidence" aria-labelledby="evidence-title">
          <h2 id="evidence-title">이 숫자가 어디서 왔는지</h2>
          <p className="blockLead">맞지 않으면 맞지 않다고 말씀드립니다. 계산에 쓴 가정을 숨기지 않습니다.</p>
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
