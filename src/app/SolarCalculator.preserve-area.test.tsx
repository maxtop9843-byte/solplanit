import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator roof-area help", () => {
  it("preserves an entered roof area when the user opens help and returns to the field", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "100" } });

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));
    expect(screen.getByText("면적을 모르면 용량을 임의로 계산하지 않습니다.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적 입력하기" }));
    expect(screen.getByLabelText("지붕 면적")).toHaveValue(100);
  });

  it("clears an existing result while help is open without discarding the roof-area input", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적 입력하기" }));
    expect(screen.getByLabelText("지붕 면적")).toHaveValue(100);
  });
});
