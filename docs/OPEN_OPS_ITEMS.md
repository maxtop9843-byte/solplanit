# Open operational items

Extracted from `TASK_QUEUE.md` before it was archived on 2026-08-08. Both items were still
incomplete at that point and remain open independently of the redesign.

The rest of the old task queue is archived at `docs/archive/TASK_QUEUE.md` and is no longer valid.

## OPS-001 — POST_MERGE_VERIFY

Connect Vercel project, Preview/Production checks, environment validation, and deployment smoke tests.

- Depends on: FND-001 (done)
- Vercel project `solplanit` is connected under the `CalCome` team as project `prj_KPdpTkUuK1oRboXbMYW7T3q1fVC7`.
- Keep OPS-001 in `POST_MERGE_VERIFY` until canonical-domain route, sitemap, robots, 404, and
  server-error smoke checks are fully recorded.

## LAUNCH-001 — POST_MERGE_VERIFY

Final pre-launch regression: public routes, calculators, PVGIS flow, downloads, community, SEO,
policies, analytics consent, ads disabled-by-default, and production smoke.

- Depends on: QA-001, QA-002, SEO-006, CONTENT-002, ADS-003 (all done)
- LAUNCH-001 adds an automated launch-readiness contract for canonical origin, public-route
  completeness and uniqueness, approved search/guide/trust coverage, fail-closed advertising, and
  fail-empty search verification. Final completion remains in `POST_MERGE_VERIFY` until the matching
  Production SHA is `READY` and canonical route, sitemap, robots, 404, server-error, calculator,
  PVGIS, download, community, policy, and ads-disabled smoke checks are recorded.

## Redesign impact

The new direction removes advertising entirely, so the ads-related portions of the LAUNCH-001
contract (`fail-closed advertising`, `ads-disabled` smoke check) will need to be rewritten rather
than verified as-is. Route, sitemap, robots, 404, server-error, calculator, and PVGIS checks are
unaffected.

Related deployment records: `docs/PRODUCTION_RECOVERY.md`,
`docs/PRODUCTION_REVERIFY_2026-07-31.md`, `reports/ops/`.
