import { installationCases } from "./cases/caseData";

/**
 * Homepage content.
 *
 * Everything a non-engineer needs to change lives here. Claims are kept to
 * what the product can actually evidence — no implied guarantees of savings,
 * revenue, payback or installation approval.
 */

/** Trust strip. Typographic, not cards — figure carries the weight, label explains it. */
export const trustFigures = [
  {
    figure: String(installationCases.length),
    unit: "건",
    label: "공개 시공 사례",
    note: "건물 유형과 설계 판단까지 함께 공개해요.",
  },
  {
    figure: "4",
    unit: "단계",
    label: "상담 · 설계 · 시공 · 사후관리",
    note: "각 단계에서 무엇을 확인하는지 미리 알려드려요.",
  },
  {
    figure: "PVGIS",
    unit: "5.3",
    label: "발전량 산출 기준",
    note: "유럽집행위원회 공개 일사량 데이터를 사용해요.",
  },
  {
    figure: "전 항목",
    unit: "",
    label: "계산 가정과 한계 공개",
    note: "어떤 값을 어떻게 계산했는지 모두 확인할 수 있어요.",
  },
] as const;

/** Process — the Anthropic-style editorial column. Serif headings, long-form body. */
export const processSteps = [
  {
    index: "01",
    title: "상담",
    lede: "설치가 가능한 집인지부터 확인합니다.",
    body:
      "지붕 방향과 경사, 주변 음영, 전기 사용 패턴을 먼저 봅니다. 조건이 맞지 않으면 맞지 않다고 말씀드려요. 무리한 용량을 권하지 않는 것이 첫 번째 원칙입니다.",
  },
  {
    index: "02",
    title: "설계",
    lede: "면적이 아니라 실제 사용량에 맞춥니다.",
    body:
      "배치 가능 면적, 패널 규격, 이격거리, 유지보수 동선을 반영해 용량을 확정합니다. 예상 발전량과 절감액은 적용한 가정값과 함께 문서로 드립니다.",
  },
  {
    index: "03",
    title: "시공",
    lede: "지붕을 상하게 하지 않는 것이 기준입니다.",
    body:
      "구조 검토와 방수 마감, 배선 경로, 접지와 안전 기준을 확인하며 진행합니다. 공정별 사진을 남겨 시공 후에도 어떻게 설치됐는지 확인하실 수 있어요.",
  },
  {
    index: "04",
    title: "사후관리",
    lede: "설치 후 발전량이 실제로 나오는지 봅니다.",
    body:
      "초기 발전량을 설계값과 비교하고, 이상이 있으면 원인을 찾습니다. 점검 주기와 보증 범위는 계약 전에 서면으로 확정합니다.",
  },
] as const;

/**
 * Customer testimonials.
 *
 * Intentionally empty. Real quotes with real names, regions and photographs
 * are the only acceptable content here — stock portraits and generated faces
 * are not. Until the company supplies them the section renders its honest
 * variant (see `page.tsx`), which points at the community record instead.
 *
 * To publish testimonials, add entries below. Portraits are optional; when
 * `portrait` is present it must be a real photograph of that customer.
 *
 * Portrait art direction — 4:5 portrait, 800×1000 minimum, natural daylight,
 * photographed at their own property with the installation legible behind
 * them, no studio backdrop, no retouching beyond colour correction.
 */
export type Testimonial = {
  quote: string;
  name: string;
  region: string;
  system: string;
  /** Path under /public. Real photograph only. */
  portrait?: string;
};

export const testimonials: Testimonial[] = [];

/** Navigation shared by the hero pill and the footer. */
export const primaryNav = [
  { label: "시공 사례", href: "/cases" },
  { label: "진행 과정", href: "#process" },
  { label: "예상 절감액", href: "#economics" },
  { label: "질문·견적", href: "/community" },
] as const;
