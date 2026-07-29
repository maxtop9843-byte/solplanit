# QA-001 General-user journey audit

## Scope

The audit covers the complete Korean general-user flow from homepage discovery through building type, area, location, goal, capacity result, user-entered economics assumptions, result interpretation, and return-to-edit actions.

## Automated journey coverage

`src/app/GuidedCalculator.journey.test.tsx` verifies:

- the four-step progression and progress copy;
- missing-area and missing-goal error messages;
- area input persistence when navigating backward;
- the provider-neutral location step;
- final input review before calculation;
- installable-capacity calculation entry and result state;
- self-consumption savings assumption inputs;
- generation/economics result state and assumption disclosure;
- return-to-edit and recalculate actions.

## Desktop and mobile review

The production deployment for main commit `c44f11871c26fd48b47701482561044e5862b7bf` is `READY` and serves the canonical `solplanit.vercel.app` domain. Vercel's authenticated fetch returned HTTP 200 and confirmed the calculator is discoverable from the hero, navigation, installation cases, and bottom CTA.

The responsive implementation was inspected for the 390 px mobile breakpoint and desktop layout rules. Form controls retain native labels, result cards collapse to a single column, long result values are overflow-safe, and reduced-motion users receive immediate values instead of staged animation.

A headless Chromium attempt was made for both 1440×1000 desktop and 390×844 mobile viewports. The runtime blocked direct navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; this is an external browser-policy limitation rather than an application response. Vercel deployment state, HTTP rendering, component source, responsive CSS, and automated interaction tests are therefore the recorded evidence for this run.

## Findings

- No calculation or navigation blocker was found in the implemented general-user flow.
- User-entered market and tariff assumptions remain explicit and are not replaced with guessed current values.
- The community, quote, and professional destinations are intentionally incomplete and remain covered by `QUOTE-001`, `COMMUNITY-001`, and `PRO-001`; they are not treated as completed QA scope.
- `/robots.txt` and `/sitemap.xml` remain part of `SEO-001` and `OPS-001` follow-up.

## Exit criteria

QA-001 can move to `DONE` after the exact-head GitHub checks pass and the same branch receives a healthy Vercel Preview, or after the documented external-preview exception in `AUTOMATION.md` is satisfied.
