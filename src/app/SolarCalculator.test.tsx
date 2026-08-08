import { fireEvent, render, screen } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator", () => {
  it("returns the capacity result on the same screen from one card", () => {
    render(<SolarCalculator />);

    // 위저드 단계가 없다. 세 입력과 버튼 하나가 한 화면에 있다.
    expect(screen.getByLabelText("건물 유형")).toBeInTheDocument();
    expect(screen.getByLabelText("지붕 면적")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "계산하기" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "계산하기" }));

    // 주택 100m² → 55m² 배치 가능 → 2.6m²/장 → 21장 → 9.45kW
    expect(screen.getByText("설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
    expect(screen.getByText("21장")).toBeInTheDocument();
  });

  it("keeps exactly one result-fill surface", () => {
    const { container } = render(<SolarCalculator />);
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "계산하기" }));

    expect(container.querySelectorAll(".resultFill")).toHaveLength(1);
  });

  it("rejects an area below the documented minimum", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("5m² 이상 넣어주세요");
  });

  it("calculates economics only from user-entered assumptions", () => {
    render(<SolarCalculator />);
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "계산하기" }));

    fireEvent.click(screen.getByText("발전량과 수익까지 계산하기"));
    fireEvent.change(screen.getByLabelText(/평균 일 발전시간/), { target: { value: "3.6" } });
    fireEvent.change(screen.getByLabelText(/시스템 손실률/), { target: { value: "14" } });
    fireEvent.change(screen.getByLabelText(/kW당 설치비/), { target: { value: "1500000" } });
    fireEvent.change(screen.getByLabelText(/자가소비율/), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText(/자가소비 전력 가치/), { target: { value: "180" } });
    fireEvent.click(screen.getByRole("button", { name: "발전량과 수익 계산하기" }));

    expect(screen.getByText("연간 예상 발전량")).toBeInTheDocument();
    expect(screen.getByText("단순 회수기간")).toBeInTheDocument();
  });

  it("reports missing assumptions instead of guessing them", () => {
    render(<SolarCalculator />);
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "계산하기" }));

    fireEvent.click(screen.getByText("발전량과 수익까지 계산하기"));
    fireEvent.click(screen.getByRole("button", { name: "발전량과 수익 계산하기" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
