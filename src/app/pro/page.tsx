import type { Metadata } from "next";
import SeoGuide from "../../components/SeoGuide";
import StructuredData from "../../components/StructuredData";
import { proSeoGuide } from "../../lib/seoGuides";
import { buildBreadcrumbNode, buildCalculatorNode, buildFaqNode, buildWebPageNode } from "../../lib/structuredData";
import ProWorkspace from "./ProWorkspace";
import "./pro.css";

const description = "지도, 시스템 입력, 결과 요약을 한 화면에서 다루는 SolPlanit 전문가용 태양광 프로젝트 워크스페이스입니다.";

export const metadata: Metadata = {
  title: "전문가용 발전량 분석",
  description,
  alternates: { canonical: "/pro", languages: { ko: "/pro", "x-default": "/pro" } },
};

const structuredData = [
  buildWebPageNode("/pro", "전문가용 발전량 분석 | SolPlanit", description),
  buildBreadcrumbNode("/pro", [{ label: "홈", href: "/" }, { label: "전문가용 발전량 분석" }]),
  buildFaqNode("/pro", proSeoGuide.faqs),
  buildCalculatorNode({
    path: "/pro",
    name: "SolPlanit PVGIS 전문가 발전량 분석",
    description,
    features: ["좌표 기반 분석", "경사·방위 입력", "시스템 손실", "월별·연간 발전량", "PVGIS 출처와 가정", "CSV·JSON·차트·PDF 다운로드"],
    assumptions: ["PVGIS 5.3 기후 데이터와 사용자가 입력한 시스템 조건을 사용", "현장 음영, 오염, 가동 중단, 장비 편차와 장기 열화는 별도 검토가 필요"],
  }),
];

export default function ProPage() {
  return (
    <main>
      <StructuredData graph={structuredData} />
      <ProWorkspace />
      <SeoGuide content={proSeoGuide} />
    </main>
  );
}
