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
5. SEO
6. AdSense and monetization readiness

## Queue

| ID | Priority | Status | Task | Depends on |
|---|---:|---|---|---|
| FND-001 | P0 | IN_PROGRESS | Initialize Next.js, TypeScript, linting, testing, CI, environment schema, and provider-neutral map interfaces | — |
| UI-001 | P0 | OPEN | Reproduce the approved image-led homepage hero with final copy, black CTA, restrained navigation, large real solar image, and responsive motion | FND-001 |
| UI-002 | P0 | OPEN | Complete the homepage below the fold: calculator entry, result preview, process, installation cases, community entry, and bottom CTA | UI-001 |
| UX-001 | P0 | OPEN | Implement the four-step general-user guided calculator shell with one dominant question per step | UI-002 |
| MAP-001 | P0 | OPEN | Implement MapLibre map selection with center marker, click-to-select coordinates, direct latitude/longitude inputs, and provider adapter boundary | FND-001 |
| MAP-002 | P1 | BLOCKED | Add address-search and reverse-geocoding slots for Kakao or Naver without provider-specific UI coupling | MAP-001; API keys later |
| CALC-001 | P0 | OPEN | Implement installable-capacity estimation by building type and area with explicit assumptions, panel count, units, boundaries, and tests | UX-001 |
| CALC-002 | P0 | OPEN | Implement generation, self-consumption savings, SMP/REC revenue, and payback calculation engine with assumptions and consistency tests | CALC-001 |
| UI-003 | P0 | OPEN | Implement emphasized result cards, numeric count-up, sequential reveal, next-action guidance, and reduced-motion fallback | CALC-002 |
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
| SEO-001 | P2 | OPEN | Add metadata, sitemap, robots, canonical URLs, and structured data foundation | UI-002 |
| CONTENT-001 | P2 | OPEN | Add trustworthy methodology, data source, calculation assumption, limitation, and privacy pages | CALC-002, PRO-002 |
| OPS-001 | P1 | OPEN | Connect Vercel project, Preview/Production checks, environment validation, and deployment smoke tests | FND-001 |
| ADS-001 | P3 | OPEN | Prepare non-intrusive advertising zones only after core UX and content quality stabilize | SEO-001, CONTENT-001 |

## Acceptance highlights

### UI-001

- First viewport contains only logo/navigation, supporting line, main headline, description, one black CTA, one secondary text link, one large solar-building image, and at most one result chip.
- Approved copy is reproduced exactly.
- No calculator grid, dashboard, community feed, or statistics crowd the first viewport.
- Desktop and mobile remain visually faithful to the approved mockup.

### MAP-001

- Default provider is MapLibre and requires no Kakao/Naver key.
- Clicking or moving the map updates latitude and longitude through one normalized location model.
- Map provider and geocoder are injected through interfaces, not imported directly into business logic.
- Missing address provider never blocks coordinate-based PVGIS analysis.

### PRO-002 to PRO-005

- PVGIS calls run server-side, never directly from the browser.
- Input validation and units match documented PVGIS semantics.
- Results include source, API version, query time, assumptions, and limitations.
- Downloaded files reproduce the same values shown on screen.
- EU/JRC identity is not copied and no official affiliation is implied.

## Definition of done

A task may be marked `DONE` only when:

- Acceptance criteria are implemented.
- Relevant tests pass.
- Production build passes.
- Desktop and mobile primary journeys were checked.
- Accessibility basics were checked.
- No duplicate branch or PR exists.
- Preview deployment was inspected when available.
- Documentation and queue status were updated.
