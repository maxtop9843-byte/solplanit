import { describe, expect, it } from "vitest";
import { getSearchVerificationConfig } from "./searchVerification";

describe("getSearchVerificationConfig", () => {
  it("keeps verification metadata empty when tokens are absent", () => {
    expect(getSearchVerificationConfig({})).toEqual({
      google: undefined,
      naver: undefined,
      configured: false,
    });
  });

  it("trims configured verification tokens", () => {
    expect(
      getSearchVerificationConfig({
        NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: " google-token ",
        NEXT_PUBLIC_NAVER_SITE_VERIFICATION: " naver-token ",
      }),
    ).toEqual({
      google: "google-token",
      naver: "naver-token",
      configured: true,
    });
  });

  it("ignores whitespace-only values", () => {
    expect(
      getSearchVerificationConfig({
        NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "   ",
        NEXT_PUBLIC_NAVER_SITE_VERIFICATION: "\n",
      }).configured,
    ).toBe(false);
  });
});
