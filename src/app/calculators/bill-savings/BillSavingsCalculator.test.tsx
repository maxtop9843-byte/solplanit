import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BillSavingsCalculator from "./BillSavingsCalculator";

describe("BillSavingsCalculator", () => {
  it("asks only for user-facing inputs and keeps expert variables out of the basic form", () => {
    render(<BillSavingsCalculator />);

    expect(screen.getByLabelText("지역")).toBeInTheDocument();
    expect(screen.getByLabelText("월 전기 사용량")).toBeInTheDocument();
    expect(screen.getByLabelText("설치 용량")).toBeInTheDocument();
    expect(screen.getByLabelText("계산할 달")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예상 절감액 계산하기" })).toBeInTheDocument();

    expect(screen.queryByLabelText(/자가소비율/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/시스템 손실/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/위도|경도/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/SMP|REC/)).not.toBeInTheDocument();
  });

  it("explains that the initial result is a range rather than an invented self-consumption point estimate", () => {
    render(<BillSavingsCalculator />);

    expect(screen.getByText(/실제 절감액은 범위로 표시합니다/)).toBeInTheDocument();
  });
});
