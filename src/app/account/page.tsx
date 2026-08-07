import Link from "next/link";
import SavedWorkClient from "./SavedWorkClient";
import "./account.css";

export const metadata = {
  title: "저장한 계산과 프로젝트 | SolPlanit",
  description: "태양광 계산 결과와 전문가 프로젝트를 같은 브라우저에서 저장하고 이어서 확인합니다.",
};

export default function AccountPage() {
  return (
    <main className="accountShell">
      <header className="accountHeader">
        <Link className="accountBrand" href="/">SolPlanit</Link>
        <nav aria-label="계정 페이지 탐색"><Link href="/#calculator">일반 계산</Link><Link href="/pro">전문가용</Link></nav>
      </header>
      <section className="accountHero" aria-labelledby="account-title">
        <p className="accountKicker">내 작업 공간</p>
        <h1 id="account-title">계산과 프로젝트를<br />잃어버리지 않게</h1>
        <p>일반 사용자 계산과 전문가 분석의 출발점을 같은 프로필 아래 정리합니다. 이 MVP는 민감정보 없이 현재 브라우저에만 저장돼요.</p>
      </section>
      <SavedWorkClient />
      <aside className="privacyNote" aria-label="저장 범위 안내"><strong>저장 범위 안내</strong><p>브라우저 데이터 삭제, 시크릿 모드 또는 다른 기기에서는 복원되지 않습니다. 서버 계정과 기기 간 동기화는 후속 인증·데이터베이스 연결 전까지 제공하지 않습니다.</p></aside>
    </main>
  );
}
