import Link from "next/link";

const footerLinks = [
  ["계산 방법론", "/trust/methodology"],
  ["데이터 출처", "/trust/data-sources"],
  ["가정과 한계", "/trust/assumptions"],
  ["설치 가이드", "/guides"],
  ["개인정보", "/trust/privacy"],
  ["이용약관", "/trust/terms"],
  ["문의", "/trust/contact"],
  ["편집 정책", "/trust/editorial-policy"],
] as const;

export default function SiteFooter() {
  return (
    <>
      <aside className="neutralityBanner" aria-label="운영 원칙">
        <p>솔플래닛은 시공사가 아닙니다.</p>
        <p>어떤 업체로부터도 수수료나 광고비를 받지 않습니다.</p>
        <p>계산 결과를 팔지 않고, 연락처도 받지 않습니다.</p>
      </aside>

      <footer className="siteFooter">
        <p className="siteFooterOwner">개인이 운영하는 정보 사이트</p>
        <p className="siteFooterMeta">
          <span>SolPlanit</span>
          {/* 개인 메일 대신 공개 저장소를 투명성 채널로 쓴다. 계산 코드가 열려 있다는 것 자체가 근거다. */}
          <a href="https://github.com/maxtop9843-byte/solplanit" target="_blank" rel="noreferrer">
            계산 코드 공개 저장소
          </a>
          <span>데이터 최종 갱신 2026-08-08</span>
        </p>
        <nav className="siteFooterNav" aria-label="정책과 방법론">
          {footerLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </footer>
    </>
  );
}
