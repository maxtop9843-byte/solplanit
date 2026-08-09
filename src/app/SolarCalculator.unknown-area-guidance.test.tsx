import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator unknown roof-area guidance", () => {
  it("gives an actionable next step without estimating an unknown roof area", () => {
    render(<SolarCalculator />);

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));

    expect(screen.getByText(/건축 도면이나 실측으로 지붕 면적을 확인한 뒤/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /설치 전 확인사항 보기/ })).toHaveAttribute("href", "/guides");
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();
  });
});
