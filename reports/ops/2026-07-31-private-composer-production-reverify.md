# OPS-001 private composer Production re-verification

## Purpose

Retrigger the normal GitHub-to-Vercel deployment pipeline from the current `main` after PR #45 so the private community composer crawler policy can be verified on the canonical Production domain.

## Baseline

- Source `main` SHA: `62541bde3c027e92fcfc19d37b3bd8ff623fef27`
- Required changed route: `/community/new`
- Expected crawler policy: `noindex, nofollow` for both generic robots and Googlebot
- Current observed Production before this retry: deployment `dpl_HCzVSHbJZ2dnthE2jYaD9gH9enci`, SHA `9b26470eac008bd41870fdbea298b7e0f63d4a05`
- Exact-head Preview already observed READY: deployment `dpl_5gyQfx7jPVHc7FiqBqYPiSF9rNme`, SHA `9dc6b2cb41f5b0cfb1d6c719588b2295691db39e`

## Verification contract

After squash merge, verify all of the following against the matching merge SHA:

1. Production deployment exists and is `READY`.
2. `https://solplanit.com/community/new` returns HTTP 200.
3. The route exposes `noindex, nofollow` for generic robots and Googlebot.
4. The route keeps its calculation-attachment empty state and next action intact.
5. Canonical homepage, sitemap, robots, and 404 remain healthy.
6. No new Production runtime errors are present in the verification window.

This file changes no application behavior. It records the exact recovery scope and deliberately retriggers the normal Git-integrated deployment path after the direct Vercel deployment connector again rejected the call because its exposed and runtime schemas differ.
