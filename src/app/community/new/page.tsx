import Link from "next/link";
import { parseCommunityCalculationAttachment } from "../communityAttachment";
import CommunityPostComposer from "./CommunityPostComposer";
import "../community.css";

export const metadata = {
  title: "계산 결과로 질문하기 | SolPlanit",
  description: "태양광 계산 결과를 안전하게 첨부해 설치 전 질문이나 견적 검토 게시물을 준비하세요.",
};

export default async function CommunityNewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const calculation = parseCommunityCalculationAttachment(params);

  if (!calculation) {
    return (
      <main className="communityComposerPage">
        <header className="communityHeader" aria-label="게시물 작성 탐색">
          <Link className="communityBrand" href="/" aria-label="SolPlanit 홈"><span aria-hidden="true" />SolPlanit</Link>
          <nav aria-label="게시물 작성 메뉴"><Link href="/community">커뮤니티로 돌아가기</Link></nav>
        </header>
        <section className="composerEmpty" aria-labelledby="composer-empty-title">
          <p>첨부할 계산 결과가 없어요</p>
          <h1 id="composer-empty-title">먼저 내 조건을 계산해주세요</h1>
          <span>완료된 계산 결과에서 질문하기를 선택하면 용량, 발전량, 예상 금액과 회수기간을 안전하게 가져와요.</span>
          <Link className="communityPrimary" href="/#calculator">무료로 계산하기</Link>
        </section>
      </main>
    );
  }

  return <CommunityPostComposer calculation={calculation} />;
}
