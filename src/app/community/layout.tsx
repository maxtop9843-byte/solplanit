import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "태양광 질문·견적 커뮤니티",
  description: "태양광 설치 전 질문, 견적 검토, 설치 후기와 실제 발전량을 계산 조건과 함께 비교하세요.",
  alternates: {
    canonical: "/community",
    languages: { ko: "/community", "x-default": "/community" },
  },
  openGraph: {
    title: "태양광 질문·견적 커뮤니티 | SolPlanit",
    description: "계산 결과를 바탕으로 태양광 설치 질문과 견적 조건을 비교하세요.",
    url: "/community",
  },
};

export default function CommunityLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
