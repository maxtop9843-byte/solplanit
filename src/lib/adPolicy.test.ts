import { describe, expect, it } from "vitest";
import { getAdPolicyConfig } from "./adPolicy";

describe("getAdPolicyConfig", () => {
  it("keeps advertising disabled without a client id", () => {
    expect(getAdPolicyConfig({})).toMatchObject({
      advertisingConfigured: false,
      state: "missing-client",
    });
  });

  it("fails closed until the policy-readiness review is explicitly confirmed", () => {
    expect(
      getAdPolicyConfig({ NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-test" }),
    ).toMatchObject({
      advertisingConfigured: false,
      state: "policy-review-required",
    });
  });

  it("enables the consent flow only after exact policy approval", () => {
    expect(
      getAdPolicyConfig({
        NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-test",
        NEXT_PUBLIC_ADSENSE_POLICY_APPROVED: "confirmed",
      }),
    ).toMatchObject({
      advertisingConfigured: true,
      clientId: "ca-pub-test",
      policyApproved: true,
      state: "ready",
    });
  });

  it("does not accept truthy-looking approval values", () => {
    expect(
      getAdPolicyConfig({
        NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-test",
        NEXT_PUBLIC_ADSENSE_POLICY_APPROVED: "true",
      }).advertisingConfigured,
    ).toBe(false);
  });
});
