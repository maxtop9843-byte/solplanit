export type SearchIntentPage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  question: string;
  answer: string;
  highlights: { title: string; body: string }[];
  steps: string[];
  related: string[];
};

export const searchIntentPages: SearchIntentPage[] = [
  {
    slug: "solar-installation-capacity",
    eyebrow: "태양광 설치 용량",
    title: "우리 건물에는 태양광을 얼마나 설치할 수 있을까?",
    description: "건물 유형과 사용 가능한 면적을 바탕으로 추천 설치 용량과 예상 패널 수를 확인하세요.",
    question: "설치 면적만 알면 용량을 계산할 수 있나요?",
    answer: "대략적인 사전 계산은 가능합니다. 실제 설치 가능 용량은 지붕 모양, 구조 안전성, 음영, 이격거리와 설비 배치에 따라 달라집니다.",
    highlights: [
      { title: "면적을 용량으로", body: "건물 유형별 사용 가능 면적과 패널 배치 가정을 적용해 kW 단위로 보여드립니다." },
      { title: "패널 수도 함께", body: "추천 용량을 기준으로 필요한 패널 수를 함께 확인할 수 있습니다." },
      { title: "현장 검토 전 사전 판단", body: "견적을 받기 전에 설치 규모를 가늠하는 출발점으로 활용하세요." },
    ],
    steps: ["건물 유형 선택", "설치 가능한 면적 입력", "추천 용량과 패널 수 확인", "발전량·수익 계산으로 이동"],
    related: ["solar-generation", "rooftop-solar", "factory-solar"],
  },
  {
    slug: "solar-generation",
    eyebrow: "태양광 발전량 계산",
    title: "태양광은 1년에 얼마나 발전할까?",
    description: "설치 용량과 지역별 발전시간 가정을 바탕으로 월간·연간 예상 발전량을 계산하세요.",
    question: "같은 용량이면 발전량도 항상 같나요?",
    answer: "아닙니다. 지역 일사량, 경사와 방향, 음영, 손실률, 장비 효율에 따라 실제 발전량은 달라집니다.",
    highlights: [
      { title: "월간·연간 함께 확인", body: "월별 흐름과 연간 합계를 함께 비교할 수 있습니다." },
      { title: "지역 조건 반영", body: "지역별 평균 발전시간을 적용해 단순 전국 평균보다 현실적인 범위를 제시합니다." },
      { title: "전문 분석으로 연결", body: "정밀 검토가 필요하면 PVGIS 기반 전문가 워크스페이스로 이어갈 수 있습니다." },
    ],
    steps: ["설치 용량 확인", "지역과 목적 선택", "예상 발전량 확인", "절감액 또는 판매 수익 계산"],
    related: ["solar-installation-capacity", "solar-savings", "solar-smp-rec-revenue"],
  },
  {
    slug: "solar-savings",
    eyebrow: "태양광 전기요금 절감",
    title: "태양광 설치로 전기요금을 얼마나 줄일 수 있을까?",
    description: "자가소비를 기준으로 예상 발전량과 전력 단가를 적용해 월간·연간 절감액과 회수기간을 확인하세요.",
    question: "발전한 전기를 모두 절감액으로 계산해도 되나요?",
    answer: "실제 절감액은 낮 시간 전력 사용량과 자가소비 비율에 따라 달라집니다. 사용하지 못한 전력의 처리 방식도 별도로 확인해야 합니다.",
    highlights: [
      { title: "자가소비 기준", body: "발전한 전기를 건물에서 직접 사용하는 조건을 중심으로 계산합니다." },
      { title: "회수기간까지", body: "예상 설치비와 연간 절감액을 비교해 단순 회수기간을 보여드립니다." },
      { title: "가정 공개", body: "전력 단가와 자가소비율 등 결과에 영향을 주는 조건을 함께 표시합니다." },
    ],
    steps: ["설치 용량·발전량 확인", "자가소비 목표 선택", "전력 단가와 설치비 확인", "예상 절감액과 회수기간 비교"],
    related: ["solar-generation", "rooftop-solar", "factory-solar"],
  },
  {
    slug: "solar-smp-rec-revenue",
    eyebrow: "SMP·REC 수익 계산",
    title: "태양광 판매 수익은 어떻게 계산할까?",
    description: "예상 발전량에 SMP 가격과 REC 가중치·가격을 적용해 월간·연간 발전 수익을 계산하세요.",
    question: "SMP와 REC 가격은 고정인가요?",
    answer: "아닙니다. 시장 가격과 제도, 계약 방식에 따라 변동합니다. 계산 결과는 입력한 가격을 기준으로 한 시나리오입니다.",
    highlights: [
      { title: "SMP와 REC 분리", body: "전력 판매 수익과 REC 수익을 나눠서 확인할 수 있습니다." },
      { title: "가중치 직접 확인", body: "설치 유형에 따른 REC 가중치가 결과에 미치는 영향을 비교할 수 있습니다." },
      { title: "가격 변동 시나리오", body: "가격 가정을 바꿔 수익 민감도를 살펴보세요." },
    ],
    steps: ["예상 발전량 확인", "SMP 가격 입력", "REC 가격·가중치 입력", "월간·연간 수익 비교"],
    related: ["solar-generation", "land-solar", "factory-solar"],
  },
  {
    slug: "rooftop-solar",
    eyebrow: "지붕 태양광",
    title: "주택·상가 지붕 태양광 설치 전 무엇을 확인해야 할까?",
    description: "지붕 면적, 방향, 경사, 음영과 구조 조건을 확인하고 설치 용량과 전기요금 절감 가능성을 계산하세요.",
    question: "지붕 면적 전체에 패널을 설치할 수 있나요?",
    answer: "보통은 어렵습니다. 통로, 설비, 가장자리 이격, 음영 구간과 유지관리 공간을 제외해야 합니다.",
    highlights: [
      { title: "사용 가능 면적", body: "전체 지붕 면적이 아니라 실제 패널을 놓을 수 있는 면적을 기준으로 판단합니다." },
      { title: "방향과 음영", body: "남향 여부뿐 아니라 주변 건물과 설비의 그림자도 함께 확인해야 합니다." },
      { title: "자가소비 적합성", body: "낮 시간 전력 사용이 많은 건물일수록 절감 효과를 활용하기 쉽습니다." },
    ],
    steps: ["지붕 형태와 면적 확인", "음영·설비 구간 제외", "설치 용량 계산", "절감액과 견적 비교"],
    related: ["solar-installation-capacity", "solar-savings", "factory-solar"],
  },
  {
    slug: "factory-solar",
    eyebrow: "공장·창고 태양광",
    title: "공장 지붕 태양광, 용량과 경제성을 어떻게 검토할까?",
    description: "넓은 공장·창고 지붕의 설치 가능 용량, 자가소비 절감 또는 발전 판매 수익을 한 흐름에서 비교하세요.",
    question: "공장 지붕이 넓으면 무조건 유리한가요?",
    answer: "면적은 장점이지만 구조 하중, 지붕 재료와 노후도, 설비 음영, 계통 연계 가능 여부를 함께 검토해야 합니다.",
    highlights: [
      { title: "대용량 사전 산정", body: "공장·창고 유형에 맞는 면적 활용률로 예상 설치 규모를 계산합니다." },
      { title: "절감·판매 비교", body: "자가소비와 발전 판매 중 건물 운영에 맞는 목적을 비교할 수 있습니다." },
      { title: "전문가 검토로 이어가기", body: "같은 조건을 전문가용 PVGIS 분석으로 옮겨 더 정밀하게 볼 수 있습니다." },
    ],
    steps: ["지붕 사용 가능 면적 확인", "구조·음영 조건 점검", "자가소비 또는 판매 목적 선택", "전문가용 분석으로 재검토"],
    related: ["solar-installation-capacity", "solar-savings", "solar-smp-rec-revenue"],
  },
  {
    slug: "land-solar",
    eyebrow: "토지 태양광",
    title: "토지 태양광 설치 가능성과 예상 수익을 어떻게 확인할까?",
    description: "토지 면적을 기준으로 예상 설치 용량과 발전량, SMP·REC 판매 수익을 사전 계산하세요.",
    question: "토지만 있으면 태양광을 설치할 수 있나요?",
    answer: "아닙니다. 용도지역, 인허가, 경사, 진입로, 배수, 계통 연계와 민원 가능성 등 별도 검토가 필요합니다.",
    highlights: [
      { title: "면적 기반 용량", body: "패널 간격과 유지관리 공간을 고려한 토지 활용률로 설치 규모를 가늠합니다." },
      { title: "판매 수익 시나리오", body: "예상 발전량에 SMP와 REC 조건을 적용해 수익 범위를 비교합니다." },
      { title: "인허가와 계통 별도 확인", body: "계산 가능성과 실제 사업 가능성은 다르므로 현장·행정 검토가 필요합니다." },
    ],
    steps: ["토지 면적과 지역 확인", "예상 설치 용량 계산", "SMP·REC 조건 입력", "인허가·계통 전문가 검토"],
    related: ["solar-installation-capacity", "solar-generation", "solar-smp-rec-revenue"],
  },
];

export function getSearchIntentPage(slug: string) {
  return searchIntentPages.find((page) => page.slug === slug);
}
