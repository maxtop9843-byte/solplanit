import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BillSavingsCalculator from "./BillSavingsCalculator";

const payload = {
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-08-13T00:00:00.000Z",
  request: {
    latitude: 37.5665,
    longitude: 126.978,
    peakPowerKw: 3,
    systemLossPercent: 14,
    useHorizon: true,
    radiationDatabase: "PVGIS-SARAH3",
  },
  data: {
    outputs: {
      monthly: {
        fixed: [{ month: 8, E_m: 305.2 }],
      },
    },
  },
};

afterEach(() => vi.restoreAllMocks());

describe("BillSavingsCalculator", () => {
  it("does not invent unknown inputs and links to the capacity calculator", () => {
    render(<BillSavingsCalculator />);
    expect(screen.getByLabelText("월 전기 사용량")).toHaveValue("");
    expect(screen.getByLabelText("설치 용량")).toHaveValue("");
    expect(screen.getByRole("link", { name: "설치 가능 용량 계산하기" })).toHaveAttribute("href", "/#quick-estimate");
  });

  it("shows a clear validation error before making a request", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<BillSavingsCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "전기요금 절감액 계산하기" }));
    expect(screen.getByRole("alert")).toHaveTextContent("월 전기 사용량을 0kWh 이상의 숫자로 입력해 주세요.");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("connects PVGIS generation to the verified bill-savings range", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    render(<BillSavingsCalculator />);
    fireEvent.change(screen.getByLabelText("월 전기 사용량"), { target: { value: "400" } });
    fireEvent.change(screen.getByLabelText("설치 용량"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "전기요금 절감액 계산하기" }));

    await waitFor(() => expect(screen.getByText("서울 중심 기준 예상 발전량")).toBeInTheDocument());
    expect(screen.getByText(/305\.2kWh/)).toBeInTheDocument();
    expect(screen.getByText("예상 월 절감액")).toBeInTheDocument();
    expect(screen.getByText(/자가소비율을 임의로 정하지 않았습니다/)).toBeInTheDocument();
  });

  it("separates external-data errors from a zero result", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: "PVGIS 조회가 지연되고 있습니다." } }),
    } as Response);

    render(<BillSavingsCalculator />);
    fireEvent.change(screen.getByLabelText("월 전기 사용량"), { target: { value: "400" } });
    fireEvent.change(screen.getByLabelText("설치 용량"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "전기요금 절감액 계산하기" }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("PVGIS 조회가 지연되고 있습니다."));
    expect(screen.queryByText("예상 월 절감액")).not.toBeInTheDocument();
  });
});
