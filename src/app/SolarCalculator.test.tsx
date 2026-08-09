import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

describe("SolarCalculator", () => {
  it("calculates installable capacity from inputs a general user can understand", () => {
    render(<SolarCalculator />);

    expect(screen.getByLabelText("설치할 곳")).toBeInTheDocument();
    expect(screen.getByLabelText("지붕 면적")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "설치 가능 용량 계산하기" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
    expect(screen.getByText("약 21장")).toBeInTheDocument();
  });

  it("accepts decimal roof areas without native range constraints overriding the calculation contract", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByLabelText("지붕 면적");
    expect(areaInput).toHaveAttribute("step", "any");
    expect(areaInput).not.toHaveAttribute("min");

    fireEvent.change(areaInput, { target: { value: "10.5" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("10.5m²")).toBeInTheDocument();
  });

  it("submits the calculator as a form without requiring a mouse click", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    const submitButton = screen.getByRole("button", { name: "설치 가능 용량 계산하기" });
    const form = submitButton.closest("form");

    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
  });

  it("moves keyboard focus to the result after a successful calculation", async () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    const result = screen.getByRole("region", { name: "계산 결과" });
    await waitFor(() => expect(result).toHaveFocus());
    expect(result).toHaveAttribute("tabindex", "-1");
  });

  it("shows the estimate status and all user inputs that affect the result", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("설치할 곳"), { target: { value: "상가·건물" } });
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("간단 예상치")).toBeInTheDocument();
    expect(screen.getByText("선택한 설치 장소")).toBeInTheDocument();
    expect(screen.getByText("상가·건물", { selector: "dd" })).toBeInTheDocument();
    expect(screen.getByText("입력한 지붕 면적")).toBeInTheDocument();
    expect(screen.getByText("100m²")).toBeInTheDocument();
    expect(screen.getByText("적용한 배치 가능 비율")).toBeInTheDocument();
    expect(screen.getByText("약 60%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /가정과 출처 보기/ })).toHaveAttribute("href", "/trust/methodology");
  });

  it("makes unavailable money results explicit instead of inventing numbers", () => {
    render(<SolarCalculator />);

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("note", { name: "아직 제공하지 않는 금액 결과" })).toHaveTextContent(
      "설치비·보조금·전기요금 절감액은 아직 표시하지 않습니다.",
    );
    expect(screen.getByText(/2026년 공식 지원 자료와 한국전력 요금 모델 검증이 끝난 값만/)).toBeInTheDocument();
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

  it("connects a roof area error to the field and clears it when the user edits the value", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    const error = screen.getByRole("alert");
    expect(error).toHaveAttribute("id", "area-error");
    expect(areaInput).toHaveAttribute("aria-invalid", "true");
    expect(areaInput).toHaveAttribute("aria-describedby", expect.stringContaining("area-error"));

    fireEvent.change(areaInput, { target: { value: "10" } });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(areaInput).not.toHaveAttribute("aria-invalid");
    expect(areaInput).toHaveAttribute("aria-describedby", "area-help");
  });

  it("clears a calculated result as soon as an input that affects it changes", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();

    fireEvent.change(areaInput, { target: { value: "110" } });
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("설치할 곳"), { target: { value: "상가·건물" } });
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "평" }));
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();
  });

  it("preserves the physical roof area when switching between square meters and pyeong", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("9.5kW")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "평" }));
    expect(areaInput).toHaveValue(30.25);
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
    expect(screen.getByText("30.25평")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "m²" }));
    expect(areaInput).toHaveValue(100);
  });

  it("uses the calculation contract for the same area error on blur and submit", () => {
    render(<SolarCalculator />);

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "1" } });
    fireEvent.blur(areaInput);

    const expectedMessage = "패널 한 장도 놓기 어려운 면적입니다. 5m² 이상 넣어 주세요.";
    expect(screen.getByRole("alert")).toHaveTextContent(expectedMessage);

    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByRole("alert")).toHaveTextContent(expectedMessage);
  });

  it("shows a pyeong boundary when pyeong is the selected input unit", () => {
    render(<SolarCalculator />);

    fireEvent.click(screen.getByRole("button", { name: "평" }));
    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "1.5" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("1.52평 이상 넣어 주세요.");
    expect(screen.getByRole("alert")).not.toHaveTextContent("5m² 이상");
  });

  it("links a capacity result to the precise generation calculator", () => {
    render(<SolarCalculator />);
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    const link = screen.getByRole("link", { name: /정밀 발전량 계산하기/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("/pro?source=general&capacity=9.45"));
  });
});
