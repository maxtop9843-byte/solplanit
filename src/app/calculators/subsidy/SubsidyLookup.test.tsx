import { fireEvent, render, screen } from "@testing-library/react";
import SubsidyLookup from "./SubsidyLookup";

describe("SubsidyLookup", () => {
  it("shows verified 2026 support with eligibility, period and source", () => {
    render(<SubsidyLookup />);

    expect(screen.getByRole("heading", { name: "확인된 지원 1건" })).toBeInTheDocument();
    expect(screen.getByText(/40% 지원/)).toBeInTheDocument();
    expect(screen.getByText("신청 대상")).toBeInTheDocument();
    expect(screen.getByText("신청 기간")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /2026년도 경기도 주택태양광 지원사업 공고 원문 보기/ })).toHaveAttribute(
      "href",
      expect.stringContaining("gg.go.kr"),
    );
  });

  it("shows both province and district programs without summing them", () => {
    render(<SubsidyLookup />);

    fireEvent.change(screen.getByLabelText("설치 지역"), { target: { value: "gyeonggi-uijeongbu" } });

    expect(screen.getByRole("heading", { name: "확인된 지원 2건" })).toBeInTheDocument();
    expect(screen.getByText(/40% 지원/)).toBeInTheDocument();
    expect(screen.getByText(/약 30% 지원/)).toBeInTheDocument();
    expect(screen.getByText(/지원액을 합산해 확정 자부담으로 표시하지 않습니다/)).toBeInTheDocument();
  });

  it("does not turn an unverified region into zero support", () => {
    render(<SubsidyLookup />);

    fireEvent.change(screen.getByLabelText("설치 지역"), { target: { value: "other" } });

    expect(screen.getByRole("heading", { name: "확인된 정보 없음" })).toBeInTheDocument();
    expect(screen.getByText(/지원이 없다는 뜻은 아닙니다/)).toBeInTheDocument();
    expect(screen.queryByText(/0원/)).not.toBeInTheDocument();
  });
});
