import type { Metadata } from "next";
import Link from "next/link";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

export const metadata: Metadata = notFoundMetadata;

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "clamp(48px, 10vw, 120px) 24px",
        textAlign: "center",
      }}
    >
      <section aria-labelledby="not-found-title" style={{ maxWidth: 640 }}>
        <p style={{ margin: "0 0 12px", fontWeight: 700, letterSpacing: "0.08em" }}>404</p>
        <h1 id="not-found-title" style={{ margin: "0 0 18px", fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1.08 }}>
          페이지를 찾을 수 없습니다
        </h1>
        <p style={{ margin: "0 auto 28px", maxWidth: 520, lineHeight: 1.7 }}>
          주소가 잘못 입력되었거나 페이지가 이동했을 수 있어요. 홈에서 설치 가능 용량을 계산하거나 태양광 가이드를 확인해보세요.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          <Link className="primaryButton" href="/">
            홈으로 돌아가기
          </Link>
          <Link className="secondaryLink" href="/guides">
            설치 가이드 보기 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
