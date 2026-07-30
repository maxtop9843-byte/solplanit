import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "태양광 설치 사례",
  description: "주택, 상가, 공장·창고의 태양광 설치 용량과 예상 발전량, 설계 검토사항을 비교해보세요.",
  alternates: { canonical: "/cases", languages: { ko: "/cases", "x-default": "/cases" } },
  openGraph: {
    title: "태양광 설치 사례 | SolPlanit",
    description: "건물 유형별 태양광 설치 사례와 검토 조건을 살펴보세요.",
    url: "/cases",
  },
};

export default function CasesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
