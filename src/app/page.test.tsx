import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("explains the calculator in plain Korean", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /우리 건물에 태양광,\s*얼마나 설치할 수 있을까요/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/정확한 면적을 모르면 확인 방법부터 안내합니다/)).toBeInTheDocument();
    expect(screen.getByText(/결과: 설치 가능 용량 · 예상 패널 수 · 배치 가능 면적/)).toBeInTheDocument();
  });

  it("shows only calculators that are usable now", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll("main > section")).toHaveLength(3);
    expect(container.querySelector(".blockTool")).not.toBeNull();
    expect(container.querySelector(".blockHub")).not.toBeNull();
    expect(container.querySelector(".blockEvidence")).not.toBeNull();
    expect(screen.getByRole("heading", { name: /지금 바로 쓸 수 있는\s*태양광 계산기/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3kW 설치비 확인하기 →" })).toHaveAttribute("href", "/calculators/solar-3kw-cost");
    expect(screen.getByRole("link", { name: "2026 지원 확인하기 →" })).toHaveAttribute("href", "/calculators/subsidy");
    expect(screen.getByRole("link", { name: "전기요금 절감 계산하기 →" })).toHaveAttribute("href", "/calculators/bill-savings");
    expect(screen.getByRole("link", { name: "설치 가능 용량 계산하기 →" })).toHaveAttribute("href", "#quick-estimate");
    expect(screen.getByRole("link", { name: "위치별 발전량 계산하기 →" })).toHaveAttribute("href", "/pro");
    expect(screen.queryByRole("link", { name: /회수기간/ })).not.toBeInTheDocument();
  });

  it("links to real next steps", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("link", { name: /발전량/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /계산 기준/ }).length).toBeGreaterThan(0);
  });

  it("states where the calculation comes from and what still needs field review", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /계산 결과와 함께,\s*그 숫자의 기준도 보여드립니다/ })).toBeInTheDocument();
    expect(screen.getAllByText(/PVGIS 5.3/).length).toBeGreaterThan(0);
    expect(screen.getByText("꼭 확인할 것")).toBeInTheDocument();
  });
});
