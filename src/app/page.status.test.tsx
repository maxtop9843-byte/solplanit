import { render, screen } from "@testing-library/react";

import HomePage from "./page";

describe("HomePage answer status", () => {
  it("separates usable tools from money answers that still need verified data", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: /우리 지역에서는 얼마나 발전할까요/ })).toHaveAttribute("href", "/pro");
    expect(screen.getByText("설치하면 얼마가 들까요?")).toBeInTheDocument();
    expect(screen.getByText("보조금을 받을 수 있을까요?")).toBeInTheDocument();
    expect(screen.getByText("전기요금은 얼마나 줄어들까요?")).toBeInTheDocument();
    expect(screen.getAllByText("지금 가능").length).toBeGreaterThanOrEqual(2);

    expect(screen.queryByRole("link", { name: "설치하면 얼마가 들까요?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "보조금을 받을 수 있을까요?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "전기요금은 얼마나 줄어들까요?" })).not.toBeInTheDocument();
  });
});
