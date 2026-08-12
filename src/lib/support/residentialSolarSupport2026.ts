export type SupportAvailability = "available" | "confirmed-none";

export type SupportAmount =
  | {
      kind: "fixed";
      amountKrw: number;
      qualifier: "exact";
    }
  | {
      kind: "rate";
      ratePercent: number;
      qualifier: "exact" | "about";
      projectCostCapKrw?: number;
    };

export interface ResidentialSolarSupportRecord {
  id: string;
  year: 2026;
  region: {
    scope: "province" | "district";
    province: string;
    district?: string;
  };
  target: string;
  capacity: {
    minKw: number;
    maxKw: number;
  };
  availability: SupportAvailability;
  support?: SupportAmount;
  applicationPeriod?: string;
  notes?: readonly string[];
  checkedAt: string;
  source: {
    organization: string;
    title: string;
    url: string;
    publishedAt?: string;
  };
}

export interface ResidentialSolarSupportQuery {
  province: string;
  district?: string;
  capacityKw: number;
}

export type ResidentialSolarSupportLookup =
  | {
      status: "available";
      programs: readonly ResidentialSolarSupportRecord[];
    }
  | {
      status: "confirmed-none";
      programs: readonly ResidentialSolarSupportRecord[];
    }
  | {
      status: "unverified";
      programs: readonly [];
    };

const CHECKED_AT = "2026-08-12";

/**
 * Only records confirmed from government or local-government sources belong here.
 * Absence from this array never means that a region has no support program.
 */
export const RESIDENTIAL_SOLAR_SUPPORT_2026: readonly ResidentialSolarSupportRecord[] = [
  {
    id: "2026-seoul-gwanak-residential-solar-3kw",
    year: 2026,
    region: {
      scope: "district",
      province: "서울특별시",
      district: "관악구",
    },
    target:
      "2026년 재생에너지보급(주택지원)사업 승인을 받아 관악구 소재 기존 또는 신축 단독주택에 3kW 태양광 설비를 설치한 소유자",
    capacity: {
      minKw: 3,
      maxKw: 3,
    },
    availability: "available",
    support: {
      kind: "fixed",
      amountKrw: 1_000_000,
      qualifier: "exact",
    },
    notes: [
      "관악구 추가 지원액만 저장한다.",
      "같은 공식 안내에는 한국에너지공단 지원 1,650,000원이 별도로 표시되어 있으므로 중복 합산하지 않는다.",
    ],
    checkedAt: CHECKED_AT,
    source: {
      organization: "서울특별시 관악구",
      title: "태양광보급 지원",
      url: "https://www.gwanak.go.kr/site/gwanak/08/10802020400002016082909.jsp",
      publishedAt: "2026-05-26",
    },
  },
  {
    id: "2026-gyeonggi-residential-solar-3kw",
    year: 2026,
    region: {
      scope: "province",
      province: "경기도",
    },
    target: "경기도 소재 주택 중 2026년 경기도 주택태양광 지원사업 대상자로 선정된 가구",
    capacity: {
      minKw: 3,
      maxKw: 3,
    },
    availability: "available",
    support: {
      kind: "rate",
      ratePercent: 40,
      qualifier: "exact",
      projectCostCapKrw: 4_541_000,
    },
    applicationPeriod: "2026-04-20~2026-04-24",
    notes: [
      "도비 지원 기준이며 시군비는 지역별로 다르다.",
      "시군 추가 지원을 확인하지 않은 경우 임의 금액을 더하지 않는다.",
    ],
    checkedAt: CHECKED_AT,
    source: {
      organization: "경기도",
      title: "2026년도 경기도 주택태양광 지원사업 공고",
      url: "https://www.gg.go.kr/bbs/boardView.do?bIdx=230009605&bcIdx=600&bsIdx=469&menuId=1547&page=2",
      publishedAt: "2026-03-30",
    },
  },
  {
    id: "2026-gyeonggi-uijeongbu-residential-solar-up-to-3kw",
    year: 2026,
    region: {
      scope: "district",
      province: "경기도",
      district: "의정부시",
    },
    target:
      "의정부시 관내 단독주택 소유자 또는 소유 예정자 중 2026년 경기도 주택태양광 지원사업과 연계해 설치하는 가구",
    capacity: {
      minKw: 0,
      maxKw: 3,
    },
    availability: "available",
    support: {
      kind: "rate",
      ratePercent: 30,
      qualifier: "about",
    },
    applicationPeriod: "2026-04~2026-12, 시비 예산 소진 시까지",
    notes: ["의정부시 공고 표현인 '설치비의 30% 수준'을 그대로 구조화했다."],
    checkedAt: CHECKED_AT,
    source: {
      organization: "경기도 의정부시",
      title: "2026년 의정부시 주택태양광 지원사업(도지원) 공고",
      url: "https://www.ui4u.go.kr/portal/saeol/gosiView.do?mId=0301040000&notAncmtMgtNo=67258",
      publishedAt: "2026-04-01",
    },
  },
];

function coversCapacity(record: ResidentialSolarSupportRecord, capacityKw: number) {
  return capacityKw >= record.capacity.minKw && capacityKw <= record.capacity.maxKw;
}

function matchesRegion(record: ResidentialSolarSupportRecord, query: ResidentialSolarSupportQuery) {
  if (record.region.province !== query.province) return false;

  if (record.region.scope === "province") return true;

  return Boolean(query.district && record.region.district === query.district);
}

export function getResidentialSolarSupport2026(
  query: ResidentialSolarSupportQuery,
): ResidentialSolarSupportLookup {
  if (!Number.isFinite(query.capacityKw) || query.capacityKw <= 0) {
    return { status: "unverified", programs: [] };
  }

  const matches = RESIDENTIAL_SOLAR_SUPPORT_2026.filter(
    (record) => matchesRegion(record, query) && coversCapacity(record, query.capacityKw),
  );

  const available = matches.filter((record) => record.availability === "available");
  if (available.length > 0) {
    return { status: "available", programs: available };
  }

  const confirmedNone = matches.filter((record) => record.availability === "confirmed-none");
  if (confirmedNone.length > 0) {
    return { status: "confirmed-none", programs: confirmedNone };
  }

  return { status: "unverified", programs: [] };
}
