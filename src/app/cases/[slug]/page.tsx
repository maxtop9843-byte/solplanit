import Link from "next/link";
import { notFound } from "next/navigation";
import { getInstallationCase, installationCases } from "../caseData";
import "../cases.css";

export function generateStaticParams() {
  return installationCases.map(({ slug }) => ({ slug }));
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getInstallationCase(slug);
  if (!item) notFound();

  return (
    <main className="caseDetailPage">
      <header className="caseSiteHeader" aria-label="사례 상세 탐색">
        <Link className="brand" href="/" aria-label="SolPlanit 홈"><span className="brandMark" aria-hidden="true" />SolPlanit</Link>
        <Link className="caseHeaderCta" href="/cases">사례 목록</Link>
      </header>

      <section className="caseDetailHero">
        <div className="caseDetailImage" role="img" aria-label={`${item.location} ${item.category} 태양광 설치 사례 이미지`} style={{ backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(0,0,0,.52)), url(${item.imageUrl})` }} />
        <div className="caseDetailIntro">
          <p className="sectionKicker">{item.category} · {item.location}</p>
          <h1>{item.capacityKw}kW<br />{item.title}</h1>
          <p>{item.summary}</p>
        </div>
      </section>

      <section className="caseFacts" aria-label="설치 사례 주요 정보">
        <dl>
          <div><dt>설치 용량</dt><dd>{item.capacityKw}kW</dd></div>
          <div><dt>패널 수</dt><dd>약 {item.panelCount}장</dd></div>
          <div><dt>예상 연간 발전량</dt><dd>{item.annualGenerationKwh.toLocaleString("ko-KR")}kWh</dd></div>
          <div><dt>설치 목적</dt><dd>{item.purpose}</dd></div>
          <div><dt>건물 유형</dt><dd>{item.building}</dd></div>
          <div><dt>지붕 조건</dt><dd>{item.roof}</dd></div>
        </dl>
      </section>

      <section className="caseStory" aria-labelledby="case-points-title">
        <div>
          <p className="sectionKicker">설계에서 살펴본 점</p>
          <h2 id="case-points-title">숫자보다 먼저<br />조건을 비교했어요</h2>
        </div>
        <ol>{item.highlights.map((highlight, index) => <li key={highlight}><span>0{index + 1}</span><p>{highlight}</p></li>)}</ol>
      </section>

      <aside className="caseNote" aria-label="사례 수치 안내"><strong>확정 결과가 아닌 참고 사례입니다.</strong><p>{item.note}</p></aside>

      <section className="caseNextAction" aria-labelledby="case-next-title">
        <p className="sectionKicker">내 건물도 확인해보기</p>
        <h2 id="case-next-title">같은 유형의 건물이어도 결과는 달라질 수 있어요</h2>
        <p>면적과 사용 목적을 입력해 내 조건에 맞는 설치 가능 용량부터 확인해보세요.</p>
        <div><Link className="primaryButton" href="/#calculator">무료로 계산하기</Link><Link className="secondaryCaseLink" href="/cases">다른 사례 보기 →</Link></div>
      </section>
    </main>
  );
}
