import { getResidentialSolarSupport2026 } from "../support/residentialSolarSupport2026";

export const SOLAR_3KW_CAPACITY_KW = 3;
export const GYEONGGI_2026_PROJECT_COST_CAP_KRW = 4_541_000;
export const GYEONGGI_2026_REFERENCE_DATE = "2026-03-30";

export type Solar3kwRegionKey = "gyeonggi" | "gyeonggi-uijeongbu" | "seoul-gwanak" | "other";

export interface Solar3kwSupportLine {
  id: string;
  label: string;
  amountKrw: number | null;
  ratePercent: number | null;
  qualifier: "exact" | "about";
  sourceUrl: string;
  checkedAt: string;
}

export interface Solar3kwCostResult {
  regionLabel: string;
  officialProjectCostKrw: number | null;
  officialProjectCostLabel: string | null;
  supportStatus: "available" | "confirmed-none" | "unverified";
  supportLines: readonly Solar3kwSupportLine[];
  simpleSelfPayKrw: number | null;
  selfPayReason: string | null;
  referenceDate: string;
  sourceUrls: readonly string[];
}

const REGION_QUERY: Record<Exclude<Solar3kwRegionKey, "other">, { label: string; province: string; district?: string }> = {
  gyeonggi: { label: "경기도", province: "경기도" },
  "gyeonggi-uijeongbu": { label: "경기도 의정부시", province: "경기도", district: "의정부시" },
  "seoul-gwanak": { label: "서울특별시 관악구", province: "서울특별시", district: "관악구" },
};

function supportAmountKrw(
  support: { kind: "fixed"; amountKrw: number } | { kind: "rate"; ratePercent: number; projectCostCapKrw?: number },
) {
  if (support.kind === "fixed") return support.amountKrw;
  if (support.projectCostCapKrw === undefined) return null;
  return Math.round((support.projectCostCapKrw * support.ratePercent) / 100);
}

export function calculateSolar3kwCost(regionKey: Solar3kwRegionKey): Solar3kwCostResult {
  if (regionKey === "other") {
    return {
      regionLabel: "그 외 지역",
      officialProjectCostKrw: null,
      officialProjectCostLabel: null,
      supportStatus: "unverified",
      supportLines: [],
      simpleSelfPayKrw: null,
      selfPayReason: "이 지역은 아직 확인된 2026년 공식 사업비·지원 데이터가 없습니다.",
      referenceDate: "2026-08-12",
      sourceUrls: [],
    };
  }

  const region = REGION_QUERY[regionKey];
  const lookup = getResidentialSolarSupport2026({
    province: region.province,
    district: region.district,
    capacityKw: SOLAR_3KW_CAPACITY_KW,
  });

  const supportLines = lookup.programs.map((program) => {
    const support = program.support;
    return {
      id: program.id,
      label: program.source.organization,
      amountKrw: support ? supportAmountKrw(support) : null,
      ratePercent: support?.kind === "rate" ? support.ratePercent : null,
      qualifier: support?.qualifier ?? "exact",
      sourceUrl: program.source.url,
      checkedAt: program.checkedAt,
    } satisfies Solar3kwSupportLine;
  });

  const isGyeonggi = region.province === "경기도";
  const officialProjectCostKrw = isGyeonggi ? GYEONGGI_2026_PROJECT_COST_CAP_KRW : null;
  const officialProjectCostLabel = isGyeonggi ? "2026 경기도 사업 총사업비 상한" : null;

  const exactAmounts = supportLines.filter((line) => line.qualifier === "exact" && line.amountKrw !== null);
  const canCalculateSimpleSelfPay =
    officialProjectCostKrw !== null &&
    supportLines.length === 1 &&
    exactAmounts.length === 1;
  const simpleSelfPayKrw = canCalculateSimpleSelfPay
    ? officialProjectCostKrw - (exactAmounts[0].amountKrw ?? 0)
    : null;

  let selfPayReason: string | null = null;
  if (officialProjectCostKrw === null) {
    selfPayReason = "공식 사업비 기준을 확인하지 못해 자부담액을 계산하지 않습니다.";
  } else if (supportLines.length > 1) {
    selfPayReason = "여러 지원사업의 중복 적용 여부를 확인해야 해 자부담액을 하나의 숫자로 합산하지 않습니다.";
  } else if (supportLines.some((line) => line.qualifier === "about" || line.amountKrw === null)) {
    selfPayReason = "지원액이 범위·비율로만 확인되어 자부담액을 확정하지 않습니다.";
  } else if (regionKey === "gyeonggi") {
    selfPayReason = "경기도 도비 40%만 반영한 계산입니다. 시군 추가 지원은 지역별로 달라 포함하지 않았습니다.";
  }

  return {
    regionLabel: region.label,
    officialProjectCostKrw,
    officialProjectCostLabel,
    supportStatus: lookup.status,
    supportLines,
    simpleSelfPayKrw,
    selfPayReason,
    referenceDate: "2026-08-12",
    sourceUrls: Array.from(new Set(supportLines.map((line) => line.sourceUrl))),
  };
}
