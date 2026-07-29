import { describe, expect, it } from "vitest";
import {
  getCommunityAttachmentLabel,
  parseCommunityCalculationAttachment,
  serializeCommunityCalculationAttachment,
} from "./communityAttachment";

const validParams = {
  capacity: "23.4",
  panels: "52",
  generation: "31240",
  benefit: "4380000",
  payback: "7.8",
  goal: "save",
};

describe("community calculation attachment", () => {
  it("parses a complete general-user calculation", () => {
    expect(parseCommunityCalculationAttachment(validParams)).toEqual({
      capacityKw: 23.4,
      panelCount: 52,
      annualGenerationKwh: 31240,
      annualBenefit: 4380000,
      paybackYears: 7.8,
      goal: "save",
    });
  });

  it("preserves an unavailable payback period", () => {
    expect(parseCommunityCalculationAttachment({ ...validParams, payback: "null", goal: "sell" }))
      .toMatchObject({ paybackYears: null, goal: "sell" });
  });

  it.each([
    ["missing value", { ...validParams, capacity: undefined }],
    ["zero capacity", { ...validParams, capacity: "0" }],
    ["negative generation", { ...validParams, generation: "-1" }],
    ["non-finite benefit", { ...validParams, benefit: "Infinity" }],
    ["unsupported goal", { ...validParams, goal: "other" }],
    ["unreasonable payback", { ...validParams, payback: "101" }],
  ])("rejects %s", (_, params) => {
    expect(parseCommunityCalculationAttachment(params)).toBeNull();
  });

  it("round-trips the attachment through URL parameters", () => {
    const attachment = parseCommunityCalculationAttachment(validParams);
    expect(attachment).not.toBeNull();
    const params = serializeCommunityCalculationAttachment(attachment!);
    expect(parseCommunityCalculationAttachment(Object.fromEntries(params))).toEqual(attachment);
  });

  it("uses goal-specific benefit labels", () => {
    expect(getCommunityAttachmentLabel("save")).toBe("연간 예상 절감액");
    expect(getCommunityAttachmentLabel("sell")).toBe("연간 예상 발전 수익");
  });
});
