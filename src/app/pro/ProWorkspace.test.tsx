import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import ProWorkspace from "./ProWorkspace";

const pvgisResponse = {
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-07-30T00:00:00.000Z",
  data: {
    outputs: {
      monthly: {
        fixed: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          E_m: 900 + index * 10,
          "H(i)_m": 100 + index,
          SD_m: 40 + index,
        })),
      },
      totals: {
        fixed: { E_y: 11460, "H(i)_y": 1320.5, SD_y: 420, l_total: -18.4 },
      },
      horizon_profile: [
        { A: -180, H_hor: 2 },
        { A: 0, H_hor: 5 },
        { A: 180, H_hor: 3 },
      ],
    },
  },
};

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/pro");
});

describe("ProWorkspace", () => {
  it("shows fixed-system inputs, renders PVGIS outputs, and enables downloads", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(pvgisResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<ProWorkspace />);

    expect(screen.getByRole("heading", { name: "태양광 발전량 분석" })).toBeInTheDocument();
    expect(screen.getByLabelText("태양광 분석 위치 선택 지도")).toBeInTheDocument();
    expect(screen.getByLabelText(/설치 용량/)).toHaveValue(10);
    expect(screen.getByRole("button", { name: "분석 실행" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "CSV" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "JSON" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "차트 이미지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "PDF 보고서" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "분석 실행" }));
    expect(screen.getByRole("button", { name: "분석 중…" })).toBeDisabled();

    await waitFor(() =>
      expect(screen.getByText("PVGIS 5.3 분석 결과를 불러왔습니다.")).toBeInTheDocument(),
    );
    expect(screen.getByText("11,460")).toBeInTheDocument();
    expect(screen.getByText("1,321")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "월별 발전량" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "가정과 출처" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "지평선 프로파일" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CSV" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "JSON" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "차트 이미지" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "PDF 보고서" })).toBeEnabled();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/pvgis",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("imports a general-user result into the professional system inputs", async () => {
    window.history.replaceState({}, "", "/pro?source=general&capacity=23.4&panels=52&generation=31200&benefit=4680000&payback=6.8&goal=save");
    render(<ProWorkspace />);

    await waitFor(() => expect(screen.getByLabelText(/설치 용량/)).toHaveValue(23.4));
    expect(screen.getByText("일반 사용자 계산에서 가져옴")).toBeInTheDocument();
    expect(screen.getByText(/추천 용량 23.4kW · 패널 약 52장/)).toBeInTheDocument();
    expect(screen.getByText("가져오기 완료")).toBeInTheDocument();
    expect(screen.getByText(/전문 조건을 확인한 뒤 분석을 실행하세요/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "경제성" }));
    expect(screen.getByText(/연간 예상 절감액 4,680,000원/)).toBeInTheDocument();
  });

  it("ignores an invalid imported capacity", () => {
    window.history.replaceState({}, "", "/pro?source=general&capacity=0&panels=52");
    render(<ProWorkspace />);
    expect(screen.getByLabelText(/설치 용량/)).toHaveValue(10);
    expect(screen.queryByText("일반 사용자 계산에서 가져옴")).not.toBeInTheDocument();
  });

  it("keeps invalid inputs from calling the proxy", () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    render(<ProWorkspace />);
    fireEvent.change(screen.getByLabelText(/설치 용량/), { target: { value: "0" } });
    expect(screen.getByText(/설치 용량은 0보다 크고/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "분석 실행" })).toBeDisabled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows a Korean upstream error and clears stale output", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { message: "PVGIS 요청이 많아 잠시 후 다시 시도해 주세요." },
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      ),
    );
    render(<ProWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: "분석 실행" }));
    await waitFor(() =>
      expect(
        screen.getByText("PVGIS 요청이 많아 잠시 후 다시 시도해 주세요."),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText("계산 전")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CSV" })).toBeDisabled();
  });
});
