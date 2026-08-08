import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator unknown-area recovery", () => {
  it("moves keyboard focus to the unknown-area guidance when the area field is replaced", async () => {
    render(<SolarCalculator />);

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));

    const guidance = screen.getByText("면적을 모르면 용량을 임의로 계산하지 않습니다.").closest("#unknown-area-help");
    expect(guidance).not.toBeNull();
    await waitFor(() => expect(guidance).toHaveFocus());
  });

  it("returns keyboard focus to the roof area field when the user chooses to enter it", async () => {
    render(<SolarCalculator />);

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));
    fireEvent.click(screen.getByRole("button", { name: "지붕 면적 입력하기" }));

    const areaInput = screen.getByLabelText("지붕 면적");
    await waitFor(() => expect(areaInput).toHaveFocus());
  });
});
