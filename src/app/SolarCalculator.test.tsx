import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SolarCalculator from "./SolarCalculator";

function renderCalculator(building = "주택") {
  const view = render(<SolarCalculator />);
  if (building) {
    fireEvent.change(screen.getByLabelText("건물 종류"), { target: { value: building } });
  }
  return view;
}

describe("SolarCalculator", () => {
  it("requires the user to choose a building type instead of silently assuming a home", () => {
    render(<SolarCalculator />);

    const building = screen.getByLabelText("건물 종류");
    expect(building).toHaveValue("");
    expect(screen.getByRole("option", { name: "선택해 주세요" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("건물 종류를 선택해 주세요.");
    expect(building).toHaveAttribute("aria-invalid", "true");
    expect(building).toHaveAttribute("aria-describedby", "building-error");
    expect(building).toHaveFocus();
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();

    fireEvent.change(building, { target: { value: "주택" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(building).not.toHaveAttribute("aria-invalid");
  });

  it("calculates installable capacity from inputs a general user can understand", () => {
    renderCalculator();

    expect(screen.getByLabelText("건물 종류")).toBeInTheDocument();
    expect(screen.getByLabelText("지붕 면적")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
    expect(screen.getByText("약 21장")).toBeInTheDocument();
  });

  it("gives a unit-aware example without using the placeholder as the field label", () => {
    renderCalculator();

    const areaInput = screen.getByLabelText("지붕 면적");
    expect(areaInput).toHaveAttribute("placeholder", "예: 100");
    expect(screen.getByText(/정확하지 않아도 괜찮아요/)).toHaveAttribute("id", "area-help");

    fireEvent.click(screen.getByRole("button", { name: "평" }));
    expect(areaInput).toHaveAttribute("placeholder", "예: 30");
  });

  it("accepts decimal roof areas and submits as a form", () => {
    renderCalculator();

    const areaInput = screen.getByLabelText("지붕 면적");
    expect(areaInput).toHaveAttribute("step", "any");
    expect(areaInput).not.toHaveAttribute("min");
    fireEvent.change(areaInput, { target: { value: "10.5" } });

    const submitButton = screen.getByRole("button", { name: "설치 가능 용량 계산하기" });
    fireEvent.submit(submitButton.closest("form")!);

    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();
    expect(screen.getByText("10.5m²")).toBeInTheDocument();
  });

  it("moves keyboard focus to the result after a successful calculation", async () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    const result = screen.getByRole("region", { name: "계산 결과" });
    await waitFor(() => expect(result).toHaveFocus());
    expect(result).toHaveAttribute("tabindex", "-1");
  });

  it("shows the estimate status and every user input that affects the result", () => {
    renderCalculator("상가·건물");

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByText("간단 예상치")).toBeInTheDocument();
    expect(screen.getByText("상가·건물", { selector: "dd" })).toBeInTheDocument();
    expect(screen.getByText("100m²")).toBeInTheDocument();
    expect(screen.getByText("약 60%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /가정과 출처 보기/ })).toHaveAttribute("href", "/trust/methodology");
  });

  it("makes unavailable money results explicit instead of inventing numbers", () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("note", { name: "아직 제공하지 않는 금액 결과" })).toHaveTextContent(
      "설치비·보조금·전기요금 절감액은 아직 표시하지 않습니다.",
    );
  });

  it("lets a user say they do not know the roof area without inventing a result", () => {
    renderCalculator();

    fireEvent.click(screen.getByRole("button", { name: "지붕 면적을 잘 모르겠어요" }));

    expect(screen.getByText("면적을 모르면 용량을 임의로 계산하지 않습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "설치 가능 용량 계산하기" })).not.toBeInTheDocument();
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "지붕 면적 입력하기" })).toBeInTheDocument();
  });

  it("does not ask a home user for professional economics assumptions", () => {
    renderCalculator();

    expect(screen.queryByText("평균 일 발전시간")).not.toBeInTheDocument();
    expect(screen.queryByText("시스템 손실률")).not.toBeInTheDocument();
    expect(screen.queryByText("자가소비율")).not.toBeInTheDocument();
    expect(screen.queryByText("SMP 단가")).not.toBeInTheDocument();
    expect(screen.queryByText("REC 단가")).not.toBeInTheDocument();
  });

  it("keeps exactly one primary result surface", () => {
    const { container } = renderCalculator();
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(container.querySelectorAll(".resultFill")).toHaveLength(1);
  });

  it("connects an area error to the field and clears it when the user edits", () => {
    renderCalculator();

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveAttribute("id", "area-error");
    expect(areaInput).toHaveAttribute("aria-invalid", "true");
    expect(areaInput).toHaveAttribute("aria-describedby", expect.stringContaining("area-error"));

    fireEvent.change(areaInput, { target: { value: "10" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(areaInput).not.toHaveAttribute("aria-invalid");
  });

  it("clears a calculated result as soon as an input that affects it changes", () => {
    renderCalculator();

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("예상 설치 가능 용량")).toBeInTheDocument();

    fireEvent.change(areaInput, { target: { value: "110" } });
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    fireEvent.change(screen.getByLabelText("건물 종류"), { target: { value: "상가·건물" } });
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();
  });

  it("preserves the physical roof area when switching between square meters and pyeong", () => {
    renderCalculator();

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("9.5kW")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "평" }));
    expect(areaInput).toHaveValue(30.25);
    expect(screen.queryByText("예상 설치 가능 용량")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("면적을 30.25평으로 바꿨어요.");

    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("9.5kW")).toBeInTheDocument();
    expect(screen.getByText("30.25평")).toBeInTheDocument();
  });

  it("uses the calculation contract for area errors on blur and submit", () => {
    renderCalculator();

    const areaInput = screen.getByLabelText("지붕 면적");
    fireEvent.change(areaInput, { target: { value: "1" } });
    fireEvent.blur(areaInput);

    const expectedMessage = "패널 한 장도 놓기 어려운 면적입니다. 5m² 이상 넣어 주세요.";
    expect(screen.getByRole("alert")).toHaveTextContent(expectedMessage);
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByRole("alert")).toHaveTextContent(expectedMessage);
  });

  it("shows a pyeong boundary when pyeong is selected", () => {
    renderCalculator();

    fireEvent.click(screen.getByRole("button", { name: "평" }));
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "1.5" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("alert")).toHaveTextContent("1.52평 이상 넣어 주세요.");
    expect(screen.getByRole("alert")).not.toHaveTextContent("5m² 이상");
  });

  it("links a capacity result to the precise generation calculator", () => {
    renderCalculator();
    fireEvent.change(screen.getByLabelText("지붕 면적"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));

    expect(screen.getByRole("link", { name: /정밀 발전량 계산하기/ })).toHaveAttribute(
      "href",
      expect.stringContaining("/pro?source=general&capacity=9.45"),
    );
  });
});
