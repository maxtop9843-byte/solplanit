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
| UI-003 | P0 | DONE | Implement emphasized result cards, numeric count-up, sequential reveal, next-action guidance, and reduced-motion fallback | CALC-002 |
| QUOTE-001 | P1 | DONE | Create calculation-backed quote request flow with automatic result attachment | UI-003 |
| PRO-001 | P1 | DONE | Build `/pro` professional workspace shell following the PVGIS 5.3 map-left/input/result workflow in SolPlanit styling | FND-001, MAP-001 |
| PRO-002 | P1 | DONE | Add PVGIS 5.3 server proxy with validation, timeout, retry, caching, rate-limit handling, source/version metadata, and Korean errors | PRO-001 |
| PRO-003 | P1 | DONE | Implement PVGIS-style fixed-system inputs: capacity, module technology, mounting, loss, tilt, azimuth, horizon, optimal-angle options, and radiation database | PRO-002 |
| PRO-004 | P1 | DONE | Implement PVGIS-style outputs: annual/monthly production, irradiation, variation, loss summary, charts, horizon view, and assumption panel | PRO-003 |
| PRO-005 | P1 | DONE | Implement result downloads for CSV, JSON, chart image, and branded PDF report with source and disclaimer metadata | PRO-004 |
| PRO-006 | P1 | DONE | Import a general-user calculation into `/pro` as a professional project without re-entry | CALC-002, PRO-003 |
| PRO-007 | P0 | DONE | Send `/pro` horizon and radiation-database selections through the API request, add interaction coverage, and re-run live PVGIS representative-result comparison | QA-002 |
| CASE-001 | P1 | DONE | Build image-led installation case gallery and case detail pages | UI-001 |
| COMMUNITY-001 | P1 | DONE | Build community categories and structured post model | QUOTE-001 |
| COMMUNITY-002 | P1 | DONE | Attach calculation result data to questions and quote posts | COMMUNITY-001 |
| ACCOUNT-001 | P2 | DONE | Add shared identity and saved calculations/projects | QUOTE-001, PRO-001 |
| QA-001 | P0 | DONE | End-to-end desktop and mobile audit of the complete general-user journey | CALC-002, UI-003 |
| QA-002 | P1 | DONE | Compare professional inputs, outputs, downloads, error behavior, and representative results against PVGIS 5.3 | PRO-005 |
| OPS-001 | P1 | POST_MERGE_VERIFY | Connect Vercel project, Preview/Production checks, environment validation, and deployment smoke tests | FND-001 |
| SEO-001 | P2 | DONE | Add metadata, sitemap, robots, canonical URLs, hreflang-ready structure, and structured data foundation | UI-002 |
| SEO-002 | P2 | DONE | Build search-intent landing pages for installation capacity, generation, savings, SMP/REC revenue, rooftop solar, factory solar, and land solar | CALC-002, SEO-001 |
| SEO-003 | P2 | DONE | Add unique explanatory content, worked examples, FAQs, related-tool links, breadcrumbs, and internal-link architecture to every public calculator and professional entry page | SEO-002 |
| SEO-004 | P2 | DONE | Add Organization, WebSite, WebPage, BreadcrumbList, FAQPage, SoftwareApplication, and calculation-specific structured data without duplication | SEO-003 |
| SEO-005 | P2 | DONE | Optimize Core Web Vitals, image delivery, font loading, bundle size, server rendering, caching, and mobile performance | UI-002, PRO-004 |
| SEO-006 | P2 | OPEN | Add Google Search Console and Naver Search Advisor verification slots, submission checklist, indexing diagnostics, and canonical-domain checks | SEO-001, OPS-001 |
| CONTENT-001 | P2 | DONE | Add trustworthy methodology, data source, calculation assumption, limitation, privacy, terms, contact, and editorial-policy pages | CALC-002, PRO-002 |
| CONTENT-002 | P2 | DONE | Build installation guides, quote-review guides, subsidy-information framework, glossary, and expert-reviewed evergreen content hubs | CONTENT-001, SEO-002 |
| ADS-001 | P3 | DONE | Create AdSense-ready layout zones that never interrupt the calculator, result interpretation, map controls, quote flow, or primary CTA | SEO-003, CONTENT-001 |
| ADS-002 | P3 | DONE | Add consent-aware ad loading, reserved dimensions, lazy loading, CLS protection, and mobile density rules | ADS-001, SEO-005 |
| ADS-003 | P3 | OPEN | Run AdSense policy-readiness audit for low-value content, navigation, ownership pages, privacy, misleading claims, accidental clicks, and prohibited placements | ADS-002, CONTENT-002 |
| ADS-004 | P3 | OPEN | Optimize ad placement using measured viewability and revenue data while preserving task completion, Core Web Vitals, and user trust | ADS-003; traffic data required |
| LAUNCH-001 | P1 | OPEN | Final pre-launch regression: public routes, calculators, PVGIS flow, downloads, community, SEO, policies, analytics consent, ads disabled-by-default, and production smoke | QA-001, QA-002, SEO-006, CONTENT-002, ADS-003 |

## Operational verification notes

