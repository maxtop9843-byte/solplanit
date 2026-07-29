export type InstallationCase = {
  slug: string;
  category: "공장·창고" | "주택" | "상가";
  title: string;
  location: string;
  capacityKw: number;
  panelCount: number;
  annualGenerationKwh: number;
  purpose: string;
  summary: string;
  building: string;
  roof: string;
  imageUrl: string;
  highlights: string[];
  note: string;
};

export const installationCases: InstallationCase[] = [
  {
    slug: "hwaseong-factory-48kw",
    category: "공장·창고",
    title: "넓은 지붕을 활용한 자가소비형 설치",
    location: "경기 화성",
    capacityKw: 48.6,
    panelCount: 88,
    annualGenerationKwh: 59000,
    purpose: "주간 전력 사용량 절감",
    summary: "가동 시간과 전력 사용 패턴을 먼저 확인하고, 지붕의 빈 면적을 중심으로 설계한 사례예요.",
    building: "철골조 공장",
    roof: "경사지붕",
    imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=82",
    highlights: ["자가소비 우선", "유지보수 동선 확보", "향후 증설 여지 검토"],
    note: "표시된 발전량과 구성은 이해를 돕기 위한 사례값이며 실제 결과는 현장 조건과 설계에 따라 달라질 수 있어요.",
  },
  {
    slug: "asan-house-6kw",
    category: "주택",
    title: "전기요금 절감을 목표로 한 소규모 설치",
    location: "충남 아산",
    capacityKw: 6.2,
    panelCount: 12,
    annualGenerationKwh: 7400,
    purpose: "가정용 전기요금 절감",
    summary: "생활 전력 사용량과 지붕 방향을 함께 살펴 과도한 용량보다 실제 사용에 맞춘 구성을 선택한 사례예요.",
    building: "단독주택",
    roof: "박공지붕",
    imageUrl: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=82",
    highlights: ["생활 사용량 기준", "지붕 방향 반영", "주변 음영 확인"],
    note: "지붕 구조, 전기 사용량, 지역 일사량에 따라 설치 가능 용량과 절감액은 달라질 수 있어요.",
  },
  {
    slug: "gimpo-store-18kw",
    category: "상가",
    title: "낮 시간 영업 전력을 고려한 옥상 설치",
    location: "경기 김포",
    capacityKw: 18.4,
    panelCount: 34,
    annualGenerationKwh: 22100,
    purpose: "영업시간 전력비 절감",
    summary: "냉난방과 조명 사용이 많은 낮 시간대 소비를 중심으로 옥상 설비 배치와 점검 공간을 검토한 사례예요.",
    building: "근린생활시설",
    roof: "평지붕",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=82",
    highlights: ["낮 시간 자가소비", "옥상 설비 간격 확보", "점검 통로 유지"],
    note: "사례값은 특정 수익이나 절감 효과를 보장하지 않으며 견적 전 현장 확인이 필요해요.",
  },
];

export function getInstallationCase(slug: string) {
  return installationCases.find((item) => item.slug === slug);
}
