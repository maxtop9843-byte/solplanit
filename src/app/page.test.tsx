import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the decision-first hero", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /태양광 설치,\s*감이 아니라 숫자로 결정하세요/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/계정 없음 · 영업 연락 없음 · 계산 근거 공개/)).toBeInTheDocument();
  });

  it("keeps two major homepage blocks while expanding the product flow", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll("main > section")).toHaveLength(2);
    expect(container.querySelector(".blockTool")).not.toBeNull();
    expect(container.querySelector(".blockEvidence")).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /정밀 분석/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /가이드/ }).length).toBeGreaterThan(0);
  });

  it("states where every number comes from", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /결과보다 먼저,\s*근거를 확인할 수 있게/ })).toBeInTheDocument();
    expect(screen.getByText(/PVGIS 5.3/)).toBeInTheDocument();
    expect(screen.getByText("갱신일")).toBeInTheDocument();
  });
});
