export default function HomePage() {
  return (
    <main>
      <header className="siteHeader" aria-label="주요 탐색">
        <a className="brand" href="/" aria-label="SolPlanit 홈">
          <span className="brandMark" aria-hidden="true" />
          SolPlanit
        </a>
        <nav className="desktopNav" aria-label="주요 메뉴">
          <a href="#calculator">설치 알아보기</a>
          <a href="#cases">설치 사례</a>
          <a href="#quote">질문·견적</a>
          <a href="#experts">전문가 찾기</a>
        </nav>
        <a className="proLink" href="/pro">전문가용</a>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="heroCopy">
          <p className="eyebrow">복잡한 태양광 설치, 더 쉽게</p>
          <h1 id="page-title">
            태양광 설치,
            <br />
            처음부터 끝까지 한 번에
          </h1>
          <p className="description">
            주소와 설치 면적만 입력하면 설치 가능한 용량과 예상 수익을 확인하고,
            내 조건에 맞는 견적까지 받아볼 수 있어요.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#calculator">무료로 확인하기</a>
            <a className="secondaryLink" href="#cases">실제 설치 사례 보기 <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <div
          className="heroVisual"
          role="img"
          aria-label="맑은 날 태양광 패널이 설치된 건물 지붕"
        >
          <div className="capacityChip" aria-label="예상 설치 용량 약 23.4킬로와트">
            <span>이 건물의 예상 설치 용량</span>
            <strong>약 23.4kW</strong>
          </div>
        </div>
      </section>

      <section id="calculator" className="nextSection" aria-label="설치 가능 용량 계산기 준비 영역">
        <p>우리 건물에는 태양광을 얼마나 설치할 수 있을까?</p>
      </section>
      <span id="cases" className="anchorTarget" aria-hidden="true" />
      <span id="quote" className="anchorTarget" aria-hidden="true" />
      <span id="experts" className="anchorTarget" aria-hidden="true" />
    </main>
  );
}
