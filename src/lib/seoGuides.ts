import type { SeoGuideContent } from "../components/SeoGuide";

const commonLinks = [
  { href: "/#calculator", label: "설치 가능 용량 계산", description: "건물 유형과 면적으로 예상 설치 규모를 확인합니다." },
  { href: "/pro", label: "전문가 발전량 분석", description: "좌표, 경사, 방위와 손실률을 반영해 더 정밀하게 검토합니다." },
  { href: "/trust/assumptions", label: "가정과 한계", description: "이 계산이 무엇을 전제했고 어디까지만 말할 수 있는지 밝힙니다." },
];

export const homeSeoGuide: SeoGuideContent = {
  breadcrumb: [{ label: "홈" }, { label: "태양광 설치 계산" }],
  eyebrow: "계산 방법과 해석",
  title: "설치 가능 용량부터 절감액·수익까지 한 흐름으로 확인하세요",
  intro: "SolPlanit은 면적만 용량으로 바꾸는 단일 계산기가 아닙니다. 건물 유형과 지역, 사용 가능한 면적, 전기 사용 목적을 차례로 반영해 설치 규모와 발전량, 절감 또는 판매 수익의 예상 범위를 보여줍니다.",
  example: { title: "공장 지붕 300㎡를 자가소비로 검토한다면", inputs: ["건물 유형: 공장·창고", "사용 가능 면적: 300㎡", "목적: 낮 시간 전력 자가소비"], result: "추천 용량 → 발전량 → 절감액 순서로 확인", note: "표시값은 사전 검토용입니다. 구조 하중, 음영, 설비 간격, 전력 사용 패턴에 따라 실제 결과가 달라집니다." },
  faqs: [
    { question: "대략적인 면적만 알아도 계산할 수 있나요?", answer: "가능합니다. 처음에는 추정 면적으로 시작하고, 견적 단계에서 통로·설비·이격거리와 구조 조건을 반영해 사용 가능 면적을 다시 확인하세요." },
    { question: "계산 결과가 실제 견적과 다른 이유는 무엇인가요?", answer: "현장 경사와 방향, 음영, 구조 보강, 계통 연계, 장비 사양과 공사 조건이 실제 설계와 비용에 추가로 반영되기 때문입니다." },
    { question: "절감과 판매 수익 중 무엇을 선택해야 하나요?", answer: "낮 시간 전력 사용이 많은 건물은 자가소비 절감을 먼저 비교하고, 판매 목적이라면 SMP·REC 가격과 계통 조건을 별도로 검토하는 편이 좋습니다." },
  ],
  links: commonLinks,
};

export const proSeoGuide: SeoGuideContent = {
  breadcrumb: [{ label: "홈", href: "/" }, { label: "전문가용 발전량 분석" }],
  eyebrow: "PVGIS 기반 전문 검토",
  title: "좌표와 시스템 조건을 명시해 재현 가능한 발전량 분석을 만드세요",
  intro: "전문가 워크스페이스는 설치 위치, 용량, 모듈 기술, 설치 방식, 손실률, 경사·방위, 지평선과 복사 데이터베이스를 한 프로젝트 안에서 관리합니다. 결과에는 입력 가정과 출처를 함께 남겨 고객 설명과 재검토에 활용할 수 있습니다.",
  example: { title: "서울 20kW 고정식 시스템을 비교한다면", inputs: ["설치 용량: 20kW", "경사·방위: 현장값 또는 최적각", "손실률·지평선·복사 DB 명시"], result: "연간·월별 발전량과 변동 범위 확인", note: "같은 용량도 좌표, 방향, 손실 가정에 따라 결과가 달라집니다. 보고서에는 사용한 입력과 PVGIS 출처를 함께 보존하세요." },
  faqs: [
    { question: "일반 계산과 전문가 분석의 차이는 무엇인가요?", answer: "일반 계산은 빠른 사전 판단을 위한 평균 가정을 사용합니다. 전문가 분석은 좌표와 시스템 조건을 직접 지정하고 월별 결과와 데이터 출처를 함께 확인합니다." },
    { question: "PVGIS 결과를 보증 발전량으로 사용할 수 있나요?", answer: "아닙니다. PVGIS는 기후 데이터와 입력 가정을 바탕으로 한 추정치입니다. 현장 음영, 오염, 가동 중단, 장비 편차와 장기 열화를 별도로 고려해야 합니다." },
    { question: "어떤 값을 보고서에 반드시 남겨야 하나요?", answer: "좌표, 용량, 모듈·설치 방식, 손실률, 경사·방위, 지평선 사용 여부, 복사 데이터베이스, 조회 시점과 데이터 버전을 남기는 것이 좋습니다." },
  ],
  links: [commonLinks[0], { href: "/solar/solar-generation", label: "발전량 계산 해설", description: "발전량을 좌우하는 조건과 일반 사용자용 설명을 확인합니다." }, { href: "/account", label: "저장된 프로젝트", description: "같은 브라우저에 저장한 계산과 프로젝트를 다시 엽니다." }],
};

