import type { Metadata } from "next";
import ProWorkspace from "./ProWorkspace";
import "./pro.css";

export const metadata: Metadata = {
  title: "전문가용 발전량 분석",
  description: "지도, 시스템 입력, 결과 요약을 한 화면에서 다루는 SolPlanit 전문가용 태양광 프로젝트 워크스페이스입니다.",
};

export default function ProPage() {
  return <ProWorkspace />;
}
