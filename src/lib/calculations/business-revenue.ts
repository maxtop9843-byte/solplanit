export type BusinessRevenueInput = {
  annualGenerationKwh: number;
  smpPricePerKwh: number;
  recPricePerRec: number;
  recWeight: number;
};

export type BusinessRevenueResult = {
  annualSmpRevenue: number;
  annualRecRevenue: number;
  annualRevenue: number;
};

const roundWon = (value: number) => Math.round(value + Number.EPSILON);

/**
 * 발전사업자용 SMP·REC 수익 계산 경계.
 *
 * 주택용 전기요금 절감과 섞지 않으며, 가격·가중치의 출처와 기준일을
 * 결정하는 책임은 데이터 계층에 둔다. 이 함수는 검증된 입력값의 산술만 담당한다.
 */
export function calculateBusinessRevenue(input: BusinessRevenueInput): BusinessRevenueResult {
  const annualSmpRevenue = roundWon(input.annualGenerationKwh * input.smpPricePerKwh);
  const annualRecRevenue = roundWon(
    (input.annualGenerationKwh / 1000) * input.recWeight * input.recPricePerRec,
  );

  return {
    annualSmpRevenue,
    annualRecRevenue,
    annualRevenue: annualSmpRevenue + annualRecRevenue,
  };
}
