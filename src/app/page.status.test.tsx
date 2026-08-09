import { render, screen } from "@testing-library/react";

import HomePage from "./page";

describe("HomePage primary task", () => {
  it("puts the usable roof-capacity calculator before secondary and pending answers", () => {
    const { container } = render(<HomePage />);

    expect(screen.getByLabelText("설치할 곳")).toBeInTheDocument();
    expect(screen.getByLabelText("지붕 면적")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "설치 가능 용량 계산하기" })).toBeInTheDocument();

    expect(container.querySelector(".homeFlow")).toBeNull();
    expect(container.querySelector(".pendingAnswers")).toBeNull();
    expect(screen.queryByText("설치하면 얼마가 들까요?")).not.toBeInTheDocument();
    expect(screen.queryByText("보조금을 받을 수 있을까요?")).not.toBeInTheDocument();
    expect(screen.queryByText("전기요금은 얼마나 줄어들까요?")).not.toBeInTheDocument();

    expect(screen.getAllByRole("link", { name: /발전량/ }).length).toBeGreaterThan(0);
  });
});
