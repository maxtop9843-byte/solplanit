import {
  errorResult,
  unavailableResult,
  verifiedResult,
  type CalculationResult,
} from "../calculations/result";

export type KepcoResidentialBillBreakdown = {
  usageKwh: number;
  basicChargeWon: number;
  energyChargeWon: number;
  climateEnvironmentalChargeWon: number;
  fuelAdjustmentChargeWon: number;
  electricityChargeWon: number;
  vatWon: number;
  powerIndustryFundWon: number;
  standardBillWon: number;
};

export type KepcoResidentialBillInput = {
  usageKwh: number;
  month: number;
  calculatedAt?: string;
};

const REFERENCE_DATE = "2026-08-12";
const ENERGY_RATES = [120, 214.6, 307.3] as const;
const BASIC_CHARGES = [910, 1_600, 7_300] as const;
const CLIMATE_ENVIRONMENTAL_RATE = 9;
const FUEL_ADJUSTMENT_RATE_Q3_2026 = 5;
const POWER_INDUSTRY_FUND_RATE = 0.027;
const VAT_RATE = 0.1;

const sources = [
  {
    label: "법제처 찾기쉬운 생활법령정보 주택용 전기요금",
    url: "https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=2&cciNo=1&cnpClsNo=1&csmSeq=1008&menuType=cnpcls&popMenu=ov",
  },
  {
    label: "한국전력 2026년 3분기 연료비조정단가",
    url: "https://www.kepco.co.kr/home/media/newsroom/notice/boardView.do?boardMngNo=14&boardNo=2673",
  },
  {
    label: "한국전력 여름철 주택용 누진구간 안내",
    url: "https://home.kepco.co.kr/kepco/front/html/WZ/2020_07_08/m/sub03_06.html",
  },
  {
    label: "한국전력 2026년 7월 전기요금 안내 사례",
    url: "https://www.kepco.co.kr/KEPCO_FILE/html/2026_07/news.html",
  },
] as const;

function thresholdsForMonth(month: number): readonly [number, number] {
  return month === 7 || month === 8 ? [300, 450] : [200, 400];
}

function tierForUsage(usageKwh: number, firstThreshold: number, secondThreshold: number): 0 | 1 | 2 {
  if (usageKwh <= firstThreshold) return 0;
  if (usageKwh <= secondThreshold) return 1;
  return 2;
}

function progressiveEnergyCharge(
  usageKwh: number,
  firstThreshold: number,
  secondThreshold: number,
): number {
  const first = Math.min(usageKwh, firstThreshold) * ENERGY_RATES[0];
  const second = Math.max(0, Math.min(usageKwh, secondThreshold) - firstThreshold) * ENERGY_RATES[1];
  const third = Math.max(0, usageKwh - secondThreshold) * ENERGY_RATES[2];

  return Math.round(first + second + third);
}

function truncateToTenWon(value: number): number {
  return Math.floor(value / 10) * 10;
}

/**
 * 2026년 3분기 주택용 저압 표준요금 계산 모델.
 *
 * 복지할인, 대가족 할인, TV수신료, 자동이체 할인처럼 고객별로 달라지는 항목은
 * 포함하지 않는다. 실제 청구서가 아니라 동일 조건의 설치 전·후 요금 비교를 위한
 * 표준요금 경계로 사용한다.
 */
export function calculateKepcoResidentialLowVoltageBill(
  input: KepcoResidentialBillInput,
): CalculationResult<KepcoResidentialBillBreakdown> {
  const baseMetadata = {
    sources,
    referenceDate: REFERENCE_DATE,
    calculatedAt: input.calculatedAt,
    inputs: [
      {
        key: "usageKwh",
        value: input.usageKwh,
        unit: "kWh/월",
        description: "월 전기 사용량",
      },
      {
        key: "month",
        value: input.month,
        unit: "월",
        description: "요금 계산 월",
      },
    ],
    assumptions: [
      {
        key: "contractType",
        value: "주택용 저압",
        description: "주택용 저압 표준요금을 적용합니다.",
      },
      {
        key: "climateEnvironmentalRate",
        value: CLIMATE_ENVIRONMENTAL_RATE,
        unit: "원/kWh",
        description: "한전 표준요금 검증에 사용한 기후환경요금 단가입니다.",
      },
      {
        key: "fuelAdjustmentRate",
        value: FUEL_ADJUSTMENT_RATE_Q3_2026,
        unit: "원/kWh",
        description: "2026년 3분기 한전 연료비조정단가입니다.",
      },
      {
        key: "powerIndustryFundRate",
        value: POWER_INDUSTRY_FUND_RATE * 100,
        unit: "%",
        description: "전력산업기반기금 부담률입니다.",
      },
    ],
    limitations: [
      "복지·대가족·생명유지장치·자동이체 할인과 TV수신료 등 고객별 항목은 포함하지 않습니다.",
      "실제 청구액 확인이 아니라 같은 계약 조건에서 사용량 변화에 따른 표준요금 비교용입니다.",
    ],
  };

  if (!Number.isFinite(input.usageKwh) || input.usageKwh < 0 || Object.is(input.usageKwh, -0)) {
    return errorResult({
      ...baseMetadata,
      limitations: [...baseMetadata.limitations, "월 전기 사용량은 0 이상의 숫자여야 합니다."],
    });
  }

  if (!Number.isInteger(input.month) || input.month < 1 || input.month > 12) {
    return errorResult({
      ...baseMetadata,
      limitations: [...baseMetadata.limitations, "요금 계산 월은 1부터 12 사이의 정수여야 합니다."],
    });
  }

  if (input.month < 7 || input.month > 9) {
    return unavailableResult({
      ...baseMetadata,
      limitations: [
        ...baseMetadata.limitations,
        "현재 고정된 연료비조정단가는 2026년 3분기(7~9월)에만 검증되어 다른 월은 계산하지 않습니다.",
      ],
    });
  }

  const [firstThreshold, secondThreshold] = thresholdsForMonth(input.month);
  const tier = tierForUsage(input.usageKwh, firstThreshold, secondThreshold);
  const basicChargeWon = BASIC_CHARGES[tier];
  const energyChargeWon = progressiveEnergyCharge(input.usageKwh, firstThreshold, secondThreshold);
  const climateEnvironmentalChargeWon = Math.round(input.usageKwh * CLIMATE_ENVIRONMENTAL_RATE);
  const fuelAdjustmentChargeWon = Math.round(input.usageKwh * FUEL_ADJUSTMENT_RATE_Q3_2026);
  const electricityChargeWon =
    basicChargeWon + energyChargeWon + climateEnvironmentalChargeWon + fuelAdjustmentChargeWon;
  const vatWon = Math.round(electricityChargeWon * VAT_RATE);
  const powerIndustryFundWon = truncateToTenWon(electricityChargeWon * POWER_INDUSTRY_FUND_RATE);
  const standardBillWon = truncateToTenWon(electricityChargeWon + vatWon + powerIndustryFundWon);

  return verifiedResult(
    {
      usageKwh: input.usageKwh,
      basicChargeWon,
      energyChargeWon,
      climateEnvironmentalChargeWon,
      fuelAdjustmentChargeWon,
      electricityChargeWon,
      vatWon,
      powerIndustryFundWon,
      standardBillWon,
    },
    baseMetadata,
  );
}
