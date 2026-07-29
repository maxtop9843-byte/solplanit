import { render, screen } from "@testing-library/react";
import CasesPage from "./page";
import { getInstallationCase, installationCases } from "./caseData";

describe("installation case gallery", () => {
  it("renders image-led case links with comparison data", () => {
    render(<CasesPage />);

    expect(screen.getByRole("heading", { name: /비슷한 건물은\s*어떻게 선택했을까요/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /경기 화성 48.6킬로와트 사례 자세히 보기/ })).toHaveAttribute("href", "/cases/hwaseong-factory-48kw");
    expect(screen.getByText("59,000kWh")).toBeInTheDocument();
    expect(screen.getByText("영업시간 전력비 절감")).toBeInTheDocument();
  });

  it("keeps every public case slug unique and resolvable", () => {
    const slugs = installationCases.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(getInstallationCase(slug)?.slug).toBe(slug);
    expect(getInstallationCase("missing-case")).toBeUndefined();
  });
});