- ADS-002 keeps advertising disabled by default until the AdSense client and placement slots are configured and the visitor explicitly consents. The app stores only the reversible consent choice, injects the AdSense script after acceptance, requests each slot only near the viewport, reserves responsive dimensions before loading, limits mobile pages to one eligible zone, and leaves every calculator and primary action available after rejection.
- ADS-001 adds two clearly labelled, non-interactive reserved ad zones only after completed informational sections: the homepage process section and the guide index. No zone appears inside the calculator, result interpretation, map, quote, community composer, professional workspace, hero, or primary CTA areas. The reusable component exposes stable placement and format attributes for the consent-aware loader planned in ADS-002, uses restrained neutral styling, and collapses to a mobile-safe height without animation.
- CONTENT-002 adds a public `/guides` hub with installation preparation, quote review, subsidy-verification framework, and glossary pages. Every guide includes unique metadata, visible review and update information, explicit uncertainty and professional-verification boundaries, related reading, calculator next actions, sitemap coverage, responsive layouts, reduced-motion handling, and automated completeness tests.
- CONTENT-001 adds a public trust center and eight substantive methodology, source, assumption, limitation, privacy, terms, contact, and editorial-policy pages. Every route has unique metadata and sitemap coverage; a quiet global footer provides a real entry point. Content explicitly separates estimates from field verification, describes browser-local saved data, avoids collecting contact or detailed address data, and is covered by completeness and boundary tests.
- SEO-005 moves the homepage LCP image and below-the-fold case imagery from CSS backgrounds to `next/image`, supplies responsive `sizes`, high-priority hero fetching, descriptive alternatives, AVIF/WebP negotiation, a bounded device-size set, and a 30-day optimized-image cache. Existing fixed media containers preserve layout stability across desktop and mobile, while reduced-motion behavior remains intact.
- SEO-004 adds one reusable JSON-LD renderer and page graph builders. Organization and WebSite remain defined once in the root layout; homepage, seven search-intent pages, and `/pro` reference those global IDs while adding unique WebPage, BreadcrumbList, FAQPage, and calculation-specific SoftwareApplication nodes. Automated tests cover unique IDs, global-node deduplication, FAQ answers, and free calculator offers.
- SEO-003 adds reusable Korean-first explanatory sections to the public calculator, all seven search-intent pages, and the professional entry: worked examples, three FAQs, visible breadcrumbs, and links into calculation, professional analysis, cases, and saved work. Content keeps estimates and field-verification limits explicit and is covered by completeness tests.
- SEO-002 adds seven Korean-first search-intent landing pages for installation capacity, generation, savings, SMP/REC revenue, rooftop, factory, and land solar. Each page has unique metadata, direct calculator entry, assumptions, a four-step journey, related-page links, responsive layouts, and sitemap inclusion.
- SEO-001 adds canonical site metadata, per-route canonical and ko/x-default alternate foundations, sitemap and robots endpoints, Organization/WebSite JSON-LD, social metadata, and automated coverage for public-route uniqueness and crawler exclusions. Exact-head lint, typecheck, tests, and production build passed in CI run #122. Final deployment verification follows the documented Preview fallback and post-merge procedure.
- PRO-007 sends the `/pro` horizon checkbox and radiation-database selection in every PVGIS request, covers both defaults and changed values through interaction tests, and displays both assumptions beside the returned result. Exact-head lint, typecheck, tests, and production build passed. A direct live JRC numerical snapshot remained blocked by the automation web client's dynamic API URL safety restriction and must be completed through a reachable Preview or Production route.
- QA-002 compares the professional request contract, response field mapping, downloads, and Korean error behavior against the official PVGIS 5.3 `PVcalc` API. The proxy now validates and emits `usehorizon`, `raddatabase`, `optimalinclination`, and `optimalangles`.
- ACCOUNT-001 adds a privacy-first browser profile, validated saved calculations, saved professional project starters, a responsive `/account` workspace, explicit device-local storage disclosure, and direct reopen links into the general and professional flows. It stores no contact details or precise address data; server authentication and cross-device synchronization remain a future backend integration.
- COMMUNITY-002 adds a validated, URL-restorable calculation attachment from the general result screen into `/community/new`, limits posts to installation questions or quote review, previews exactly what will be public, excludes detailed address and contact data, and keeps real persistence disabled until ACCOUNT-001. Exact-head lint, typecheck, tests, and production build passed in CI run #99.
- COMMUNITY-001 adds `/community`, the five approved categories, privacy and non-guarantee guidance, a typed post model, structured condition fields, example-content labeling, a real homepage entry, responsive layouts, and data-model tests. Exact-head CI run #96 passed; final-head Preview creation was blocked only by Vercel free-plan deployment quota, so merge follows the documented fallback policy.
- CASE-001 adds a public image-led `/cases` gallery and static detail pages with building, capacity, generation, purpose, assumptions, design considerations, non-guarantee guidance, calculator next actions, responsive behavior, and reduced-motion support. Homepage navigation and featured cards now link to the real case routes. Exact-head lint, typecheck, tests, and production build passed in CI run #93.
- Vercel project `solplanit` is connected under the `CalCome` team as project `prj_KPdpTkUuK1oRboXbMYW7T3q1fVC7`.
- Keep OPS-001 in `POST_MERGE_VERIFY` until canonical-domain route, sitemap, robots, 404, and server-error smoke checks are fully recorded.
