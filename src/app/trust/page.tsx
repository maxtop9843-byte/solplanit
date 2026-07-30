import type { Metadata } from "next";
import Link from "next/link";
import { trustPages } from "@/lib/trustContent";
import "./trust.css";

export const metadata: Metadata = {
  title: "신뢰·정책 안내",
  description: "SolPlanit의 계산 방법론, 데이터 출처, 가정과 한계, 개인정보, 약관, 문의와 편집 정책을 확인하세요.",
  alternates: { canonical: "/trust", languages: { ko: "/trust", "x-default": "/trust" } },
};

export default function TrustCenterPage() {
  return (
    <main className="trustShell">
      <header className="trustHeader"><Link className="trustHome" href="/">← SolPlanit 홈</Link><p>신뢰·정책 안내</p></header>
      <section className="trustHero" aria-labelledby="trust-title"><p className="trustEyebrow">숫자와 운영 기준을 공개합니다</p><h1 id="trust-title">태양광 의사결정에 필요한<br />근거를 한곳에서 확인하세요</h1><p>계산 결과를 확정치처럼 포장하지 않습니다. 사용한 방법, 출처, 가정, 한계와 서비스 운영 원칙을 읽기 쉬운 한국어로 설명합니다.</p></section>
      <section className="trustGrid" aria-label="신뢰와 정책 문서">
        {trustPages.map((page) => <Link className="trustCard" href={`/trust/${page.slug}`} key={page.slug}><span>{page.eyebrow}</span><h2>{page.title}</h2><p>{page.summary}</p><strong>읽어보기 →</strong></Link>)}
      </section>
      <aside className="trustCallout"><div><p className="trustEyebrow">계산 다음 단계</p><h2>결과가 맞는지 실제 조건으로 확인하세요</h2><p>일반 계산 결과를 전문가 분석으로 가져가거나, 계산 내용을 첨부해 설치 조건과 견적을 질문할 수 있습니다.</p></div><div className="trustActions"><Link className="trustPrimary" href="/pro">전문가 분석 열기</Link><Link href="/community">질문·견적 보기 →</Link></div></aside>
    </main>
  );
}
