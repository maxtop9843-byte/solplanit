import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import ProWorkspace from "./ProWorkspace";

vi.mock("maplibre-gl", () => ({
  default: {
    Map: class { addControl() {} on() {} remove() {} },
    Marker: class { setLngLat() { return this; } addTo() { return this; } },
    NavigationControl: class {},
    AttributionControl: class {},
  },
}));

const pvgisResponse = {
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-07-30T00:00:00.000Z",
  data: {
    outputs: {
      monthly: {
        fixed: Array.from({ length: 12 }, (_, index) => ({ month: index + 1, E_m: 900 + index * 10, "H(i)_m": 100 + index, SD_m: 40 + index })),
      },
      totals: { fixed: { E_y: 11460, "H(i)_y": 1320.5, SD_y: 420, l_total: -18.4 } },
      horizon_profile: [{ A: -180, H_hor: 2 }, { A: 0, H_hor: 5 }, { A: 180, H_hor: 3 }],
    },
  },
};

afterEach(() => vi.restoreAllMocks());

describe("ProWorkspace", () => {
  it("shows fixed-system inputs and renders PVGIS outputs", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify(pvgisResponse), { status: 200, headers: { "Content-Type": "application/json" } }));
    render(<ProWorkspace />);

    expect(screen.getByRole("heading", { name: "태양광 발전량 분석" })).toBeInTheDocument();
    expect(screen.getByLabelText("태양광 분석 위치 선택 지도")).toBeInTheDocument();
    expect(screen.getByLabelText(/설치 용량/)).toHaveValue(10);
    expect(screen.getByRole("button", { name: "분석 실행" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "분석 실행" }));
    expect(screen.getByRole("button", { name: "분석 중…" })).toBeDisabled();

    await waitFor(() => expect(screen.getByText("PVGIS 5.3 분석 결과를 불러왔습니다.")).toBeInTheDocument());
    expect(screen.getByText("11,460")).toBeInTheDocument();
    expect(screen.getByText("1,320.5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "월별 발전량" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "가정과 출처" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "지평선 프로파일" })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/pvgis", expect.objectContaining({ method: "POST" }));
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
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: { message: "PVGIS 요청이 많아 잠시 후 다시 시도해 주세요." } }), { status: 503, headers: { "Content-Type": "application/json" } }));
    render(<ProWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: "분석 실행" }));
    await waitFor(() => expect(screen.getByText("PVGIS 요청이 많아 잠시 후 다시 시도해 주세요.")).toBeInTheDocument());
    expect(screen.getByText("계산 전")).toBeInTheDocument();
  });
});
