import Link from "next/link";
import { installationCases } from "./caseData";
import "./cases.css";

export const metadata = {
  title: "태양광 설치 사례 | SolPlanit",
  description: "건물 유형과 설치 목적이 다른 태양광 설치 사례를 비교해보세요.",
};

export default function CasesPage() {
  return (
    <main className="casesPage">
      <header className="caseSiteHeader" aria-label="사례 페이지 탐색">
        <Link className="brand" href="/" aria-label="SolPlanit 홈">
          <span className="brandMark" aria-hidden="true" />SolPlanit
        </Link>
        <Link className="caseHeaderCta" href="/#calculator">내 조건 계산하기</Link>
      </header>

      <section className="casesHero" aria-labelledby="cases-page-title">
        <p className="sectionKicker">설치 사례</p>
        <h1 id="cases-page-title">비슷한 건물은<br />어떻게 선택했을까요?</h1>
        <p>용량 숫자만 비교하지 않고 건물 유형, 사용 목적, 지붕 조건과 설계 포인트를 함께 살펴보세요.</p>
      </section>

      <section className="caseGallery" aria-label="태양광 설치 사례 목록">
        {installationCases.map((item, index) => (
          <article className={`galleryCard galleryCard${index + 1}`} key={item.slug}>
            <Link href={`/cases/${item.slug}`} aria-label={`${item.location} ${item.capacityKw}킬로와트 사례 자세히 보기`}>
              <div className="galleryImage" style={{ backgroundImage: `linear-gradient(180deg, transparent 38%, rgba(0,0,0,.72)), url(${item.imageUrl})` }} />
              <div className="galleryContent">
                <div className="galleryMeta"><span>{item.category}</span><span>{item.location}</span></div>
                <h2>{item.capacityKw}kW</h2>
                <p>{item.title}</p>
                <dl>
                  <div><dt>예상 연간 발전량</dt><dd>{item.annualGenerationKwh.toLocaleString("ko-KR")}kWh</dd></div>
                  <div><dt>설치 목적</dt><dd>{item.purpose}</dd></div>
                </dl>
                <span className="galleryLink">사례 자세히 보기 →</span>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <section className="caseDisclaimer" aria-label="사례 이용 안내">
        <strong>사례는 비교를 위한 출발점이에요.</strong>
        <p>표시된 값은 이해를 돕기 위한 예시이며 설치 가능 여부, 발전량, 비용과 절감 효과를 보장하지 않아요. 실제 결정 전에는 현장 조사와 전문가 검토가 필요합니다.</p>
        <Link className="primaryButton" href="/#calculator">내 조건 무료로 확인하기</Link>
      </section>
    </main>
  );
}
