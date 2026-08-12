import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../../../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../../../lib/structuredData";
import SubsidyLookup from "./SubsidyLookup";
import styles from "./subsidy.module.css";

const description = "지역을 고르면 2026년 정부·지자체 공식 자료에서 확인한 주택용 태양광 지원 내용, 신청 대상, 기간과 출처를 보여드립니다.";

export const metadata: Metadata = {
  title: "2026 태양광 보조금 조회 | 지역별 지원 확인",
  description,
  alternates: { canonical: "/calculators/subsidy" },
  openGraph: {
    title: "2026 태양광 보조금 조회 | SolPlanit",
    description,
    url: "/calculators/subsidy",
  },
};

const graph = [
  buildWebPageNode("/calculators/subsidy", "2026 태양광 보조금 조회 | SolPlanit", description),
  buildCalculatorNode({
    path: "/calculators/subsidy",
    name: "2026 태양광 보조금 조회",
    description,
    features: ["지역별 공식 지원 확인", "신청 대상·기간 확인", "공식 출처 바로가기"],
    assumptions: ["2026년 공식 공고에서 확인한 자료만 표시", "확인되지 않은 지역은 다른 지역 값으로 추정하지 않음"],
  }),
];

export default function SubsidyPage() {
  return (
    <>
      <StructuredData graph={graph} />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>SolPlanit</Link>
        <Link href="/#calculators" className={styles.backLink}>계산기 목록</Link>
      </header>
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="page-title">
          <p className={styles.eyebrow}>SOLAR SUPPORT / 2026</p>
          <h1 id="page-title">우리 지역 태양광 지원,<br />얼마나 받을 수 있을까요?</h1>
          <p>설치 지역을 고르면 공식 자료에서 확인한 주택용 태양광 지원 내용을 보여드립니다. 확인하지 못한 지역을 0원으로 표시하지 않습니다.</p>
        </section>
        <SubsidyLookup />
      </main>
    </>
  );
}
