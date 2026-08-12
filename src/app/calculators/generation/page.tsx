import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../../../components/StructuredData";
import { buildCalculatorNode, buildWebPageNode } from "../../../lib/structuredData";
import GenerationCalculator from "./GenerationCalculator";
import styles from "../bill-savings/bill-savings.module.css";

const description = "지역과 설치 용량을 넣으면 JRC PVGIS 5.3을 기반으로 월별·연간 예상 태양광 발전량을 계산합니다.";

export const metadata: Metadata = {
  title: "태양광 발전량 계산기 | 지역별 예상 발전량",
  description,
  alternates: { canonical: "/calculators/generation" },
  openGraph: { title: "태양광 발전량 계산기 | SolPlanit", description, url: "/calculators/generation" },
};

const graph = [
  buildWebPageNode("/calculators/generation", "태양광 발전량 계산기 | SolPlanit", description),
  buildCalculatorNode({ path: "/calculators/generation", name: "태양광 발전량 계산기", description, features: ["지역별 연간 예상 발전량", "월별 예상 발전량", "JRC PVGIS 5.3 위치 기반 계산"], assumptions: ["지역 중심 좌표 기준", "PVGIS 최적 경사·방위 자동 계산"] }),
];

export default function GenerationPage() {
  return <><StructuredData graph={graph} /><header className={styles.header}><Link href="/" className={styles.brand}>SolPlanit</Link><Link href="/#calculators" className={styles.backLink}>계산기 목록</Link></header><main className={styles.page}><section className={styles.hero} aria-labelledby="page-title"><p className={styles.eyebrow}>SOLAR GENERATION / PVGIS 5.3</p><h1 id="page-title">우리 지역에서는,<br />태양광이 얼마나 발전할까요?</h1><p>지역과 설치 용량을 넣으면 위치 기반 기상 데이터를 사용해 월별·연간 예상 발전량을 계산합니다.</p></section><GenerationCalculator /><section className={styles.related} aria-labelledby="generation-related-title"><p className={styles.eyebrow}>RELATED CALCULATORS</p><h2 id="generation-related-title">발전량을 확인한 다음</h2><p>예상 발전량이 전기요금 절감에 얼마나 영향을 주는지 이어서 확인해 보세요.</p><div className={styles.relatedLinks}><Link href="/calculators/bill-savings">전기요금 절감액 계산하기</Link><Link href="/calculators/solar-3kw-cost">3kW 태양광 설치비 확인하기</Link></div></section></main></>;
}
