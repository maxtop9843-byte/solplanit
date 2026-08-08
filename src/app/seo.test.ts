import robots from "./robots";
import sitemap from "./sitemap";
import { absoluteUrl, PUBLIC_ROUTES, SITE_URL } from "../lib/site";

describe("SEO foundation", () => {
  it("builds canonical absolute URLs without duplicate slashes", () => {
    expect(absoluteUrl("/pro")).toBe(`${SITE_URL}/pro`);
    expect(absoluteUrl()).toBe(`${SITE_URL}/`);
  });

  it("publishes every approved public route once with Korean alternates", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(PUBLIC_ROUTES.length);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(PUBLIC_ROUTES.length);

    for (const route of PUBLIC_ROUTES) {
      const entry = entries.find((item) => item.url === absoluteUrl(route));
      expect(entry).toBeDefined();
      expect(entry?.alternates?.languages?.ko).toBe(absoluteUrl(route));
      expect(entry?.alternates?.languages?.["x-default"]).toBe(absoluteUrl(route));
    }
  });

  it("keeps private and write-oriented routes out of search while exposing the sitemap", () => {
    const policy = robots();
    const rules = Array.isArray(policy.rules) ? policy.rules : [policy.rules];

    expect(policy.host).toBe(SITE_URL);
    expect(policy.sitemap).toBe(absoluteUrl("/sitemap.xml"));
    expect(rules[0]?.allow).toBe("/");
    expect(rules[0]?.disallow).toEqual(
      expect.arrayContaining(["/api/", "/account"]),
    );
  });
});
