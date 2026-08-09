import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator area unit feedback", () => {
  it("announces the converted roof area when the user changes units", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByRole("spinbutton", { name: "지붕 면적" });
    fireEvent.change(areaInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "평" }));

    expect(areaInput).toHaveValue(30.25);
    expect(screen.getByRole("status")).toHaveTextContent("면적을 30.25평으로 바꿨어요.");
  });

  it("clears the conversion notice after the user edits the area", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByRole("spinbutton", { name: "지붕 면적" });
    fireEvent.change(areaInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "평" }));
    fireEvent.change(areaInput, { target: { value: "31" } });

    expect(screen.queryByText(/면적을 .*으로 바꿨어요/)).not.toBeInTheDocument();
  });
});
