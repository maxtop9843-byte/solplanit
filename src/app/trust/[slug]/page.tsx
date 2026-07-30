import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrustPage, trustPages } from "@/lib/trustContent";
import "../trust.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return trustPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getTrustPage(slug);
  if (!page) return {};
  const path = `/trust/${page.slug}`;
  return {
    title: page.title,
    description: page.summary,
    alternates: { canonical: path, languages: { ko: path, "x-default": path } },
    openGraph: { title: `${page.title} | SolPlanit`, description: page.summary, url: path },
  };
}

export default async function TrustDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getTrustPage(slug);
  if (!page) notFound();

  return (
    <main className="trustShell trustDetail">
      <header className="trustHeader"><Link className="trustHome" href="/trust">← 신뢰·정책 안내</Link><Link href="/">SolPlanit 홈</Link></header>
      <article>
        <div className="trustHero trustArticleHero"><p className="trustEyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.summary}</p><small>최종 갱신 {page.updatedAt}</small></div>
        <div className="trustArticle">
          {page.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
        </div>
      </article>
      <nav className="trustRelated" aria-label="관련 신뢰 문서"><h2>함께 확인하면 좋은 내용</h2><div>{trustPages.filter((item) => item.slug !== page.slug).slice(0, 3).map((item) => <Link href={`/trust/${item.slug}`} key={item.slug}><span>{item.eyebrow}</span><strong>{item.title} →</strong></Link>)}</div></nav>
    </main>
  );
}
