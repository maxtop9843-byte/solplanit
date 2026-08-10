import { errorResult, estimatedResult, type CalculationResult } from "./result";

export const AREA_UNITS = ["m2", "pyeong"] as const;
export type AreaUnit = (typeof AREA_UNITS)[number];

export const BUILDING_TYPES = ["주택", "상가·건물", "공장·창고", "토지"] as const;
export type BuildingType = (typeof BUILDING_TYPES)[number];

type CapacityAssumption = {
  usableAreaRatio: number;
  panelFootprintM2: number;
};

export const CAPACITY_METHOD = {
  version: "2026-07-29",
  panelCapacityKw: 0.45,
  squareMetersPerPyeong: 3.305785,
  minimumAreaM2: 5,
  maximumAreaM2: 1_000_000,
  assumptions: {
    주택: { usableAreaRatio: 0.55, panelFootprintM2: 2.6 },
    "상가·건물": { usableAreaRatio: 0.6, panelFootprintM2: 2.5 },
    "공장·창고": { usableAreaRatio: 0.7, panelFootprintM2: 2.4 },
    토지: { usableAreaRatio: 0.65, panelFootprintM2: 3.2 },
  } satisfies Record<BuildingType, CapacityAssumption>,
  sources: [
    {
      label: "한국에너지공단 신·재생에너지센터 태양광 소개",
      url: "https://www.knrec.or.kr/biz/korea/intro/kor_solar.do",
    },
    {
      label: "미국 에너지부 Solar Rooftop Potential",
      url: "https://www.energy.gov/cmei/systems/solar-rooftop-potential",
    },
    {
      label: "미국 에너지부 Solar System Components",
      url: "https://www.energy.gov/indianenergy/tribal-energy-guide/solar",
    },
  ],
} as const;

export type CapacityInput = {
  buildingType: BuildingType;
  area: number;
  areaUnit: AreaUnit;
};

export type CapacityResult = {
  inputArea: number;
  inputUnit: AreaUnit;
  areaM2: number;
  usableAreaM2: number;
  usableAreaRatio: number;
  panelFootprintM2: number;
  panelCapacityKw: number;
  panelCount: number;
  installableCapacityKw: number;
  methodVersion: string;
};

export class CapacityInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CapacityInputError";
  }
}

const round = (value: number, digits: number) => {
  const multiplier = 10 ** digits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
};

function formatAreaBoundary(areaM2: number, unit: AreaUnit, boundary: "minimum" | "maximum") {
  if (unit === "m2") return `${areaM2.toLocaleString("ko-KR")}m²`;

  const pyeong = areaM2 / CAPACITY_METHOD.squareMetersPerPyeong;
  const scale = 100;
  const safeBoundary = boundary === "minimum"
    ? Math.ceil(pyeong * scale) / scale
    : Math.floor(pyeong * scale) / scale;

  return `${safeBoundary.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}평`;
}

export function convertAreaToSquareMeters(area: number, unit: AreaUnit): number {
  if (!Number.isFinite(area)) throw new CapacityInputError("면적을 숫자로 넣어 주세요. 예: 100");
  return unit === "pyeong" ? area * CAPACITY_METHOD.squareMetersPerPyeong : area;
}

export function estimateInstallableCapacity(input: CapacityInput): CapacityResult {
  if (!BUILDING_TYPES.includes(input.buildingType)) {
    throw new CapacityInputError("건물 종류를 다시 선택해 주세요.");
  }
  if (!AREA_UNITS.includes(input.areaUnit)) {
    throw new CapacityInputError("면적 단위를 다시 선택해 주세요.");
  }

  const areaM2Raw = convertAreaToSquareMeters(input.area, input.areaUnit);
  if (areaM2Raw < CAPACITY_METHOD.minimumAreaM2) {
    const minimum = formatAreaBoundary(CAPACITY_METHOD.minimumAreaM2, input.areaUnit, "minimum");
    throw new CapacityInputError(`패널 한 장도 놓기 어려운 면적입니다. ${minimum} 이상 넣어 주세요.`);
  }
  if (areaM2Raw > CAPACITY_METHOD.maximumAreaM2) {
    const maximum = formatAreaBoundary(CAPACITY_METHOD.maximumAreaM2, input.areaUnit, "maximum");
    throw new CapacityInputError(`이 도구가 다루는 범위를 넘었습니다. ${maximum} 이하로 넣어 주세요.`);
  }

  const assumption = CAPACITY_METHOD.assumptions[input.buildingType];
  const usableAreaM2Raw = areaM2Raw * assumption.usableAreaRatio;
  const panelCount = Math.floor(usableAreaM2Raw / assumption.panelFootprintM2);
  if (panelCount < 1) {
    throw new CapacityInputError("이 조건으로는 패널을 한 장도 놓을 수 없습니다. 면적을 다시 확인해 주세요.");
  }

  return {
    inputArea: input.area,
    inputUnit: input.areaUnit,
    areaM2: round(areaM2Raw, 2),
    usableAreaM2: round(usableAreaM2Raw, 2),
    usableAreaRatio: assumption.usableAreaRatio,
    panelFootprintM2: assumption.panelFootprintM2,
    panelCapacityKw: CAPACITY_METHOD.panelCapacityKw,
    panelCount,
    installableCapacityKw: round(panelCount * CAPACITY_METHOD.panelCapacityKw, 2),
    methodVersion: CAPACITY_METHOD.version,
  };
}

export function estimateInstallableCapacityResult(
  input: CapacityInput,
  calculatedAt?: string,
): CalculationResult<CapacityResult> {
  const inputMetadata = [
    {
      key: "buildingType",
      value: input.buildingType,
      description: "사용자가 선택한 건물 종류",
    },
    {
      key: "roofArea",
      value: input.area,
      ...(input.areaUnit === "m2"
        ? { unit: "m²" }
        : input.areaUnit === "pyeong"
          ? { unit: "평" }
          : {}),
      description: "사용자가 입력한 지붕 면적",
    },
  ];

  let value: CapacityResult;
  try {
    value = estimateInstallableCapacity(input);
  } catch (error) {
    if (error instanceof CapacityInputError) {
      return errorResult({
        sources: CAPACITY_METHOD.sources,
        referenceDate: CAPACITY_METHOD.version,
        ...(calculatedAt ? { calculatedAt } : {}),
        inputs: inputMetadata,
        assumptions: [],
        limitations: [error.message],
      });
    }
    throw error;
  }

  const assumption = CAPACITY_METHOD.assumptions[input.buildingType];

  return estimatedResult(value, {
    sources: CAPACITY_METHOD.sources,
    referenceDate: CAPACITY_METHOD.version,
    ...(calculatedAt ? { calculatedAt } : {}),
    inputs: inputMetadata,
    assumptions: [
      {
        key: "usableAreaRatio",
        value: assumption.usableAreaRatio * 100,
        unit: "%",
        description: "지붕 전체 면적 중 패널 배치에 사용할 수 있다고 가정한 비율",
      },
      {
        key: "panelFootprintM2",
        value: assumption.panelFootprintM2,
        unit: "m²/장",
        description: "통로와 패널 간격을 포함해 패널 한 장에 필요하다고 가정한 면적",
      },
      {
        key: "panelCapacityKw",
        value: CAPACITY_METHOD.panelCapacityKw,
        unit: "kW/장",
        description: "계산에 사용한 패널 한 장의 정격 용량",
      },
    ],
    limitations: [
      "구조 안전, 음영, 옥상 장애물, 실제 배치와 법규 조건은 반영하지 않은 사전 검토 값입니다.",
    ],
  });
}