const intentOverrides: Record<string, Pick<SeoGuideContent, "example" | "faqs">> = {
  "solar-installation-capacity": { example: { title: "주택 지붕 사용 가능 면적 45㎡", inputs: ["주택 지붕", "사용 가능 면적 45㎡", "통로와 음영 구간 제외"], result: "예상 설치 용량과 패널 수 확인", note: "전체 지붕 면적이 아니라 실제 배치 가능한 면적을 입력해야 합니다." }, faqs: [{ question: "평을 ㎡로 바꿔야 하나요?", answer: "입력 화면에서 단위를 선택할 수 있습니다. 결과 비교 시에는 같은 단위를 사용하세요." }, { question: "패널 출력이 바뀌면 패널 수도 달라지나요?", answer: "같은 설치 용량이라도 패널 1장당 출력에 따라 필요한 장수와 배치가 달라집니다." }, { question: "구조 검토는 언제 필요한가요?", answer: "지붕 설치는 견적 확정 전에 구조 안전성과 고정 방식 검토가 필요합니다." }] },
  "solar-generation": { example: { title: "20kW 시스템의 연간 발전량", inputs: ["설치 용량 20kW", "지역별 평균 발전시간", "시스템 손실 포함"], result: "월별 흐름과 연간 합계 비교", note: "여름·겨울의 월별 차이와 연간 합계의 일관성을 함께 보세요." }, faqs: [{ question: "발전량은 매년 같은가요?", answer: "기상 조건과 설비 상태에 따라 해마다 달라질 수 있습니다." }, { question: "남향이 아니면 설치할 수 없나요?", answer: "설치는 가능하지만 방향과 경사에 따라 발전량 차이가 생길 수 있습니다." }, { question: "음영은 어떻게 반영하나요?", answer: "일반 계산에서는 제한적이므로 정밀 검토에서는 현장 음영과 지평선을 별도로 확인하세요." }] },
  "solar-savings": { example: { title: "낮 시간 사용량이 많은 상가", inputs: ["예상 발전량", "자가소비 비율", "적용 전력 단가"], result: "월·연간 절감액과 단순 회수기간", note: "발전량 전부가 아니라 실제 건물에서 소비한 전력이 절감에 직접 기여합니다." }, faqs: [{ question: "자가소비율은 무엇인가요?", answer: "발전한 전력 중 건물에서 바로 사용한 비율입니다." }, { question: "전력 단가는 어떤 값을 써야 하나요?", answer: "최근 고지서의 실제 사용 구간과 계약종별을 참고하세요." }, { question: "회수기간은 금융비용을 포함하나요?", answer: "현재 값은 단순 회수기간이므로 금융비용, 유지관리비와 교체비를 별도로 검토해야 합니다." }] },
  "solar-smp-rec-revenue": { example: { title: "100kW 판매형 수익 시나리오", inputs: ["연간 예상 발전량", "SMP 가격", "REC 가격과 가중치"], result: "SMP 수익 + REC 수익 비교", note: "시장 가격과 제도 조건을 바꿔 낙관·기준·보수 시나리오를 비교하세요." }, faqs: [{ question: "SMP와 REC는 어디서 확인하나요?", answer: "계약과 거래 시점의 공식 시장·제도 자료를 확인해야 합니다." }, { question: "REC 가중치는 항상 같은가요?", answer: "설치 유형과 제도 기준에 따라 달라질 수 있습니다." }, { question: "계산 수익이 실제 매출인가요?", answer: "입력 가격을 적용한 추정치이며 계약, 제한, 비용과 세금을 반영한 확정 매출이 아닙니다." }] },
  "rooftop-solar": { example: { title: "상가 평지붕 120㎡", inputs: ["설비·통로 구간 제외", "주변 건물 음영 확인", "낮 시간 자가소비 선택"], result: "배치 가능한 용량과 절감 가능성", note: "옥상 방수와 구조, 유지관리 동선을 견적 단계에서 함께 확인하세요." }, faqs: [{ question: "옥상 방수에 문제가 생기지 않나요?", answer: "고정 방식과 방수 상세에 따라 달라지므로 시공 전 방수 책임 범위를 확인하세요." }, { question: "노후 지붕에도 설치할 수 있나요?", answer: "지붕 상태와 잔여 수명, 보강 필요성을 먼저 점검해야 합니다." }, { question: "설비 그림자도 영향이 있나요?", answer: "실외기, 난간과 인접 구조물의 그림자는 배치와 발전량에 영향을 줍니다." }] },
  "factory-solar": { example: { title: "공장 지붕 1,000㎡", inputs: ["채광창·설비 구간 제외", "구조 하중 검토", "자가소비와 판매 비교"], result: "대용량 설치 규모와 경제성 시나리오", note: "공장 운영시간과 전력 부하를 함께 보면 자가소비 효과를 더 현실적으로 판단할 수 있습니다." }, faqs: [{ question: "샌드위치패널 지붕도 가능한가요?", answer: "지붕 재료와 고정 방식, 부식과 누수 위험을 구조·시공 전문가가 검토해야 합니다." }, { question: "공장 가동 중 시공할 수 있나요?", answer: "안전 동선과 정전 필요 여부를 포함한 공사 계획이 필요합니다." }, { question: "자가소비와 판매를 함께 할 수 있나요?", answer: "설비 구성과 계약 조건에 따라 달라지므로 계통과 요금제 검토가 필요합니다." }] },
  "land-solar": { example: { title: "완만한 경사의 토지 2,000㎡", inputs: ["패널 간격과 진입로 확보", "경사·배수 조건 확인", "계통 연계 가능성 별도 검토"], result: "예상 용량과 판매 수익 시나리오", note: "면적 계산은 사업 가능성의 첫 단계이며 인허가와 계통 검토를 대신하지 않습니다." }, faqs: [{ question: "용도지역만 보면 설치 가능 여부를 알 수 있나요?", answer: "개별 법령, 조례, 개발행위와 환경·민원 조건을 함께 확인해야 합니다." }, { question: "경사진 토지는 불리한가요?", answer: "토목, 배수, 구조물과 접근 비용이 증가할 수 있습니다." }, { question: "계통 연계는 언제 확인해야 하나요?", answer: "사업성 판단 초기에 가능한 연계 용량과 비용을 확인하는 편이 안전합니다." }] },
};

export function getIntentSeoGuide(slug: string, title: string): SeoGuideContent {
  const detail = intentOverrides[slug] ?? intentOverrides["solar-generation"];
  return {
    breadcrumb: [{ label: "홈", href: "/" }, { label: "태양광 알아보기", href: "/#calculator" }, { label: title }],
    eyebrow: "예시와 자주 묻는 질문",
    title: `${title} 계산 결과를 실제 결정에 활용하는 방법`,
    intro: "아래 예시는 입력과 결과가 어떻게 연결되는지 보여주는 설명용 시나리오입니다. 실제 설치 가능 여부와 경제성은 현장, 구조, 음영, 계통, 요금과 제도 조건을 반영해 다시 확인해야 합니다.",
    example: detail.example,
    faqs: detail.faqs,
    links: commonLinks,
  };
}
