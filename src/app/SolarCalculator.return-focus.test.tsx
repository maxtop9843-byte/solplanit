import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator unknown-area recovery", () => {
  it("returns keyboard focus to the roof area field when the user chooses to enter it", async () => {
    render(<SolarCalculator />);

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));
    fireEvent.click(screen.getByRole("button", { name: "지붕 면적 입력하기" }));

    const areaInput = screen.getByLabelText("지붕 면적");
    await waitFor(() => expect(areaInput).toHaveFocus());
  });
});
