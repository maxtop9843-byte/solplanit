import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the tool headline", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /우리 건물에 태양광, 얼마나 올릴 수 있나요/ }),
    ).toBeInTheDocument();
  });

  it("has exactly two blocks: the tool and the evidence", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll("main > section")).toHaveLength(2);
    expect(container.querySelector(".blockTool")).not.toBeNull();
    expect(container.querySelector(".blockEvidence")).not.toBeNull();
  });

  it("states where every number comes from", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "이 숫자가 어디서 왔는지" })).toBeInTheDocument();
    expect(screen.getByText(/PVGIS 5.3/)).toBeInTheDocument();
    expect(screen.getByText("갱신일")).toBeInTheDocument();
  });
});
