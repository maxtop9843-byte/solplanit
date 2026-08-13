import type { Metadata } from "next";
import SeoGuide from "../../components/SeoGuide";
import StructuredData from "../../components/StructuredData";
import { proSeoGuide } from "../../lib/seoGuides";
import { buildBreadcrumbNode, buildCalculatorNode, buildFaqNode, buildWebPageNode } from "../../lib/structuredData";
import PrecisionGenerationCalculator from "./PrecisionGenerationCalculator";
import "./precision.css";

const description = "지도에서 위치를 고르고 설치 용량을 넣어 PVGIS 5.3 기반 월별·연간 태양광 발전량을 자세히 계산합니다.";

export const metadata: Metadata = {
  title: "정밀 태양광 발전량 계산기",
  description,
  alternates: { canonical: "/pro", languages: { ko: "/pro", "x-default": "/pro" } },
};

const structuredData = [
  buildWebPageNode("/pro", "정밀 태양광 발전량 계산기 | SolPlanit", description),
  buildBreadcrumbNode("/pro", [{ label: "홈", href: "/" }, { label: "정밀 발전량 계산기" }]),
  buildFaqNode("/pro", proSeoGuide.faqs),
  buildCalculatorNode({
    path: "/pro",
    name: "SolPlanit 정밀 태양광 발전량 계산기",
    description,
    features: ["지도에서 위치 선택", "설치 용량 입력", "경사·방위 상세 조건", "월별·연간 발전량", "PVGIS 출처와 조회 시점"],
    assumptions: ["PVGIS 5.3 기후 데이터와 입력한 설치 조건을 사용", "현장 음영, 오염, 가동 중단, 장비 편차와 장기 열화에 따라 실제 발전량은 달라질 수 있음"],
  }),
];

export default function ProPage() {
  return (
    <main>
      <StructuredData graph={structuredData} />
      <PrecisionGenerationCalculator />
      <SeoGuide content={proSeoGuide} />
    </main>
  );
}
