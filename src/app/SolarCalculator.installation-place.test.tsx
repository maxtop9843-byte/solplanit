import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator installation place copy", () => {
  it("uses a place label that also makes sense when the user selects land", () => {
    render(<SolarCalculator />);

    const installationPlace = screen.getByLabelText("설치할 곳");
    fireEvent.change(installationPlace, { target: { value: "토지" } });
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.queryByLabelText("건물 종류")).not.toBeInTheDocument();
    expect(screen.getByText("선택한 설치 장소")).toBeInTheDocument();
    expect(screen.getByText("토지", { selector: "dd" })).toBeInTheDocument();
  });
});
