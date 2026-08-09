import { render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator building type copy", () => {
  it("uses a building-type label now that the roof-capacity flow excludes land", () => {
    render(<SolarCalculator />);

    const buildingType = screen.getByLabelText("건물 종류");

    expect(screen.queryByLabelText("설치할 곳")).not.toBeInTheDocument();
    expect(buildingType).toHaveTextContent("주택");
    expect(buildingType).toHaveTextContent("상가·건물");
    expect(buildingType).toHaveTextContent("공장·창고");
    expect(buildingType).not.toHaveTextContent("토지");
  });
});
