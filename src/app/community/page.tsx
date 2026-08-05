import Link from "next/link";
import { communityCategories, communityPosts, getCommunityCategory } from "./communityData";
import "./community.css";

export const metadata = {
  title: "태양광 질문·견적 커뮤니티 | SolPlanit",
  description: "설치 전 질문, 견적 검토, 설치 후기, 전문가 답변과 실제 발전량을 구조화된 조건과 함께 살펴보세요.",
};

const number = new Intl.NumberFormat("ko-KR");

export default function CommunityPage() {
  return (
    <main className="communityPage">
      <header className="communityHeader" aria-label="커뮤니티 탐색">
        <Link className="communityBrand" href="/" aria-label="SolPlanit 홈">
          <span aria-hidden="true" />SolPlanit
        </Link>
        <nav aria-label="커뮤니티 메뉴">
          <Link href="/cases">설치 사례</Link>
          <Link href="/pro">전문가용</Link>
          <Link className="communityHeaderCta" href="/#calculator">내 조건 계산</Link>
        </nav>
      </header>

      <section className="communityHero" aria-labelledby="community-page-title">
        <p>질문과 견적</p>
        <h1 id="community-page-title">계산 다음의 궁금증을<br />조건과 함께 나눠보세요</h1>
        <div>
          <p>태양광 용량과 건물 조건을 함께 기록하면 비슷한 사례를 찾고 더 구체적인 답변을 받을 수 있어요.</p>
          <div className="communityHeroActions">
            <Link className="communityPrimary" href="/#calculator">내 조건 계산하기</Link>
            <a className="communitySecondary" href="#categories">주제 먼저 살펴보기</a>
          </div>
        </div>
      </section>

      <section className="communityJourney" aria-labelledby="community-journey-title">
        <div className="communitySectionIntro">
          <p>SolPlanit 연결 흐름</p>
          <h2 id="community-journey-title">계산한 조건이 더 좋은 답변으로 이어져요</h2>
        </div>
        <ol className="communityJourneyGrid">
          <li><span>01</span><strong>내 건물 계산</strong><p>면적과 목적을 입력해 추천 용량과 예상값을 확인해요.</p></li>
          <li><span>02</span><strong>조건을 첨부해 질문</strong><p>계산 결과를 안전하게 가져와 설치 전 질문이나 견적 검토를 준비해요.</p></li>
          <li><span>03</span><strong>전문가 답변 비교</strong><p>가정과 현장 조건을 분리한 답변을 참고해 다음 결정을 준비해요.</p></li>
        </ol>
      </section>

      <section id="categories" className="categorySection" aria-labelledby="category-title">
        <div className="communitySectionIntro">
          <p>무엇이 궁금한가요?</p>
          <h2 id="category-title">질문의 목적부터 고르면 쉬워요</h2>
        </div>
        <div className="categoryGrid">
          {communityCategories.map((category, index) => (
            <article key={category.id} className="categoryCard">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{category.label}</h3>
              <p>{category.description}</p>
              <small>{category.prompt}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="postSection" aria-labelledby="post-title">
        <div className="communitySectionIntro">
          <p>구조화된 예시</p>
          <h2 id="post-title">조건을 함께 보면 답변이 달라져요</h2>
          <span>아래 글은 게시물 구조를 보여주는 예시이며 실제 회원 게시물이 아니에요.</span>
        </div>
        <div className="postList">
          {communityPosts.map((post) => {
            const category = getCommunityCategory(post.categoryId);
            return (
              <article key={post.id} className="postCard">
                <div className="postMeta">
                  <span>{category?.label}</span>
                  <span>{post.authorRole}</span>
                  <time dateTime={post.createdAt}>{post.createdAt.replaceAll("-", ".")}</time>
                </div>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                <dl>
                  {post.region && <div><dt>지역</dt><dd>{post.region}</dd></div>}
                  {post.buildingType && <div><dt>건물</dt><dd>{post.buildingType}</dd></div>}
                  {post.capacityKw !== undefined && <div><dt>설치 용량</dt><dd>{number.format(post.capacityKw)}kW</dd></div>}
                  {post.annualGenerationKwh !== undefined && <div><dt>연간 발전량</dt><dd>{number.format(post.annualGenerationKwh)}kWh</dd></div>}
                </dl>
                <footer><span>답변 {post.answerCount}</span><span>예시 게시물</span></footer>
              </article>
            );
          })}
        </div>
      </section>

      <section className="communityNotice" aria-labelledby="community-notice-title">
        <div>
          <p>안전하게 질문하기</p>
          <h2 id="community-notice-title">개인정보와 계약 정보는 지우고 올려주세요</h2>
        </div>
        <ul>
          <li>이름, 전화번호, 상세 주소와 계약서 식별정보는 공개하지 않아요.</li>
          <li>수익, 설치 가능 여부와 특정 업체의 품질을 단정하지 않아요.</li>
          <li>답변은 참고 정보이며 구조·전기·계약 사항은 현장 전문가가 확인해야 해요.</li>
        </ul>
      </section>

      <section className="communityBottom" aria-labelledby="community-bottom-title">
        <p>질문 전에 내 조건부터 정리해보세요</p>
        <h2 id="community-bottom-title">계산 결과가 있으면 더 구체적으로 물어볼 수 있어요</h2>
        <Link className="communityPrimary" href="/#calculator">무료로 계산하기</Link>
      </section>
    </main>
  );
}
