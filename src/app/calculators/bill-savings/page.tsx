import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../../../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../../../lib/structuredData";
import BillSavingsCalculator from "./BillSavingsCalculator";
import styles from "./bill-savings.module.css";

const description = "지역과 월 전기 사용량, 설치 용량을 넣으면 PVGIS 발전량과 한국전력 주택용 저압 요금 기준으로 설치 전후 예상 전기요금 범위를 비교합니다.";

export const metadata: Metadata = {
  title: "태양광 전기요금 절감 계산기",
  description,
  alternates: { canonical: "/calculators/bill-savings" },
  openGraph: {
    title: "태양광 전기요금 절감 계산기 | SolPlanit",
    description,
    url: "/calculators/bill-savings",
  },
};

const graph = [
  buildWebPageNode("/calculators/bill-savings", "태양광 전기요금 절감 계산기 | SolPlanit", description),
  buildCalculatorNode({
    path: "/calculators/bill-savings",
    name: "태양광 전기요금 절감 계산기",
    description,
    features: ["설치 전후 예상 전기요금 비교", "자가소비 불확실성을 반영한 절감액 범위", "PVGIS 지역별 월 발전량 연동"],
    assumptions: ["2026년 3분기 한국전력 주택용 저압 표준요금 모델", "지역 중심 좌표 기준 JRC PVGIS 5.3 발전량"],
  }),
];

export default function BillSavingsPage() {
  return (
    <>
      <StructuredData graph={graph} />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>SolPlanit</Link>
        <Link href="/#calculators" className={styles.backLink}>계산기 목록</Link>
      </header>
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="page-title">
          <p className={styles.eyebrow}>SOLAR BILL SAVINGS / KOREA</p>
          <h1 id="page-title">태양광을 설치하면,<br />전기요금이 얼마나 줄까요?</h1>
          <p>월 전기 사용량과 설치 용량을 넣으면 선택한 지역의 예상 발전량을 확인해 설치 전후 전기요금 범위를 비교합니다.</p>
        </section>
        <BillSavingsCalculator />
      </main>
    </>
  );
}
