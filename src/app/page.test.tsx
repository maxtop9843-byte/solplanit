import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("explains the calculator in plain Korean", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /우리 건물에 태양광,\s*얼마나 설치할 수 있을까요/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/전문 용어 입력 없음 · 회원가입 없음 · 계산 기준 공개/)).toBeInTheDocument();
  });

  it("keeps two major homepage blocks and links to real next steps", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll("main > section")).toHaveLength(2);
    expect(container.querySelector(".blockTool")).not.toBeNull();
    expect(container.querySelector(".blockEvidence")).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /발전량/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /계산 기준/ }).length).toBeGreaterThan(0);
  });

  it("states where the calculation comes from and what still needs field review", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /계산 결과와 함께,\s*그 숫자의 기준도 보여드립니다/ })).toBeInTheDocument();
    expect(screen.getByText(/PVGIS 5.3/)).toBeInTheDocument();
    expect(screen.getByText("꼭 확인할 것")).toBeInTheDocument();
  });
});
