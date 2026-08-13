import { describe, expect, it } from "vitest";
import { metadata as layoutMetadata } from "./layout";
import { metadata as pageMetadata } from "./page";

describe("/pro search-first metadata", () => {
  it("uses the general-user precision generation calculator name", () => {
    expect(layoutMetadata.title).toBe("정밀 태양광 발전량 계산기");
    expect(pageMetadata.title).toBe("정밀 태양광 발전량 계산기");
  });

  it("does not expose legacy expert or workspace positioning", () => {
    const copy = JSON.stringify({ layoutMetadata, pageMetadata });

    expect(copy).not.toContain("전문가용");
    expect(copy).not.toContain("프로젝트 워크스페이스");
    expect(copy).toContain("PVGIS 5.3");
    expect(copy).toContain("/pro");
  });
});
