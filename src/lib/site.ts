export const SITE_URL = "https://solplanit.vercel.app";

export const SITE_NAME = "SolPlanit";

export const SITE_DESCRIPTION =
  "태양광 설치 가능 용량과 예상 발전량·수익을 계산하고, 견적과 전문가 분석까지 이어가는 태양광 설치 의사결정 플랫폼";

export const PUBLIC_ROUTES = [
  "/",
  "/pro",
  "/cases",
  "/cases/hwaseong-factory-48kw",
  "/cases/asan-house-6kw",
  "/community",
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
