import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "전문가용 태양광 발전량 분석",
  description: "PVGIS 5.3 기반으로 위치, 설치 용량, 경사와 방위, 손실 조건을 반영해 월별·연간 태양광 발전량을 분석하세요.",
  alternates: { canonical: "/pro", languages: { ko: "/pro", "x-default": "/pro" } },
  openGraph: {
    title: "전문가용 태양광 발전량 분석 | SolPlanit",
    description: "PVGIS 5.3 기반 태양광 프로젝트 분석 워크스페이스",
    url: "/pro",
  },
};

export default function ProLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
