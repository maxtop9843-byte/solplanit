import type { Metadata } from "next";
import Link from "next/link";
import { guidePages } from "@/lib/guideContent";
import "./guides.css";

export const metadata: Metadata = {
  title: "태양광 설치 가이드",
  description: "설치 준비, 견적 검토, 보조금 확인과 핵심 용어를 초보자도 이해하기 쉽게 정리한 SolPlanit 가이드입니다.",
  alternates: { canonical: "/guides", languages: { ko: "/guides", "x-default": "/guides" } },
};

export default function GuidesPage() {
  return <main className="guideShell">
    <header className="guideHeader"><Link href="/">← SolPlanit 홈</Link><span>설치 지식 가이드</span></header>
    <section className="guideHero"><p className="guideEyebrow">광고성 정보보다 판단 기준을 먼저</p><h1>태양광 설치를 결정하기 전에<br />알아야 할 내용을 모았습니다</h1><p>가격이나 수익을 단정하지 않습니다. 현장 확인이 필요한 부분과 비교할 기준을 함께 설명합니다.</p></section>
    <section className="guideGrid" aria-label="태양광 설치 가이드 목록">{guidePages.map((page) => <Link className="guideCard" href={`/guides/${page.slug}`} key={page.slug}><span>{page.eyebrow}</span><h2>{page.title}</h2><p>{page.summary}</p><strong>가이드 읽기 →</strong></Link>)}</section>
    <aside className="guideCallout"><div><p className="guideEyebrow">내 조건으로 확인하기</p><h2>가이드를 읽었다면 실제 조건을 계산해보세요</h2><p>설치 면적과 건물 유형을 입력해 예상 용량을 확인하고, 필요하면 계산 결과를 전문가 분석이나 견적 질문으로 이어갈 수 있습니다.</p></div><div><Link className="guidePrimary" href="/#calculator">무료 계산 시작</Link><Link href="/community">질문·견적 보기 →</Link></div></aside>
  </main>;
}
