export type CommunityCalculationAttachment = {
  capacityKw: number;
  panelCount: number;
  annualGenerationKwh: number;
  annualBenefit: number;
  paybackYears: number | null;
  goal: "save" | "sell";
};

const limits = {
  capacityKw: 100000,
  panelCount: 500000,
  annualGenerationKwh: 500000000,
  annualBenefit: 100000000000,
  paybackYears: 100,
};

function readFiniteNumber(value: string | string[] | undefined, maximum: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || raw.trim() === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= maximum ? parsed : null;
}

export function parseCommunityCalculationAttachment(
  params: Record<string, string | string[] | undefined>,
): CommunityCalculationAttachment | null {
  const capacityKw = readFiniteNumber(params.capacity, limits.capacityKw);
  const panelCount = readFiniteNumber(params.panels, limits.panelCount);
  const annualGenerationKwh = readFiniteNumber(params.generation, limits.annualGenerationKwh);
  const annualBenefit = readFiniteNumber(params.benefit, limits.annualBenefit);
  const paybackRaw = Array.isArray(params.payback) ? params.payback[0] : params.payback;
  const paybackYears = paybackRaw === "null" ? null : readFiniteNumber(paybackRaw, limits.paybackYears);
  const goal = params.goal === "sell" ? "sell" : params.goal === "save" ? "save" : null;

  if (
    capacityKw === null ||
    panelCount === null ||
    annualGenerationKwh === null ||
    annualBenefit === null ||
    (paybackRaw !== "null" && paybackYears === null) ||
    goal === null
  ) {
    return null;
  }

  return {
    capacityKw,
    panelCount: Math.round(panelCount),
    annualGenerationKwh,
    annualBenefit,
    paybackYears,
    goal,
  };
}

export function serializeCommunityCalculationAttachment(
  attachment: CommunityCalculationAttachment,
) {
  return new URLSearchParams({
    capacity: String(attachment.capacityKw),
    panels: String(attachment.panelCount),
    generation: String(attachment.annualGenerationKwh),
    benefit: String(attachment.annualBenefit),
    payback: attachment.paybackYears === null ? "null" : String(attachment.paybackYears),
    goal: attachment.goal,
  });
}

export function getCommunityAttachmentLabel(goal: CommunityCalculationAttachment["goal"]) {
  return goal === "save" ? "연간 예상 절감액" : "연간 예상 발전 수익";
}
