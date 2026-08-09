import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator missing roof area", () => {
  it("distinguishes a missing roof area from an area that is too small", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("건물 종류"), { target: { value: "주택" } });
    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("지붕 면적을 입력해 주세요.");
    expect(areaInput).toHaveFocus();
    expect(areaInput).toHaveAttribute("aria-invalid", "true");

    fireEvent.change(areaInput, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("패널 한 장도 놓기 어려운 면적입니다. 5m² 이상 넣어 주세요.");
  });
});
