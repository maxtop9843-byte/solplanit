import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "정밀 태양광 발전량 계산기",
  description: "지도에서 위치를 고르고 설치 용량을 넣어 PVGIS 5.3 기반 월별·연간 태양광 발전량을 자세히 계산합니다.",
  alternates: { canonical: "/pro", languages: { ko: "/pro", "x-default": "/pro" } },
  openGraph: {
    title: "정밀 태양광 발전량 계산기 | SolPlanit",
    description: "지도에서 위치를 고르고 설치 조건을 조정해 PVGIS 5.3 기반 발전량을 계산합니다.",
    url: "/pro",
  },
};

export default function ProLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
