# TASK_QUEUE.md — SolPlanit

## Product mode

SolPlanit is now a **low-maintenance solar calculator site**.

Primary growth loop:

**Search → calculator → result → related calculator → repeat visit**

Do not reopen marketplace/community/SaaS scope unless real traffic data justifies it.

---

## Priority rules

1. Calculation accuracy and broken UX
2. Search-intent calculators
3. Internal linking and SEO
4. Trust/data-source pages
5. AdSense and monetization after traffic exists

Do not prioritize account systems, community, expert matching, quote collection, CRM, project management, or lead sales.

---

## Current queue

### P0 — Product simplification

- [OPEN] **SIMPLE-001** Reframe home flow from “platform journey” to “calculator collection” without changing the approved Renewal V2 visual language.
  - Keep the current hero and calculator-first layout.
  - Replace product-flow language that implies a large platform.
  - Make related calculators discoverable.

- [OPEN] **SIMPLE-002** Reframe `/pro` as a standalone **PVGIS precise generation calculator**.
  - No expert workspace positioning.
  - Inputs: location, capacity, slope, azimuth, losses.
  - Outputs: monthly/annual generation, assumptions, source/version.
  - Distinguish loading/error/no-data/zero.

### P1 — Core calculator expansion

- [OPEN] **CALC-001** Solar generation calculator
  - Input system capacity and user-confirmed assumptions.
  - Show daily/monthly/annual generation where methodologically valid.

- [OPEN] **CALC-002** Electricity bill savings calculator
  - Separate self-consumption assumptions from power-sale assumptions.
  - Do not invent electricity tariff values.

- [OPEN] **CALC-003** SMP + REC revenue calculator
  - User inputs current SMP/REC values unless a reliable official feed is implemented.
  - Show formula and weighting assumptions.

- [OPEN] **CALC-004** Payback-period calculator
  - Installation cost, annual benefit, maintenance/other user inputs.
  - Avoid presenting payback as guaranteed investment return.

- [OPEN] **CALC-005** Panel count and required-area calculator
  - Panel wattage, dimensions/area assumptions, spacing factor.
  - Link both directions with installation-capacity calculator.

- [OPEN] **CALC-006** Slope/azimuth comparison calculator
  - Prefer actual PVGIS-backed comparison when feasible.
  - Do not fabricate loss percentages.

- [OPEN] **CALC-007** Inverter capacity / DC-AC ratio calculator
  - Explain that manufacturer and design constraints still require review.

- [OPEN] **CALC-008** Monthly generation comparison calculator
  - Prefer PVGIS monthly data.
  - Clear source/version and location assumptions.

### P2 — SEO and navigation

- [OPEN] **SEO-001** Add calculator index and reusable related-calculator links.
- [OPEN] **SEO-002** Give each calculator unique metadata, canonical, structured data, and sitemap entry.
- [OPEN] **SEO-003** Build short supporting guides only where they answer a real calculator interpretation question.
- [OPEN] **SEO-004** Review Search Console after enough impressions accumulate and reorder calculator backlog by actual queries.

### P3 — Monetization

- [BLOCKED] **ADS-001** Add non-intrusive ads only after meaningful organic traffic exists.
  - Never place ads between inputs and primary result.
  - Avoid layout shift around calculator controls/results.

---

## Deferred indefinitely

These are intentionally **not in the active roadmap**:

- community
- installer/expert marketplace
- quote request forms
- lead generation/sales
- user accounts
- project management SaaS
- CRM
- installer dashboards
- case-upload ecosystem
- real-time consultation

A deferred feature may return only when measurable traffic/user behavior creates a strong reason for it.

---

## Definition of done for each calculator

- Search intent is clear from title/H1.
- Inputs materially affect the calculation.
- Important assumptions are explicit.
- No invented market values.
- Main result is immediately understandable.
- Formula/source/limitations are accessible.
- 2–4 relevant calculator links are present.
- Mobile 375px has no horizontal overflow.
- lint, typecheck, test, build pass.
