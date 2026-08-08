import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator", () => {
  it("calculates installable capacity from inputs a general user can understand", () => {
    render(<SolarCalculator />);

    expect(screen.getByLabelText("건물 종류")).toBeInTheDocument();
    expect(screen.getByLabelText("패널을 설치할 수 있는 지붕 면적")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "설치 가능 용량 계산하기" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("패널을 설치할 수 있는 지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
    expect(screen.getByText("약 21장")).toBeInTheDocument();
  });

  it("does not ask a home user for professional economics assumptions", () => {
    render(<SolarCalculator />);

    expect(screen.queryByText("평균 일 발전시간")).not.toBeInTheDocument();
    expect(screen.queryByText("시스템 손실률")).not.toBeInTheDocument();
    expect(screen.queryByText("자가소비율")).not.toBeInTheDocument();
    expect(screen.queryByText("SMP 단가")).not.toBeInTheDocument();
    expect(screen.queryByText("REC 단가")).not.toBeInTheDocument();
  });

  it("keeps exactly one primary result surface", () => {
    const { container } = render(<SolarCalculator />);
    fireEvent.change(screen.getByLabelText("패널을 설치할 수 있는 지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(container.querySelectorAll(".resultFill")).toHaveLength(1);
  });

  it("rejects an area below the documented minimum", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("패널을 설치할 수 있는 지붕 면적"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("5m² 이상 넣어주세요");
  });

  it("links a capacity result to the precise generation calculator", () => {
    render(<SolarCalculator />);
    fireEvent.change(screen.getByLabelText("패널을 설치할 수 있는 지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    const link = screen.getByRole("link", { name: /정밀 발전량 계산하기/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("/pro?source=general&capacity=9.45"));
  });
});
