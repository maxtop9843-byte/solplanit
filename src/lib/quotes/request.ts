export type QuoteCalculationAttachment = {
  capacityKw: number;
  panelCount: number;
  annualGenerationKwh: number;
  annualBenefit: number;
  paybackYears: number | null;
  goal: "save" | "sell";
};

export type QuoteRequestInput = {
  name: string;
  phone: string;
  region: string;
  preferredContact: "phone" | "text";
  message: string;
  privacyAccepted: boolean;
  calculation: QuoteCalculationAttachment;
};

export class QuoteRequestInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuoteRequestInputError";
  }
}

const finiteNonNegative = (value: number, label: string) => {
  if (!Number.isFinite(value) || value < 0) throw new QuoteRequestInputError(`${label} 정보가 올바르지 않아요.`);
  return value;
};

export function validateQuoteRequest(input: QuoteRequestInput): QuoteRequestInput {
  const name = input.name.trim();
  const phone = input.phone.replace(/\s/g, "");
  const region = input.region.trim();

  if (name.length < 2) throw new QuoteRequestInputError("이름을 두 글자 이상 입력해주세요.");
  if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone)) throw new QuoteRequestInputError("연락 가능한 휴대전화 번호를 입력해주세요.");
  if (region.length < 2) throw new QuoteRequestInputError("설치 예정 지역을 입력해주세요.");
  if (!input.privacyAccepted) throw new QuoteRequestInputError("견적 요청을 위해 개인정보 수집 안내에 동의해주세요.");

  finiteNonNegative(input.calculation.capacityKw, "설치 용량");
  finiteNonNegative(input.calculation.panelCount, "패널 수");
  finiteNonNegative(input.calculation.annualGenerationKwh, "연간 발전량");
  finiteNonNegative(input.calculation.annualBenefit, "연간 편익");
  if (input.calculation.paybackYears !== null) finiteNonNegative(input.calculation.paybackYears, "회수기간");

  return { ...input, name, phone, region, message: input.message.trim() };
}
