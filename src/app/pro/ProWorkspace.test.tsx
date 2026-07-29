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
  it("shows the map-left professional input and result workflow", async () => {
    render(<ProWorkspace />);

    expect(screen.getByRole("heading", { name: "태양광 발전량 분석" })).toBeInTheDocument();
    expect(screen.getByLabelText("태양광 분석 위치 선택 지도")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "시스템" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText(/설치 용량/)).toHaveValue(10);
    expect(screen.getByText("PVGIS 5.3 연결 예정")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "분석 실행" })).toBeDisabled();

    fireEvent.click(screen.getByRole("tab", { name: "손실" }));
    expect(screen.getByText("시스템 손실 설정")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "경제성" }));
    expect(screen.getByText("경제성 가정")).toBeInTheDocument();
  });
});
