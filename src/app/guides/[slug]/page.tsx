import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuidePage, guidePages } from "@/lib/guideContent";
import "../guides.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return guidePages.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuidePage(slug);
  if (!page) return {};
  const path = `/guides/${page.slug}`;
  return { title: page.title, description: page.summary, alternates: { canonical: path, languages: { ko: path, "x-default": path } }, openGraph: { title: `${page.title} | SolPlanit`, description: page.summary, url: path } };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getGuidePage(slug);
  if (!page) notFound();
  const related = page.related.map(getGuidePage).filter((item): item is NonNullable<typeof item> => Boolean(item));
  return <main className="guideShell guideDetail">
    <header className="guideHeader"><Link href="/guides">← 설치 지식 가이드</Link><Link href="/">SolPlanit 홈</Link></header>
    <article>
      <div className="guideHero guideArticleHero"><p className="guideEyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.summary}</p><div className="guideReview"><span>검토: {page.reviewedBy}</span><span>최종 갱신: {page.updatedAt}</span></div></div>
      <div className="guideNotice" role="note"><strong>확인하세요</strong><p>제도, 가격, 계통과 현장 조건은 바뀔 수 있습니다. 이 가이드는 판단 기준을 제공하며 설계·법률·세무·계약 자문을 대신하지 않습니다.</p></div>
      <div className="guideArticle">{page.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((text) => <p key={text}>{text}</p>)}{section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</div>
    </article>
    <nav className="guideRelated" aria-label="관련 가이드"><h2>다음으로 읽을 내용</h2><div>{related.map((item) => <Link href={`/guides/${item.slug}`} key={item.slug}><span>{item.eyebrow}</span><strong>{item.title} →</strong></Link>)}</div></nav>
    <aside className="guideInlineCta"><h2>내 조건은 숫자로 확인하세요</h2><p>가이드의 기준을 바탕으로 설치 가능 용량과 예상 발전량을 계산할 수 있습니다.</p><Link className="guidePrimary" href="/#calculator">무료 계산 시작</Link></aside>
  </main>;
}
