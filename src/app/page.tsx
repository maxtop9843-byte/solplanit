import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdZone from "../components/AdZone";
import HeroStage from "../components/HeroStage";
import Reveal from "../components/Reveal";
import SeoGuide from "../components/SeoGuide";
import StructuredData from "../components/StructuredData";
import { homeSeoGuide } from "../lib/seoGuides";
import { buildBreadcrumbNode, buildCalculatorNode, buildFaqNode, buildWebPageNode } from "../lib/structuredData";
import { installationCases } from "./cases/caseData";
import GuidedCalculator from "./GuidedCalculator";
import { primaryNav, processSteps, testimonials, trustFigures } from "./homeContent";
import "./home.css";

export const metadata: Metadata = {
  title: "태양광 설치 계산부터 견적까지",
  description: "건물 유형과 면적을 입력해 태양광 설치 가능 용량, 예상 발전량과 수익·절감액을 확인하고 견적까지 이어가세요.",
  alternates: { canonical: "/", languages: { ko: "/", "x-default": "/" } },
  openGraph: {
    title: "태양광 설치, 처음부터 끝까지 한 번에 | SolPlanit",
    description: "태양광 설치 가능 용량과 예상 발전량·수익을 계산하고 견적까지 이어가세요.",
    url: "/",
  },
};

const homeDescription = "건물 유형과 면적을 입력해 태양광 설치 가능 용량, 예상 발전량과 수익·절감액을 확인하고 견적까지 이어가세요.";
const homeStructuredData = [
  buildWebPageNode("/", "태양광 설치 계산부터 견적까지 | SolPlanit", homeDescription),
  buildBreadcrumbNode("/", [{ label: "홈", href: "/" }, { label: "태양광 설치 계산" }]),
  buildFaqNode("/", homeSeoGuide.faqs),
  buildCalculatorNode({
    path: "/",
    name: "SolPlanit 태양광 설치 계산기",
    description: homeDescription,
    features: ["설치 가능 용량 계산", "예상 패널 수", "연간 발전량", "자가소비 절감액", "SMP·REC 판매 수익", "단순 회수기간"],
    assumptions: ["입력값과 지역 평균을 이용한 사전 검토용 예상치", "구조, 음영, 계통, 요금과 제도 조건에 따라 실제 결과가 달라질 수 있음"],
  }),
];

const [leadCase, ...restCases] = installationCases;

