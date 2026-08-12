import { GUIDE_ROUTES } from "./guideContent";
import { TRUST_ROUTES } from "./trustContent";

export const SITE_URL = "https://solplanit.com";

export const SITE_NAME = "SolPlanit";

export const SITE_DESCRIPTION =
  "태양광 설치 가능 용량과 예상 발전량을 계산하고, 계산에 쓴 가정과 출처를 그대로 공개하는 무료 도구입니다. 시공사가 아니며 견적을 중개하지 않습니다.";

export const CALCULATOR_ROUTES = [
  "/calculators/solar-3kw-cost",
  "/calculators/subsidy",
  "/calculators/bill-savings",
] as const;

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
  ...CALCULATOR_ROUTES,
  ...SEARCH_INTENT_ROUTES,
  ...GUIDE_ROUTES,
  ...TRUST_ROUTES,
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
