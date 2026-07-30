import Link from "next/link";
import "./seoGuide.css";

export type SeoGuideContent = {
  breadcrumb: { label: string; href?: string }[];
  eyebrow: string;
  title: string;
  intro: string;
  example: {
    title: string;
    inputs: string[];
    result: string;
    note: string;
  };
  faqs: { question: string; answer: string }[];
  links: { href: string; label: string; description: string }[];
};

export default function SeoGuide({ content }: { content: SeoGuideContent }) {
  return (
    <section className="seoGuide" aria-labelledby="seo-guide-title">
      <nav className="seoBreadcrumb" aria-label="현재 위치">
        <ol>
          {content.breadcrumb.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            </li>
          ))}
        </ol>
      </nav>

      <div className="seoGuideIntro">
        <p className="seoGuideEyebrow">{content.eyebrow}</p>
        <h2 id="seo-guide-title">{content.title}</h2>
        <p>{content.intro}</p>
      </div>

      <article className="seoExample" aria-labelledby="seo-example-title">
        <div>
          <p className="seoGuideEyebrow">계산 예시</p>
          <h3 id="seo-example-title">{content.example.title}</h3>
          <ul>{content.example.inputs.map((input) => <li key={input}>{input}</li>)}</ul>
        </div>
        <div className="seoExampleResult">
          <span>예상 결과</span>
          <strong>{content.example.result}</strong>
          <p>{content.example.note}</p>
        </div>
      </article>

      <div className="seoFaq" aria-labelledby="seo-faq-title">
        <p className="seoGuideEyebrow">자주 묻는 질문</p>
        <h3 id="seo-faq-title">결정 전에 많이 확인하는 내용</h3>
        <div>
          {content.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="seoRelated" aria-labelledby="seo-related-title">
        <p className="seoGuideEyebrow">다음 단계</p>
        <h3 id="seo-related-title">계산 결과를 이어서 활용하세요</h3>
        <div>
          {content.links.map((link) => (
            <Link href={link.href} key={link.href}>
              <strong>{link.label}</strong>
              <span>{link.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
