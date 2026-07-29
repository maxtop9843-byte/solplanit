import { describe, expect, it } from "vitest";
import { QuoteRequestInputError, validateQuoteRequest, type QuoteRequestInput } from "./request";

const validRequest: QuoteRequestInput = {
  name: "김태양",
  phone: "010-1234-5678",
  region: "경기도 수원시",
  preferredContact: "text",
  message: "옥상 구조 검토와 예상 공사비를 함께 알고 싶어요.",
  privacyAccepted: true,
  calculation: {
    capacityKw: 12.3,
    panelCount: 27,
    annualGenerationKwh: 15500,
    annualBenefit: 2300000,
    paybackYears: 7.4,
    goal: "save",
  },
};

describe("validateQuoteRequest", () => {
  it("keeps the attached calculation and normalizes contact fields", () => {
    const result = validateQuoteRequest({ ...validRequest, name: "  김태양 ", phone: "010 1234 5678" });
    expect(result.name).toBe("김태양");
    expect(result.phone).toBe("01012345678");
    expect(result.calculation).toEqual(validRequest.calculation);
  });

  it("rejects an invalid phone number", () => {
    expect(() => validateQuoteRequest({ ...validRequest, phone: "02-123-4567" })).toThrow(QuoteRequestInputError);
  });

  it("requires privacy consent", () => {
    expect(() => validateQuoteRequest({ ...validRequest, privacyAccepted: false })).toThrow("개인정보 수집 안내에 동의");
  });

  it("rejects corrupted calculation values", () => {
    expect(() => validateQuoteRequest({ ...validRequest, calculation: { ...validRequest.calculation, capacityKw: -1 } })).toThrow("설치 용량");
  });
});
