import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the approved SolPlanit headline", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /태양광 설치,\s*처음부터 끝까지 한 번에/,
      }),
    ).toBeInTheDocument();
  });
});
