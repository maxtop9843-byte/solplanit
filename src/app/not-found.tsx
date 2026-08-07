import type { Metadata } from "next";
import Link from "next/link";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

export const metadata: Metadata = notFoundMetadata;

export default function NotFoundPage() {
  return (
    <main className="notFound">
      <section aria-labelledby="not-found-title">
        <p className="label">404</p>
        <h1 id="not-found-title">페이지를 찾을 수 없습니다</h1>
        <p>
          주소가 잘못 입력되었거나 페이지가 이동했을 수 있어요. 홈에서 설치 가능 용량을 계산하거나 태양광 가이드를 확인해보세요.
        </p>
        <div className="notFoundActions">
          <Link className="primaryButton" href="/">홈으로 돌아가기</Link>
          <Link className="secondaryButton" href="/guides">설치 가이드 보기</Link>
        </div>
      </section>
    </main>
  );
}
