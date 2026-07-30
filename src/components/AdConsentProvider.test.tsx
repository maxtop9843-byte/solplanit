import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import AdConsentProvider from "./AdConsentProvider";

const storageKey = "solplanit.ad-consent.v1";

describe("AdConsentProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps core content available while offering equal consent choices", async () => {
    render(
      <AdConsentProvider>
        <main>계산기 본문</main>
      </AdConsentProvider>,
    );

    expect(screen.getByText("계산기 본문")).toBeInTheDocument();
    expect(await screen.findByLabelText("광고 개인정보 설정")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "광고 거부" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "광고 동의" })).toBeInTheDocument();
  });

  it("persists rejection and lets the user reopen settings", async () => {
    render(
      <AdConsentProvider>
        <main>계산기 본문</main>
      </AdConsentProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "광고 거부" }));
    expect(window.localStorage.getItem(storageKey)).toBe("rejected");
    expect(screen.queryByLabelText("광고 개인정보 설정")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "광고 설정" }));
    expect(screen.getByLabelText("광고 개인정보 설정")).toBeInTheDocument();
  });

  it("restores an existing decision without blocking the page", async () => {
    window.localStorage.setItem(storageKey, "rejected");

    render(
      <AdConsentProvider>
        <main>계산기 본문</main>
      </AdConsentProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "광고 설정" })).toBeInTheDocument();
    });
    expect(screen.getByText("계산기 본문")).toBeInTheDocument();
  });
});
