import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator error recovery", () => {
  it("focuses the roof area field after a calculation error", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("건물 종류"), { target: { value: "주택" } });
    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(areaInput).toHaveFocus();
  });
});
