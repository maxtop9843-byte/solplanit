import { render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator roof scope", () => {
  it("only offers building types that have a roof in the roof-capacity flow", () => {
    render(<SolarCalculator />);

    const installationPlace = screen.getByLabelText("설치할 곳");

    expect(installationPlace).toHaveTextContent("주택");
    expect(installationPlace).toHaveTextContent("상가·건물");
    expect(installationPlace).toHaveTextContent("공장·창고");
    expect(installationPlace).not.toHaveTextContent("토지");
  });
});
