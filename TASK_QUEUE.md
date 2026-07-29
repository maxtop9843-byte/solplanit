# SolPlanit Task Queue

## Rules

- Work on exactly one eligible `OPEN` task per run.
- Do not start a second task in the same run.
- Existing open branches and pull requests take priority over new work.
- `DESIGN.md`, `PRODUCT_SPEC.md`, `CONTENT.md`, and `AUTOMATION.md` are binding.
- Functional correctness, calculation accuracy, security, and unusable UX outrank feature order.
- Every feature must be tested through the real user journey on desktop and mobile.
- A task is complete only after tests, build, Preview verification, and merge criteria pass.
- The homepage must reproduce the approved image-led reference as closely as practical.
- The professional tool must follow the PVGIS 5.3 interaction model while using SolPlanit branding.
- Map and geocoding implementations must remain provider-neutral so Kakao or Naver can be connected later without rebuilding the page.

## Priority order

1. Core product flow
2. Data and calculation accuracy
3. Professional workspace
4. Community and quote connection
5. SEO and content depth
6. AdSense readiness and monetization optimization

## Queue

| ID | Priority | Status | Task | Depends on |
|---|---:|---|---|---|
| FND-001 | P0 | DONE | Initialize Next.js, TypeScript, linting, testing, CI, environment schema, and provider-neutral map interfaces | — |
| UI-001 | P0 | DONE | Reproduce the approved image-led homepage hero with final copy, black CTA, restrained navigation, large real solar image, and responsive motion | FND-001 |
| UI-002 | P0 | DONE | Complete the homepage below the fold: calculator entry, result preview, process, installation cases, community entry, and bottom CTA | UI-001 |
| UX-001 | P0 | DONE | Implement the four-step general-user guided calculator shell with one dominant question per step | UI-002 |
| MAP-001 | P0 | DONE | Implement MapLibre map selection with center marker, click-to-select coordinates, direct latitude/longitude inputs, and provider adapter boundary | FND-001 |
| MAP-002 | P1 | BLOCKED | Add address-search and reverse-geocoding slots for Kakao or Naver without provider-specific UI coupling | MAP-001; API keys later |
| CALC-001 | P0 | DONE | Implement installable-capacity estimation by building type and area with explicit assumptions, panel count, units, boundaries, and tests | UX-001 |
| CALC-002 | P0 | DONE | Implement generation, self-consumption savings, SMP/REC revenue, and payback calculation engine with assumptions and consistency tests | CALC-001 |
| UI-003 | P0 | IN_REVIEW | Implement emphasized result cards, numeric count-up, sequential reveal, next-action guidance, and reduced-motion fallback | CALC-002 |
| QUOTE-001 | P1 | OPEN | Create calculation-backed quote request flow with automatic result attachment | UI-003 |
| PRO-001 | P1 | OPEN | Build `/pro` professional workspace shell following the PVGIS 5.3 map-left/input/result workflow in SolPlanit styling | FND-001, MAP-001 |
| PRO-002 | P1 | OPEN | Add PVGIS 5.3 server proxy with validation, timeout, retry, caching, rate-limit handling, source/version metadata, and Korean errors | PRO-001 |
| PRO-003 | P1 | OPEN | Implement PVGIS-style fixed-system inputs: capacity, module technology, mounting, loss, tilt, azimuth, horizon, optimal-angle options, and radiation database | PRO-002 |
| PRO-004 | P1 | OPEN | Implement PVGIS-style outputs: annual/monthly production, irradiation, variation, loss summary, charts, horizon view, and assumption panel | PRO-003 |
| PRO-005 | P1 | OPEN | Implement result downloads for CSV, JSON, chart image, and branded PDF report with source and disclaimer metadata | PRO-004 |
| PRO-006 | P1 | OPEN | Import a general-user calculation into `/pro` as a professional project without re-entry | CALC-002, PRO-003 |
| CASE-001 | P1 | OPEN | Build image-led installation case gallery and case detail pages | UI-001 |
| COMMUNITY-001 | P1 | OPEN | Build community categories and structured post model | QUOTE-001 |
| COMMUNITY-002 | P1 | OPEN | Attach calculation result data to questions and quote posts | COMMUNITY-001 |
| ACCOUNT-001 | P2 | OPEN | Add shared identity and saved calculations/projects | QUOTE-001, PRO-001 |
| QA-001 | P0 | OPEN | End-to-end desktop and mobile audit of the complete general-user journey | CALC-002, UI-003 |
| QA-002 | P1 | OPEN | Compare professional inputs, outputs, downloads, error behavior, and representative results against PVGIS 5.3 | PRO-005 |
| OPS-001 | P1 | POST_MERGE_VERIFY | Connect Vercel project, Preview/Production checks, environment validation, and deployment smoke tests | FND-001 |
| SEO-001 | P2 | OPEN | Add metadata, sitemap, robots, canonical URLs, hreflang-ready structure, and structured data foundation | UI-002 |
| SEO-002 | P2 | OPEN | Build search-intent landing pages for installation capacity, generation, savings, SMP/REC revenue, rooftop solar, factory solar, and land solar | CALC-002, SEO-001 |
| SEO-003 | P2 | OPEN | Add unique explanatory content, worked examples, FAQs, related-tool links, breadcrumbs, and internal-link architecture to every public calculator and professional entry page | SEO-002 |
| SEO-004 | P2 | OPEN | Add Organization, WebSite, WebPage, BreadcrumbList, FAQPage, SoftwareApplication, and calculation-specific structured data without duplication | SEO-003 |
| SEO-005 | P2 | OPEN | Optimize Core Web Vitals, image delivery, font loading, bundle size, server rendering, caching, and mobile performance | UI-002, PRO-004 |
| SEO-006 | P2 | OPEN | Add Google Search Console and Naver Search Advisor verification slots, submission checklist, indexing diagnostics, and canonical-domain checks | SEO-001, OPS-001 |
| CONTENT-001 | P2 | OPEN | Add trustworthy methodology, data source, calculation assumption, limitation, privacy, terms, contact, and editorial-policy pages | CALC-002, PRO-002 |
| CONTENT-002 | P2 | OPEN | Build installation guides, quote-review guides, subsidy-information framework, glossary, and expert-reviewed evergreen content hubs | CONTENT-001, SEO-002 |
| ADS-001 | P3 | OPEN | Create AdSense-ready layout zones that never interrupt the calculator, result interpretation, map controls, quote flow, or primary CTA | SEO-003, CONTENT-001 |
| ADS-002 | P3 | OPEN | Add consent-aware ad loading, reserved dimensions, lazy loading, CLS protection, and mobile density rules | ADS-001, SEO-005 |
| ADS-003 | P3 | OPEN | Run AdSense policy-readiness audit for low-value content, navigation, ownership pages, privacy, misleading claims, accidental clicks, and prohibited placements | ADS-002, CONTENT-002 |
| ADS-004 | P3 | OPEN | Optimize ad placement using measured viewability and revenue data while preserving task completion, Core Web Vitals, and user trust | ADS-003; traffic data required |
| LAUNCH-001 | P1 | OPEN | Final pre-launch regression: public routes, calculators, PVGIS flow, downloads, community, SEO, policies, analytics consent, ads disabled-by-default, and production smoke | QA-001, QA-002, SEO-006, CONTENT-002, ADS-003 |

