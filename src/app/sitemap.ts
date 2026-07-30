import type { MetadataRoute } from "next";
import { absoluteUrl, PUBLIC_ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/pro" ? 0.9 : 0.7,
    alternates: {
      languages: {
        ko: absoluteUrl(path),
        "x-default": absoluteUrl(path),
      },
    },
  }));
}
