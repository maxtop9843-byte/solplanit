import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import GuidedCalculator from "./GuidedCalculator";

vi.mock("./MapLocationPicker", () => ({
  DEFAULT_SOLPLANIT_LOCATION: { latitude: 37.5665, longitude: 126.978 },
  default: () => <div aria-label="지도 위치 선택기">서울 기본 위치</div>,
}));

vi.mock("./ResultSummary", () => ({
  default: ({ economics }: { economics: unknown }) => (
    <div>{economics ? "발전량·경제성 요약" : "설치 가능 용량 요약"}</div>
  ),
}));

describe("GuidedCalculator general-user journey", () => {
  it("validates required inputs and completes capacity plus savings calculations", () => {
    render(<GuidedCalculator />);

    expect(screen.getByText("1/4")).toBeInTheDocument();
    expect(screen.getAllByText("어디에 설치할 예정인가요?").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));

    expect(screen.getByText("2/4")).toBeInTheDocument();
    expect(screen.getAllByText("태양광을 설치할 공간은 얼마나 되나요?").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));
    expect(screen.getByRole("alert")).toHaveTextContent("0보다 큰 설치 면적을 입력해주세요.");

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));

    expect(screen.getByText("3/4")).toBeInTheDocument();
    expect(screen.getAllByText("설치 위치를 지도에서 선택해주세요").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("지도 위치 선택기")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));

    expect(screen.getByText("4/4")).toBeInTheDocument();
    expect(screen.getAllByText("태양광으로 무엇을 기대하시나요?").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "입력 내용 확인하기" }));
    expect(screen.getByRole("alert")).toHaveTextContent("계산 목적을 선택해주세요.");

    fireEvent.click(screen.getByLabelText(/전기요금 절감/));
    fireEvent.click(screen.getByRole("button", { name: "입력 내용 확인하기" }));
    expect(screen.getByText("입력한 조건이 맞나요?")).toBeInTheDocument();
    expect(screen.getByText(/주택 · 100m² · 위도 37.5665 · 경도 126.9780 · 전기요금 절감/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "설치 가능 용량 계산하기" }));
    expect(screen.getByText("설치 가능 용량 요약")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "절감액 계산하기" }));
    const assumptionInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(assumptionInputs[0], { target: { value: "3.6" } });
    fireEvent.change(assumptionInputs[1], { target: { value: "14" } });
    fireEvent.change(assumptionInputs[2], { target: { value: "1500000" } });
    fireEvent.change(assumptionInputs[3], { target: { value: "80" } });
    fireEvent.change(assumptionInputs[4], { target: { value: "180" } });
    fireEvent.click(screen.getByRole("button", { name: "발전량과 경제성 계산하기" }));

    expect(screen.getByText("발전량·경제성 요약")).toBeInTheDocument();
    expect(screen.getByText("발전량·경제성 결과")).toBeInTheDocument();
    expect(screen.getByText("적용한 경제성 가정과 한계")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "가정값 다시 계산하기" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "입력 수정하기" })).toBeEnabled();
  });

  it("keeps previous-step navigation and user-entered area intact", () => {
    render(<GuidedCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "88" } });
    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));
    fireEvent.click(screen.getByRole("button", { name: "이전" }));

    expect(screen.getByRole("spinbutton")).toHaveValue(88);
    expect(screen.getByText(/주택 · 88m²/)).toBeInTheDocument();
  });
});
