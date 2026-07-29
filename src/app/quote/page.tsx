import QuoteRequestForm from "./QuoteRequestForm";

const readNumber = (value: string | string[] | undefined) => {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export default async function QuotePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const goal = params.goal === "sell" ? "sell" : "save";
  const paybackValue = Array.isArray(params.payback) ? params.payback[0] : params.payback;
  const paybackYears = paybackValue === "null" || paybackValue === undefined ? null : readNumber(paybackValue);

  return <QuoteRequestForm calculation={{
    capacityKw: readNumber(params.capacity),
    panelCount: readNumber(params.panels),
    annualGenerationKwh: readNumber(params.generation),
    annualBenefit: readNumber(params.benefit),
    paybackYears,
    goal,
  }} />;
}
