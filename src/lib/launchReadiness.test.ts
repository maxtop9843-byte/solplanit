import { describe, expect, it } from "vitest";
import { getAdPolicyConfig } from "./adPolicy";
import { GUIDE_ROUTES, guidePages } from "./guideContent";
import { notFoundMetadata } from "./notFoundMetadata";
import { privateActionMetadata } from "./privateRouteMetadata";
import { getSearchVerificationConfig } from "./searchVerification";
import { PUBLIC_ROUTES, SEARCH_INTENT_ROUTES, SITE_URL } from "./site";
import { TRUST_ROUTES, trustPages } from "./trustContent";

const requiredLaunchRoutes = [
  "/",
  "/pro",
  "/cases",
  "/community",
  "/guides",
  "/trust",
] as const;

describe("LAUNCH-001 readiness contract", () => {
  it("uses the canonical production domain", () => {
    expect(SITE_URL).toBe("https://solplanit.com");
  });

  it("keeps every public launch route unique and crawler-safe", () => {
    expect(new Set(PUBLIC_ROUTES).size).toBe(PUBLIC_ROUTES.length);
    for (const route of requiredLaunchRoutes) expect(PUBLIC_ROUTES).toContain(route);
    for (const route of PUBLIC_ROUTES) {
      expect(route.startsWith("/")).toBe(true);
      expect(route.startsWith("/api/")).toBe(false);
      expect(route).not.toContain("?");
    }
  });

  it("includes every approved search, guide, and trust route", () => {
    for (const route of SEARCH_INTENT_ROUTES) expect(PUBLIC_ROUTES).toContain(route);
    for (const route of GUIDE_ROUTES) expect(PUBLIC_ROUTES).toContain(route);
    for (const route of TRUST_ROUTES) expect(PUBLIC_ROUTES).toContain(route);
    expect(guidePages).toHaveLength(4);
    expect(trustPages).toHaveLength(8);
  });

  it("keeps not-found responses out of search indexes", () => {
    expect(notFoundMetadata.robots).toMatchObject({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
  });

  it("keeps private action routes out of search indexes", () => {
    expect(privateActionMetadata.robots).toMatchObject({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
  });

  it("keeps advertising disabled until policy review and a client id are both configured", () => {
    expect(getAdPolicyConfig({}).advertisingConfigured).toBe(false);
    expect(
      getAdPolicyConfig({ NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-test" })
        .advertisingConfigured,
    ).toBe(false);
  });

  it("emits no search ownership metadata when verification tokens are absent", () => {
    expect(getSearchVerificationConfig({})).toEqual({
      google: undefined,
      naver: undefined,
      configured: false,
    });
  });
});
