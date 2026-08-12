import type { PvgisProxyResult } from "../pvgis";
import {
  errorResult,
  unavailableResult,
  verifiedResult,
  type CalculationResult,
} from "./result";
import { createPvgisGenerationResult } from "./generation";

export type PvgisMonthlyGenerationValue = {
  month: number;
  monthlyGenerationKwh: number;
};

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

export function createPvgisMonthlyGenerationResult(
  result: PvgisProxyResult,
  month: number,
): CalculationResult<PvgisMonthlyGenerationValue> {
  const annualResult = createPvgisGenerationResult(result);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return errorResult({
      ...annualResult.metadata,
      limitations: [
        ...annualResult.metadata.limitations,
        "발전량을 확인할 월은 1월부터 12월 사이여야 합니다.",
      ],
    });
  }

  if (annualResult.metadata.status === "error") {
    return errorResult(annualResult.metadata);
  }

  if (annualResult.metadata.status !== "verified") {
    return unavailableResult(annualResult.metadata);
  }

  const monthly = asObject(asObject(result.data)?.outputs)?.monthly;
  const fixed = asObject(monthly)?.fixed;

  if (!Array.isArray(fixed)) {
    return unavailableResult({
      ...annualResult.metadata,
      limitations: [
        ...annualResult.metadata.limitations,
        "PVGIS 응답에 월별 발전량 데이터가 없습니다.",
      ],
    });
  }

  const row = fixed.find((item) => asObject(item)?.month === month);
  const monthlyGenerationKwh = asObject(row)?.E_m;

  if (row === undefined || monthlyGenerationKwh === undefined || monthlyGenerationKwh === null) {
    return unavailableResult({
      ...annualResult.metadata,
      limitations: [
        ...annualResult.metadata.limitations,
        `${month}월 PVGIS 발전량 데이터가 없습니다.`,
      ],
    });
  }

  if (
    typeof monthlyGenerationKwh !== "number" ||
    !Number.isFinite(monthlyGenerationKwh) ||
    monthlyGenerationKwh < 0 ||
    Object.is(monthlyGenerationKwh, -0)
  ) {
    return errorResult({
      ...annualResult.metadata,
      limitations: [
        ...annualResult.metadata.limitations,
        `${month}월 PVGIS 발전량 값이 올바르지 않습니다.`,
      ],
    });
  }

  return verifiedResult(
    { month, monthlyGenerationKwh },
    annualResult.metadata,
  );
}
