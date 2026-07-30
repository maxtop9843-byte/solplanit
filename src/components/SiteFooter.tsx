import Link from "next/link";

const trustLinks = [
  ["계산 방법론", "/trust/methodology"],
  ["데이터 출처", "/trust/data-sources"],
  ["가정과 한계", "/trust/assumptions"],
  ["개인정보", "/trust/privacy"],
  ["이용약관", "/trust/terms"],
  ["문의", "/trust/contact"],
] as const;

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="siteFooterInner">
        <div className="siteFooterBrand">
          <Link className="brand" href="/" aria-label="SolPlanit 홈">
            <span className="brandMark" aria-hidden="true" />
            SolPlanit
          </Link>
          <p>계산부터 견적까지, 쉬운 태양광 설치</p>
        </div>
        <nav className="siteFooterNav" aria-label="가이드와 신뢰 정책">
          <Link href="/guides">설치 지식 가이드</Link>
          <Link href="/trust">신뢰·정책 안내</Link>
          {trustLinks.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link href="/trust/editorial-policy">편집 정책</Link>
        </nav>
      </div>
      <p className="siteFooterNotice">계산 결과는 사전 검토용 예상치이며, 실제 설치 전 현장 조사와 전문가 확인이 필요합니다.</p>
    </footer>
  );
}
