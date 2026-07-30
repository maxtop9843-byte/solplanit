import type { Metadata } from "next";

export const notFoundMetadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청한 페이지가 없거나 주소가 변경되었습니다. SolPlanit 홈에서 태양광 설치 계산과 가이드를 다시 찾아보세요.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};
