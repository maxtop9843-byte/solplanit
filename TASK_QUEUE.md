# SolPlanit Task Queue

## Rules

- Work on exactly one eligible `OPEN` task per run.
- Do not start a second task in the same run.
- Existing open branches and pull requests take priority over new work.
- `DESIGN.md`, `PRODUCT_SPEC.md`, `CONTENT.md`, and `AUTOMATION.md` are binding.
- Functional correctness, calculation accuracy, security, and unusable UX outrank feature order.
- Every feature must be tested through the real user journey on desktop and mobile.
- A task is complete only after tests, build, Preview verification, and merge criteria pass.

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
| FND-001 | P0 | OPEN | Initialize Next.js, TypeScript, linting, testing, and CI foundation | — |
| UI-001 | P0 | OPEN | Implement image-led homepage hero with approved copy and black CTA | FND-001 |
| UX-001 | P0 | OPEN | Implement the four-step general-user guided calculator shell | UI-001 |
| CALC-001 | P0 | OPEN | Implement installable-capacity estimation with explicit assumptions | UX-001 |
| CALC-002 | P0 | OPEN | Implement generation, savings, and revenue calculation engine | CALC-001 |
| UI-002 | P0 | OPEN | Implement emphasized result cards and result motion | CALC-002 |
| QUOTE-001 | P1 | OPEN | Create calculation-backed quote request flow | UI-002 |
| PRO-001 | P1 | OPEN | Build professional project workspace shell at `/pro` | FND-001 |
| PRO-002 | P1 | OPEN | Integrate PVGIS-based production analysis | PRO-001 |
| COMMUNITY-001 | P1 | OPEN | Build community categories and structured post model | QUOTE-001 |
| COMMUNITY-002 | P1 | OPEN | Attach calculation result data to questions and quote posts | COMMUNITY-001 |
| CASE-001 | P1 | OPEN | Build image-led installation case gallery | UI-001 |
| ACCOUNT-001 | P2 | OPEN | Add shared identity and saved calculations/projects | QUOTE-001, PRO-001 |
| QA-001 | P0 | OPEN | End-to-end desktop and mobile audit of general-user journey | CALC-002 |
| SEO-001 | P2 | OPEN | Add metadata, sitemap, robots, and structured data foundation | UI-001 |
| CONTENT-001 | P2 | OPEN | Add trustworthy methodology and calculation assumption pages | CALC-002 |
| ADS-001 | P3 | OPEN | Prepare non-intrusive advertising zones after core UX stabilizes | SEO-001, CONTENT-001 |

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
