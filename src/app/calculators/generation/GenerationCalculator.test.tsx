import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GenerationCalculator from "./GenerationCalculator";

const payload = {
  source: "PVGIS",
  version: "5.3",
  verifiedAt: "2026-07-30",
  retrievedAt: "2026-08-13T00:00:00.000Z",
  request: {
    latitude: 37.5665,
    longitude: 126.978,
    peakPowerKw: 3,
    systemLossPercent: 14,
    tiltDegrees: 30,
    azimuthDegrees: 0,
    useHorizon: true,
    radiationDatabase: "PVGIS-SARAH3",
  },
  data: {
    outputs: {
      monthly: {
        fixed: Array.from({ length: 12 }, (_, index) => ({ month: index + 1, E_m: 300 + index })),
      },
      totals: {
        fixed: { E_y: 3666 },
      },
    },
  },
};

afterEach(() => vi.restoreAllMocks());

describe("GenerationCalculator", () => {
  it("keeps roof conditions optional and sends them only when the user enters them", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    render(<GenerationCalculator />);
    expect(screen.getByText("상세 조건")).toBeInTheDocument();
    expect(screen.getByLabelText("패널 경사각")).toHaveValue("");
    expect(screen.getByLabelText("패널 방향")).toHaveValue("");

    fireEvent.change(screen.getByLabelText("패널 경사각"), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText("패널 방향"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "예상 발전량 계산하기" }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    const [, request] = fetchSpy.mock.calls[0];
    const body = JSON.parse(String((request as RequestInit).body));
    expect(body).toMatchObject({ tiltDegrees: 30, azimuthDegrees: 0 });
    await waitFor(() => expect(screen.getByText("연간 예상 발전량")).toBeInTheDocument());
    expect(screen.getByText(/입력한 경사·방향 조건을 반영했습니다/)).toBeInTheDocument();
  });

  it("rejects an invalid tilt before requesting PVGIS", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<GenerationCalculator />);
    fireEvent.change(screen.getByLabelText("패널 경사각"), { target: { value: "91" } });
    fireEvent.click(screen.getByRole("button", { name: "예상 발전량 계산하기" }));
    expect(screen.getByRole("alert")).toHaveTextContent("패널 경사각을 0도에서 90도 사이로 입력해 주세요.");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
