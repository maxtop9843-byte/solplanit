import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeoGuide from "../../../components/SeoGuide";
import { getSearchIntentPage, searchIntentPages } from "../../../lib/searchIntentPages";
import { getIntentSeoGuide } from "../../../lib/seoGuides";
import "./searchIntent.css";

export function generateStaticParams() {
  return searchIntentPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getSearchIntentPage(slug);
  if (!page) return {};

  const canonical = `/solar/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical, languages: { ko: canonical, "x-default": canonical } },
    openGraph: { title: `${page.title} | SolPlanit`, description: page.description, url: canonical },
  };
}

export default async function SearchIntentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSearchIntentPage(slug);
  if (!page) notFound();

  const related = page.related
    .map((relatedSlug) => getSearchIntentPage(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="intentPage">
      <header className="intentHeader" aria-label="주요 탐색">
        <Link className="intentBrand" href="/">SolPlanit</Link>
        <nav aria-label="관련 메뉴">
          <Link href="/cases">설치 사례</Link>
          <Link href="/community">질문·견적</Link>
          <Link href="/pro">전문가용</Link>
        </nav>
      </header>

      <section className="intentHero" aria-labelledby="intent-title">
        <div>
          <p className="intentEyebrow">{page.eyebrow}</p>
          <h1 id="intent-title">{page.title}</h1>
          <p className="intentDescription">{page.description}</p>
          <div className="intentActions">
            <Link className="intentPrimary" href="/#calculator">무료로 계산하기</Link>
            <Link className="intentSecondary" href="/cases">비슷한 설치 사례 보기 →</Link>
          </div>
        </div>
        <aside className="intentAnswer" aria-labelledby="answer-title">
          <span>먼저 알아두세요</span>
          <h2 id="answer-title">{page.question}</h2>
          <p>{page.answer}</p>
        </aside>
      </section>

      <section className="intentSection" aria-labelledby="check-title">
        <p className="intentEyebrow">계산 전에 확인할 것</p>
        <h2 id="check-title">결과를 이해하는 세 가지 기준</h2>
        <div className="intentCards">
          {page.highlights.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="intentFlow" aria-labelledby="flow-title">
        <div>
          <p className="intentEyebrow">한 번에 이어지는 흐름</p>
          <h2 id="flow-title">계산에서 전문가 검토까지</h2>
          <p>각 페이지는 독립된 계산기 모음이 아니라 같은 태양광 설치 여정으로 연결됩니다.</p>
        </div>
        <ol>
          {page.steps.map((step, index) => (
            <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
          ))}
        </ol>
      </section>

      <section className="intentRelated" aria-labelledby="related-title">
        <div className="intentSectionHeading">
          <div><p className="intentEyebrow">함께 확인하기</p><h2 id="related-title">다음 판단에 필요한 페이지</h2></div>
          <Link href="/#calculator">내 조건 계산하기 →</Link>
        </div>
        <div className="intentRelatedGrid">
          {related.map((item) => (
            <Link key={item.slug} href={`/solar/${item.slug}`}>
              <span>{item.eyebrow}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <SeoGuide content={getIntentSeoGuide(page.slug, page.title)} />

      <section className="intentCta" aria-labelledby="cta-title">
        <p className="intentEyebrow">예상값부터 시작</p>
        <h2 id="cta-title">내 건물과 토지 조건으로 직접 확인해보세요</h2>
        <p>결과는 사전 검토용 예상값입니다. 실제 설치 가능 여부와 경제성은 현장, 구조, 계통, 제도 조건에 따라 달라질 수 있습니다.</p>
        <Link className="intentPrimary" href="/#calculator">무료로 확인하기</Link>
      </section>
    </main>
  );
}
