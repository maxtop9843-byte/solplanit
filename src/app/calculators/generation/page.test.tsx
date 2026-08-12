import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GenerationPage from "./page";

describe("GenerationPage", () => {
  it("keeps the primary flow focused on region and capacity", () => {
    render(<GenerationPage />);
    expect(screen.getByRole("heading", { name: /우리 지역에서는/ })).toBeInTheDocument();
    expect(screen.getByLabelText("지역")).toBeInTheDocument();
    expect(screen.getByLabelText("설치 용량")).toBeInTheDocument();
    expect(screen.queryByLabelText(/시스템 손실률/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예상 발전량 계산하기" })).toBeInTheDocument();
  });
});
