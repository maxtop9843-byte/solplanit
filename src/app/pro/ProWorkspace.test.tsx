import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ProWorkspace from "./ProWorkspace";

vi.mock("maplibre-gl", () => ({
  default: {
    Map: class {
      addControl() {}
      on() {}
      remove() {}
    },
    Marker: class {
      setLngLat() { return this; }
      addTo() { return this; }
    },
    NavigationControl: class {},
    AttributionControl: class {},
  },
}));

describe("ProWorkspace", () => {
  it("shows the PVGIS fixed-system input and result workflow", async () => {
    render(<ProWorkspace />);

    expect(screen.getByRole("heading", { name: "태양광 발전량 분석" })).toBeInTheDocument();
    expect(screen.getByLabelText("태양광 분석 위치 선택 지도")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "시스템" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText(/설치 용량/)).toHaveValue(10);
    expect(screen.getByLabelText("모듈 기술")).toHaveValue("crystSi");
    expect(screen.getByLabelText("설치 방식")).toHaveValue("building");
    expect(screen.getByLabelText("복사 데이터베이스")).toHaveValue("PVGIS-SARAH3");
    expect(screen.getByLabelText("PVGIS 지평선 음영 데이터 사용")).toBeChecked();
    expect(screen.getByRole("button", { name: "분석 실행" })).toBeEnabled();
    expect(screen.getByText(/필수 입력이 유효합니다/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/설치 용량/), { target: { value: "0" } });
    expect(screen.getByText(/설치 용량은 0보다 크고/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "분석 실행" })).toBeDisabled();

    fireEvent.click(screen.getByRole("tab", { name: "손실" }));
    expect(screen.getByRole("heading", { name: "시스템 손실" })).toBeInTheDocument();
    expect(screen.getByLabelText(/통합 시스템 손실/)).toHaveValue(14);

    fireEvent.click(screen.getByRole("tab", { name: "경제성" }));
    expect(screen.getByText("경제성 가정")).toBeInTheDocument();
  });
});
