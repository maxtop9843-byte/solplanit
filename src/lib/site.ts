import { TRUST_ROUTES } from "./trustContent";

export const SITE_URL = "https://solplanit.vercel.app";

export const SITE_NAME = "SolPlanit";

export const SITE_DESCRIPTION =
  "태양광 설치 가능 용량과 예상 발전량·수익을 계산하고, 견적과 전문가 분석까지 이어가는 태양광 설치 의사결정 플랫폼";

export const SEARCH_INTENT_ROUTES = [
  "/solar/solar-installation-capacity",
  "/solar/solar-generation",
  "/solar/solar-savings",
  "/solar/solar-smp-rec-revenue",
  "/solar/rooftop-solar",
  "/solar/factory-solar",
  "/solar/land-solar",
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/pro",
  "/cases",
  "/cases/hwaseong-factory-48kw",
  "/cases/asan-house-6kw",
  "/cases/gimpo-store-18kw",
  "/community",
  ...SEARCH_INTENT_ROUTES,
  ...TRUST_ROUTES,
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
