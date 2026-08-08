import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator", () => {
  it("calculates installable capacity from inputs a general user can understand", () => {
    render(<SolarCalculator />);

    expect(screen.getByLabelText("건물 종류")).toBeInTheDocument();
    expect(screen.getByLabelText("지붕 면적")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "설치 가능 용량 계산하기" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
    expect(screen.getByText("약 21장")).toBeInTheDocument();
  });

  it("shows the estimate status, user input, and key layout assumption next to the result", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("간단 예상치")).toBeInTheDocument();
    expect(screen.getByText("입력한 지붕 면적")).toBeInTheDocument();
    expect(screen.getByText("100m²")).toBeInTheDocument();
    expect(screen.getByText("적용한 배치 가능 비율")).toBeInTheDocument();
    expect(screen.getByText("약 55%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /가정과 출처 보기/ })).toHaveAttribute("href", "/trust/methodology");
  });

  it("lets a user say they do not know the roof area without inventing a result", () => {
    render(<SolarCalculator />);

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));

    expect(screen.getByText("면적을 모르면 용량을 임의로 계산하지 않습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "설치 가능 용량 계산하기" })).not.toBeInTheDocument();
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "지붕 면적 입력하기" })).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(container.querySelectorAll(".resultFill")).toHaveLength(1);
  });

  it("rejects an area below the documented minimum", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("5m² 이상 넣어주세요");
  });

  it("links a capacity result to the precise generation calculator", () => {
    render(<SolarCalculator />);
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    const link = screen.getByRole("link", { name: /정밀 발전량 계산하기/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("/pro?source=general&capacity=9.45"));
  });
});
