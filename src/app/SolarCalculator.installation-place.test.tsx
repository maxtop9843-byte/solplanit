import { render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator installation place copy", () => {
  it("keeps the roof-capacity flow limited to installation places with a roof", () => {
    render(<SolarCalculator />);

    const installationPlace = screen.getByLabelText("설치할 곳");

    expect(screen.queryByLabelText("건물 종류")).not.toBeInTheDocument();
    expect(installationPlace).toHaveTextContent("주택");
    expect(installationPlace).toHaveTextContent("상가·건물");
    expect(installationPlace).toHaveTextContent("공장·창고");
    expect(installationPlace).not.toHaveTextContent("토지");
  });
});
