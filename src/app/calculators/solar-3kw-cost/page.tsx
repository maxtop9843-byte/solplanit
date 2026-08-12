import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../../../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../../../lib/structuredData";
import Solar3kwCostCalculator from "./Solar3kwCostCalculator";
import styles from "./solar-3kw-cost.module.css";

const description = "지역을 고르면 2026년 공식 사업 자료에서 확인한 3kW 태양광 사업비 기준과 지원 내용을 보여드립니다. 확인되지 않은 지역은 다른 지역 값으로 추정하지 않습니다.";

export const metadata: Metadata = {
  title: "3kW 태양광 설치비용 계산기 | 2026 공식 지원 기준",
  description,
  alternates: { canonical: "/calculators/solar-3kw-cost" },
  openGraph: {
    title: "3kW 태양광 설치비용 계산기 | SolPlanit",
    description,
    url: "/calculators/solar-3kw-cost",
  },
};

const graph = [
  buildWebPageNode(
    "/calculators/solar-3kw-cost",
    "3kW 태양광 설치비용 계산기 | SolPlanit",
    description,
  ),
  buildCalculatorNode({
    path: "/calculators/solar-3kw-cost",
    name: "3kW 태양광 설치비용 계산기",
    description,
    features: ["공식 사업비 기준 확인", "지역별 2026 지원 내용 확인", "계산 가능한 자부담 확인"],
    assumptions: ["공식 공고에서 확인한 값만 사용", "실제 시장 견적과 공식 사업비 기준을 구분"],
  }),
];

export default function Solar3kwCostPage() {
  return (
    <>
      <StructuredData graph={graph} />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>SolPlanit</Link>
        <Link href="/#calculators" className={styles.backLink}>계산기 목록</Link>
      </header>
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="page-title">
          <p className={styles.eyebrow}>SOLAR 3kW COST / KOREA</p>
          <h1 id="page-title">3kW 태양광,<br />설치비가 얼마나 들까요?</h1>
          <p>지역만 고르면 2026년 공식 자료에서 확인한 사업비 기준과 지원 내용을 보여드립니다. 실제 시장 견적과 공식 사업 기준은 따로 구분합니다.</p>
        </section>
        <Solar3kwCostCalculator />
      </main>
    </>
  );
}
