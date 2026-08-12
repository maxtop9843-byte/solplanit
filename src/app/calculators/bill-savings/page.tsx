import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../../../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../../../lib/structuredData";
import BillSavingsCalculator from "./BillSavingsCalculator";
import styles from "./bill-savings.module.css";

const description = "지역, 월 전기 사용량, 설치 용량을 넣으면 JRC PVGIS 5.3 월별 발전량과 검증된 한국전력 주택용 저압 요금 모델을 이용해 전기요금 절감 범위를 계산합니다.";

export const metadata: Metadata = {
  title: "태양광 전기요금 절감 계산기 | 2026 한국전력 요금 반영",
  description,
  alternates: { canonical: "/calculators/bill-savings" },
  openGraph: {
    title: "태양광 전기요금 절감 계산기 | SolPlanit",
    description,
    url: "/calculators/bill-savings",
  },
};

const graph = [
  buildWebPageNode(
    "/calculators/bill-savings",
    "태양광 전기요금 절감 계산기 | SolPlanit",
    description,
  ),
  buildCalculatorNode({
    path: "/calculators/bill-savings",
    name: "태양광 전기요금 절감 계산기",
    description,
    features: ["PVGIS 월별 발전량 연결", "설치 전후 예상 전기요금 비교", "자가소비 불확실성을 범위로 표시"],
    assumptions: ["지역 중심 대표 좌표 사용", "시간대별 소비 패턴을 모르면 자가소비율을 임의로 정하지 않음", "2026년 3분기 한국전력 주택용 저압 요금 모델 사용"],
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
          <h1 id="page-title">태양광을 설치하면<br />전기요금이 얼마나 줄까요?</h1>
          <p>지역과 월 전기 사용량, 설치 용량을 넣어보세요. 월별 발전량은 PVGIS에서 확인하고, 실제 자가소비량을 모르는 부분은 하나의 숫자로 꾸미지 않고 범위로 보여드립니다.</p>
        </section>
        <BillSavingsCalculator />
      </main>
    </>
  );
}
