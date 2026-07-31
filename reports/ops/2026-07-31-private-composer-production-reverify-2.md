# OPS-001 private composer Production re-verification

- Date: 2026-07-31
- Base main SHA: `529975b3705bb77df786d54e0895f4dc587bd834`
- Verification target: `https://solplanit.com/community/new`
- Expected crawler policy: general robots and Googlebot must both be `noindex, nofollow`
- Expected canonical: `https://solplanit.com/community`

## Context

The exact-head Preview for the private composer change is `READY`, and GitHub CI previously passed. The matching main Production deployment was not created because Vercel returned `build-rate-limit`, while the currently served Production still points to an older SHA.

This operational-only commit intentionally changes no application code. It retriggers the normal GitHub-to-Vercel integration so the already-merged crawler-safety change can receive a matching Production deployment.

## Required post-merge checks

1. Confirm the exact merge SHA has a Vercel Production deployment.
2. Confirm the deployment reaches `READY`.
3. Open `/community/new` on the canonical domain.
4. Confirm HTTP 200, canonical `/community`, and `noindex, nofollow` for both robots and Googlebot.
5. Confirm the empty-attachment state and calculator next action remain usable.
6. Keep `OPS-001` and `LAUNCH-001` in `POST_MERGE_VERIFY` if the matching Production deployment is unavailable or any required smoke check remains incomplete.