export default function HomePage() {
  return (
    <main id="main-content">
      <StructuredData graph={homeStructuredData} />

      {/* ---------- navigation: floating pill over the hero ---------- */}
      <header className="pillNav" aria-label="주요 탐색">
        <Link className="pillNavBrand" href="/" aria-label="SolPlanit 홈">
          <span className="pillNavMark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.4" fill="currentColor" />
              <path
                d="M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2M4.66 4.66l2.26 2.26M17.08 17.08l2.26 2.26M19.34 4.66l-2.26 2.26M6.92 17.08l-2.26 2.26"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </span>
          SolPlanit
        </Link>
        <nav className="pillNavLinks" aria-label="주요 메뉴">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <Link className="pillNavCta" href="/quote">무료 견적</Link>
      </header>

      {/* ---------- 1. hero ---------- */}
      <HeroStage className="hero" aria-labelledby="page-title">
        <div className="heroSky" aria-hidden="true">
          <video
            className="heroSkyMedia"
            src="/media/hero-sky.mp4"
            poster="/media/hero-sky-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>

        <div className="heroRoof">
          <Image
            className="heroRoofMedia"
            src="/images/hero-rooftop.jpg"
            alt="해질 무렵 햇빛을 받는 주택 지붕 위에 설치된 태양광 패널"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>

        <span className="heroScrim" aria-hidden="true" />

        <div className="heroCopy">
          <p className="label label-inverse">주택 태양광 · 상담부터 사후관리까지</p>
          <h1 id="page-title">
            태양광 설치,
            <br />
            처음부터 끝까지 한 번에
          </h1>
          <p className="heroLede">
            우리 집에 몇 kW를 올릴 수 있는지, 실제로 얼마가 줄어드는지 먼저 계산해보세요.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="/quote">무료 견적 받기</Link>
            <Link className="heroGhost" href="/cases">시공사례 보기</Link>
          </div>
        </div>

        <a className="heroHint" href="#trust" aria-label="아래 내용 보기">
          <span aria-hidden="true" />
          스크롤
        </a>
      </HeroStage>

      {/* ---------- 2. trust figures: typographic strip, no cards ---------- */}
      <section id="trust" className="trustStrip" aria-labelledby="trust-title">
        <div className="shell">
          <h2 id="trust-title" className="trustStripLede">
            수천만 원짜리 결정입니다. 그래서 <em>확인할 수 있는 것</em>만 말씀드립니다.
          </h2>
          <dl className="trustFigures">
            {trustFigures.map((item, index) => (
              <Reveal as="div" key={item.label} delay={index * 70} className="trustFigure">
                <dt>
                  <span className="figure num">
                    {item.figure}
                    {item.unit && <i>{item.unit}</i>}
                  </span>
                  {item.label}
                </dt>
                <dd>{item.note}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- 3. cases: full-bleed photography, never boxed ---------- */}
      <section id="cases" className="caseBleed" aria-labelledby="cases-title">
        <div className="shell caseIntro">
          <p className="label">시공 사례</p>
          <h2 id="cases-title">지붕이 다르면 설계도 달라집니다.</h2>
          <Link className="textLink" href="/cases">사례 전체 보기</Link>
        </div>

        <figure className="caseLead">
          <div className="caseLeadFrame">
            <Image
              src={leadCase.imageUrl}
              alt={`${leadCase.location} ${leadCase.capacityKw}kW ${leadCase.category} 태양광 설치 현장`}
              fill
              sizes="100vw"
            />
          </div>
          <figcaption className="shell caseLeadMeta">
            <div>
              <p className="label">{leadCase.category} · {leadCase.location}</p>
              <h3>{leadCase.title}</h3>
              <p className="caseSummary">{leadCase.summary}</p>
              <Link className="textLink" href={`/cases/${leadCase.slug}`}>이 사례 자세히 보기</Link>
            </div>
            <dl className="caseSpecs">
              <div><dt>설치 용량</dt><dd className="num">{leadCase.capacityKw}kW</dd></div>
              <div><dt>패널 수</dt><dd className="num">{leadCase.panelCount}장</dd></div>
              <div><dt>연간 예상 발전량</dt><dd className="num">{leadCase.annualGenerationKwh.toLocaleString("ko-KR")}kWh</dd></div>
            </dl>
          </figcaption>
        </figure>

        <ul className="caseRow">
          {restCases.slice(0, 2).map((item) => (
            <li key={item.slug}>
              <Link href={`/cases/${item.slug}`}>
                <div className="caseRowFrame">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.location} ${item.capacityKw}kW ${item.category} 태양광 설치 현장`}
                    fill
                    sizes="(max-width: 860px) 100vw, 50vw"
                  />
                </div>
                <p className="label">{item.category} · {item.location}</p>
                <h3><span className="num">{item.capacityKw}kW</span> {item.purpose}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdZone placement="home-after-process" />

      {/* ---------- 4. process: serif, editorial two-column ---------- */}
      <section id="process" className="process" aria-labelledby="process-title">
        <div className="shell processGrid">
          <div className="processAside">
            <p className="label">진행 과정</p>
            <h2 id="process-title" className="serif">
              설치는 하루면 끝나지만, 판단은 그 전에 끝나 있어야 합니다.
            </h2>
            <p className="processAsideNote">
              상담에서 사후관리까지 네 단계에서 각각 무엇을 확인하는지 미리 공개합니다.
              결정에 필요한 정보를 설치 이후에 알게 되는 일이 없도록 하기 위해서예요.
            </p>
          </div>

          <ol className="processList">
            {processSteps.map((step, index) => (
              <Reveal as="li" key={step.index} delay={index * 60}>
                <span className="processIndex num">{step.index}</span>
                <div>
                  <h3 className="serif">{step.title}</h3>
                  <p className="processLede">{step.lede}</p>
                  <p className="processBody">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- 5. economics: a working instrument ---------- */}
      <section id="economics" className="economics" aria-labelledby="economics-title">
        <div className="shell economicsGrid">
          <div className="economicsIntro">
            <p className="label">예상 절감액</p>
            <h2 id="economics-title">얼마가 줄어드는지, 직접 계산해보세요.</h2>
            <p className="economicsNote">
              건물 유형과 면적, 설치 지역을 입력하면 설치 가능 용량과 연간 예상 발전량을 계산합니다.
              단가는 임의로 넣지 않아요. 고지서와 계약서에서 확인한 값을 직접 입력하시면
              그 조건에서의 절감액과 단순 회수기간을 보여드립니다.
            </p>
            <p className="economicsCaveat">
              계산 결과는 사전 검토용 예상치입니다. 실제 설치 가능 여부와 발전량, 절감액은
              현장 조건과 계약, 제도에 따라 달라질 수 있어요.
            </p>
            <Link className="textLink" href="/trust/methodology">계산 방법론과 한계 보기</Link>
          </div>
          <div className="economicsPanel">
            <GuidedCalculator />
          </div>
        </div>
      </section>

      {/* ---------- 6. what owners report ---------- */}
      <section className="voices" aria-labelledby="voices-title">
        <div className="shell">
          <p className="label">설치한 사람들</p>
          {testimonials.length > 0 ? (
            <>
              <h2 id="voices-title" className="serif">직접 설치한 분들의 이야기.</h2>
              <ul className="voiceList">
                {testimonials.map((item) => (
                  <Reveal as="li" key={item.name + item.region} className="voice">
                    {item.portrait && (
                      <div className="voicePortrait">
                        <Image src={item.portrait} alt={`${item.region} ${item.name} 님`} fill sizes="220px" />
                      </div>
                    )}
                    <blockquote className="serif">{item.quote}</blockquote>
                    <p className="voiceWho">
                      {item.name} · {item.region}
                      <span className="num">{item.system}</span>
                    </p>
                  </Reveal>
                ))}
              </ul>
            </>
          ) : (
            <div className="voicesRecord">
              <h2 id="voices-title" className="serif">
                광고 문구보다, 먼저 설치한 사람들의 기록이 정확합니다.
              </h2>
              <p>
                커뮤니티에는 설치 후기와 실제 발전량이 그대로 올라옵니다. 좋은 결과만
                골라 보여드리는 대신, 비슷한 조건의 집이 실제로 어떤 숫자를 받았는지
                직접 확인하시는 편이 낫다고 생각해요.
              </p>
              <Link className="textLink" href="/community">설치 후기와 실제 발전량 보기</Link>
            </div>
          )}
        </div>
      </section>

      <SeoGuide content={homeSeoGuide} />

      {/* ---------- 7. closing ---------- */}
      <section className="closing" aria-labelledby="closing-title">
        <div className="shell closingInner">
          <p className="label label-inverse">무료 · 회원가입 없이</p>
          <h2 id="closing-title">우리 집에 태양광이 맞는지부터 확인해보세요.</h2>
          <p className="closingNote">
            현장 조건을 보지 않고 설치를 권하지 않습니다. 맞지 않으면 맞지 않다고 말씀드려요.
          </p>
          <div className="closingActions">
            <Link className="primaryButton" href="/quote">무료 견적 받기</Link>
            <Link className="closingGhost" href="#economics">먼저 계산해보기</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
