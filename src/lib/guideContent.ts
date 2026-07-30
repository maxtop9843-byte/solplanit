export type GuideSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type GuidePage = { slug: string; eyebrow: string; title: string; summary: string; reviewedBy: string; updatedAt: string; sections: GuideSection[]; related: string[] };

export const guidePages: GuidePage[] = [
  {
    slug: "installation-guide", eyebrow: "설치 가이드", title: "태양광 설치 전 확인할 7가지", summary: "지붕·토지 조건부터 계통, 구조 검토, 견적 비교와 계약 전 확인까지 설치 순서를 초보자 눈높이로 정리했습니다.", reviewedBy: "SolPlanit 편집 검토", updatedAt: "2026-07-30",
    sections: [
      { heading: "1. 설치 목적부터 정하세요", paragraphs: ["전기요금 절감이 목표인지, 발전 전력 판매가 목표인지에 따라 적정 용량과 경제성 판단 기준이 달라집니다."] },
      { heading: "2. 사용 가능한 면적을 보수적으로 잡으세요", bullets: ["옥상 설비·통로·난간과 이격거리 제외", "음영이 생기는 구역 제외", "토지는 경사와 진입로, 배수 조건 확인"] },
      { heading: "3. 구조와 방수는 계산보다 먼저 확인하세요", paragraphs: ["온라인 계산은 설치 가능성을 가늠하는 시작점입니다. 실제 설치 전에는 구조 안전, 고정 방식, 방수 상세를 현장 전문가가 확인해야 합니다."] },
      { heading: "4. 계통연계 가능성을 확인하세요", paragraphs: ["판매형 설비는 한전 계통 여유와 접속 조건이 사업성에 큰 영향을 줍니다. 계약 전에 접속 가능 여부와 예상 일정을 확인하세요."] },
      { heading: "5. 같은 조건으로 여러 견적을 비교하세요", bullets: ["모듈·인버터 모델과 보증", "예상 발전량의 가정", "공사 범위와 제외 항목", "A/S 책임과 대응 기간"] },
      { heading: "6. 보조금은 확정 전제로 계산하지 마세요", paragraphs: ["지원 사업은 지역, 건물, 신청 시기와 예산에 따라 달라집니다. 공고 원문과 담당 기관 확인 전에는 예상 혜택으로만 다루세요."] },
      { heading: "7. 최종 계약 전 문서로 남기세요", bullets: ["총액과 추가 비용 조건", "공사 일정과 지연 책임", "발전량 보장 여부와 산정 기준", "하자·누수·장비 교체 범위"] }
    ], related: ["quote-review", "subsidy-framework", "glossary"]
  },
  {
    slug: "quote-review", eyebrow: "견적 검토", title: "태양광 견적서, 가격보다 먼저 볼 항목", summary: "용량과 단가만 비교하지 않고 장비, 발전량 가정, 공사 범위, 보증과 추가 비용을 같은 기준으로 검토하는 방법입니다.", reviewedBy: "SolPlanit 편집 검토", updatedAt: "2026-07-30",
    sections: [
      { heading: "견적 조건을 먼저 통일하세요", paragraphs: ["설치 용량, 설치 위치, 사용 목적, 부가세 포함 여부가 다르면 총액 비교는 의미가 없습니다."] },
      { heading: "장비 이름을 구체적으로 확인하세요", bullets: ["모듈 제조사·모델·정격 출력", "인버터 제조사·용량·MPPT 구성", "구조물 재질과 고정 방식", "모니터링 장치와 통신 비용"] },
      { heading: "발전량 예측의 전제를 보세요", paragraphs: ["일사량 데이터, 방위·경사, 음영, 시스템 손실률이 빠진 숫자는 비교 기준으로 쓰기 어렵습니다. SolPlanit 계산 결과도 현장 검토 전 예상치입니다."] },
      { heading: "공사 범위와 제외 항목을 표시하세요", bullets: ["전기 인입·계통연계 비용", "옥상 보강·방수·철거", "크레인·진입로·민원 대응", "인허가·검사·보험 비용"] },
      { heading: "보증은 기간보다 책임 주체가 중요합니다", paragraphs: ["제품 보증과 시공 보증은 다릅니다. 문제가 생겼을 때 누가 접수하고 어떤 비용을 부담하는지 계약서에 적혀 있어야 합니다."] }
    ], related: ["installation-guide", "glossary", "subsidy-framework"]
  },
  {
    slug: "subsidy-framework", eyebrow: "지원 제도", title: "태양광 보조금 정보를 확인하는 안전한 방법", summary: "매년 달라지는 지원 사업을 고정 금액으로 단정하지 않고, 공고 원문과 자격·기간·예산을 확인하는 프레임워크입니다.", reviewedBy: "SolPlanit 편집 검토", updatedAt: "2026-07-30",
    sections: [
      { heading: "지원 제도는 세 층으로 나눠 확인하세요", bullets: ["중앙정부·공공기관 사업", "광역·기초 지자체 추가 지원", "금융·세제·융자 제도"] },
      { heading: "반드시 확인할 항목", bullets: ["신청 주체와 건물 소유 요건", "대상 설비와 인증 기준", "접수 기간과 예산 소진 방식", "자부담·중복지원 제한", "시공업체 자격과 사후 의무"] },
      { heading: "검색 결과만 믿지 마세요", paragraphs: ["블로그와 기사에는 이전 연도 정보가 남아 있을 수 있습니다. 최종 판단은 해당 연도 공고문, 수행기관 안내, 담당 부서 답변으로 확인하세요."] },
      { heading: "경제성 계산에는 보수적으로 반영하세요", paragraphs: ["선정 전에는 보조금을 0원으로 둔 기본 시나리오와 선정 시 시나리오를 나눠 비교하는 편이 안전합니다."] }
    ], related: ["installation-guide", "quote-review", "glossary"]
  },
  {
    slug: "glossary", eyebrow: "용어 사전", title: "처음 보는 태양광 용어를 쉽게 설명합니다", summary: "kW와 kWh, SMP와 REC, 자가소비, 계통연계, 경사각과 방위각 등 설치 판단에 필요한 핵심 용어를 정리했습니다.", reviewedBy: "SolPlanit 편집 검토", updatedAt: "2026-07-30",
    sections: [
      { heading: "용량과 발전량", bullets: ["kW: 설비가 낼 수 있는 순간 출력의 규모", "kWh: 일정 시간 동안 생산하거나 사용한 전력량", "이용률: 설비 용량 대비 실제 생산량을 나타내는 비율"] },
      { heading: "수익과 절감", bullets: ["자가소비: 생산한 전기를 건물에서 직접 사용하는 방식", "SMP: 전력시장 정산에 쓰이는 전력 가격", "REC: 신재생에너지 공급인증서. 적용 여부와 가격은 제도·시장 조건에 따라 달라짐"] },
      { heading: "설계와 현장", bullets: ["방위각: 패널이 향하는 수평 방향", "경사각: 패널이 수평면에서 기울어진 각도", "음영: 주변 건물·수목·설비가 햇빛을 가리는 현상", "계통연계: 발전 설비를 전력망에 연결하는 절차"] },
      { heading: "손실과 보증", bullets: ["시스템 손실률: 온도, 배선, 인버터, 오염 등으로 줄어드는 발전량", "제품 보증: 장비 제조사가 정한 결함 보증", "출력 보증: 모듈 출력 저하 수준에 대한 제조사 약속", "시공 보증: 설치 공사의 하자에 대한 시공사 책임"] }
    ], related: ["installation-guide", "quote-review", "subsidy-framework"]
  }
];

export const GUIDE_ROUTES = ["/guides", ...guidePages.map((page) => `/guides/${page.slug}`)] as const;
export const getGuidePage = (slug: string) => guidePages.find((page) => page.slug === slug);
