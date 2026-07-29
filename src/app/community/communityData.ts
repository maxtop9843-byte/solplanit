export const communityCategoryIds = [
  "pre-install",
  "quote-review",
  "installation-review",
  "expert-answer",
  "generation-data",
] as const;

export type CommunityCategoryId = (typeof communityCategoryIds)[number];

export type CommunityCategory = {
  id: CommunityCategoryId;
  label: string;
  description: string;
  prompt: string;
};

export type CommunityPost = {
  id: string;
  categoryId: CommunityCategoryId;
  title: string;
  summary: string;
  authorRole: "일반 사용자" | "전문가";
  region?: string;
  buildingType?: "주택" | "상가·건물" | "공장·창고" | "토지";
  capacityKw?: number;
  annualGenerationKwh?: number;
  createdAt: string;
  answerCount: number;
  isExample: true;
};

export const communityCategories: CommunityCategory[] = [
  {
    id: "pre-install",
    label: "설치 전 질문",
    description: "건물 조건, 설치 순서, 준비할 내용을 묻고 답해요.",
    prompt: "설치를 검토 중인 건물과 가장 궁금한 점을 적어주세요.",
  },
  {
    id: "quote-review",
    label: "견적 검토",
    description: "용량, 장비, 공사 범위와 조건을 비교해요.",
    prompt: "개인정보를 지운 견적 조건과 비교가 필요한 항목을 적어주세요.",
  },
  {
    id: "installation-review",
    label: "설치 후기",
    description: "상담부터 시공 이후까지 실제 경험을 나눠요.",
    prompt: "건물 유형, 설치 과정과 도움이 됐던 점을 알려주세요.",
  },
  {
    id: "expert-answer",
    label: "전문가 답변",
    description: "설계와 시공 관점의 설명을 모아 봐요.",
    prompt: "근거와 가정을 구분하고 이해하기 쉬운 말로 답변해주세요.",
  },
  {
    id: "generation-data",
    label: "실제 발전량",
    description: "지역과 설비 조건을 함께 기록해 발전량을 비교해요.",
    prompt: "지역, 설치 용량, 기간과 발전량을 함께 적어주세요.",
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "example-factory-roof-check",
    categoryId: "pre-install",
    title: "공장 지붕 50kW 검토 전에 무엇부터 확인해야 하나요?",
    summary: "지붕 면적은 충분해 보이지만 구조 검토와 전력 사용 패턴 중 무엇을 먼저 준비해야 하는지 궁금해요.",
    authorRole: "일반 사용자",
    region: "경기 화성",
    buildingType: "공장·창고",
    capacityKw: 50,
    createdAt: "2026-07-30",
    answerCount: 3,
    isExample: true,
  },
  {
    id: "example-house-quote-review",
    categoryId: "quote-review",
    title: "주택용 6kW 견적에서 확인할 항목을 알려주세요",
    summary: "모듈과 인버터 보증, 구조물 사양, 사후관리 범위를 중심으로 두 견적을 비교하려고 해요.",
    authorRole: "일반 사용자",
    region: "충남 아산",
    buildingType: "주택",
    capacityKw: 6,
    createdAt: "2026-07-29",
    answerCount: 5,
    isExample: true,
  },
  {
    id: "example-monthly-generation",
    categoryId: "generation-data",
    title: "상가 18kW 설비의 월별 발전량을 비교해보고 싶어요",
    summary: "같은 지역의 비슷한 용량과 비교할 수 있도록 기간과 음영 조건을 함께 기록했어요.",
    authorRole: "일반 사용자",
    region: "경기 김포",
    buildingType: "상가·건물",
    capacityKw: 18.4,
    annualGenerationKwh: 22100,
    createdAt: "2026-07-28",
    answerCount: 2,
    isExample: true,
  },
];

export function getCommunityCategory(id: string) {
  return communityCategories.find((category) => category.id === id);
}

export function getPostsByCategory(id: CommunityCategoryId | "all") {
  return id === "all"
    ? communityPosts
    : communityPosts.filter((post) => post.categoryId === id);
}