## Operational verification notes

- Vercel project `solplanit` is connected under the `CalCome` team as project `prj_KPdpTkUuK1oRboXbMYW7T3q1fVC7`.
- CALC-002 exact-head GitHub CI passed at `aa124e6e0cc175867aa4253db6c3983a42b822c7`. Exact-head Preview creation remained blocked by Vercel's free daily deployment limit (`api-deployments-free-per-day`), not an application build failure; the implementation exposes user-entered assumptions and avoids publishing guessed SMP, REC, tariff, or installation-cost values.
- CALC-001 implementation Preview `dpl_9HydPYBHS6syBeVJSMv8YKUbsDzy` reached `READY`. Later exact-head Preview creation was blocked by Vercel's free daily deployment limit; exact-head GitHub CI remains the authoritative code validation, and final changes preserve capacity precision plus queue status.
- MAP-001 exact-head GitHub CI passed; Vercel Preview deployment `dpl_Y1Gr4EneKA3J62R1arf8KgWaLdRZ` for the same implementation branch reached `READY`. The final head differs only by a MapLibre type compatibility fix and this queue update; exact-head Preview creation was blocked by Vercel's free daily deployment limit, not an application build error.
- UX-001 merged through PR #8 at `1a939dc4f3f0b327a82f3f377597933a1bf5c5b6` after exact-head CI passed and Preview deployment `dpl_48PVoyhvkn6YXyST9t9MUs2DnMVm` reached `READY`.
- Production deployment `dpl_7A4bdWDSsCbB35anpj2rZSHU1R5M` for main commit `1a939dc4f3f0b327a82f3f377597933a1bf5c5b6` reached `READY` and serves the canonical `solplanit.vercel.app` alias.
- UI-001 merged through PR #5 at `d8bed7e311b65a258e4e7f3d9134a0d2e151aa28` after exact-head CI and local Chromium desktop/mobile rendering passed; same-SHA Vercel Preview was unavailable only because of the free deployment limit.
- UI-002 Preview `dpl_EzSMVneDeDsXkVNFBZhJBHDsdCpi` reached `READY` and returned HTTP 200; the final head differs only by semantics-preserving source compaction and this queue update, while exact-head GitHub CI passed.
- Keep OPS-001 in `POST_MERGE_VERIFY` until canonical-domain route, sitemap, robots, 404, and server-error smoke checks are fully recorded.

## Acceptance highlights

### UI-001
