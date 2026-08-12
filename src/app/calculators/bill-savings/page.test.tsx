import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BillSavingsPage from "./page";

describe("BillSavingsPage", () => {
  it("offers related cost and subsidy calculators after the savings flow", () => {
    render(<BillSavingsPage />);

    expect(screen.getByRole("heading", { name: "다음으로 무엇을 확인할까요?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3kW 태양광 설치비 확인하기" })).toHaveAttribute(
      "href",
      "/calculators/solar-3kw-cost",
    );
    expect(screen.getByRole("link", { name: "2026 태양광 지원 확인하기" })).toHaveAttribute(
      "href",
      "/calculators/subsidy",
    );
  });
});
