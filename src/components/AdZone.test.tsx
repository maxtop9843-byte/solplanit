import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdZone from "./AdZone";

describe("AdZone", () => {
  it("renders a clearly labelled, non-interactive reserved zone while ads are disabled", () => {
    render(<AdZone placement="home-after-process" />);

    const zone = screen.getByLabelText("광고 영역");
    expect(zone).toHaveAttribute("data-ad-zone", "disabled");
    expect(zone).toHaveAttribute("data-ad-placement", "home-after-process");
    expect(zone).toHaveAttribute("data-ad-format", "wide");
    expect(zone).toHaveAttribute("data-mobile-density", "one-per-page");
    expect(screen.getByText("광고")).toBeInTheDocument();
    expect(zone.querySelector("a, button, input")).toBeNull();
    expect(zone.querySelector("ins.adsbygoogle")).toBeNull();
  });

  it("supports content-sized placements without changing semantics", () => {
    render(<AdZone placement="guides-after-list" format="content" />);

    const zone = screen.getByLabelText("광고 영역");
    expect(zone).toHaveAttribute("data-ad-format", "content");
    expect(zone).toHaveAttribute("data-ad-placement", "guides-after-list");
  });
});
