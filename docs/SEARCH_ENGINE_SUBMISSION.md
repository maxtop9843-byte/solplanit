# Search engine verification and submission

Canonical domain: `https://solplanit.com`

This checklist separates deployable code from account-level actions that require the site owner's Google and Naver accounts.

## 1. Configure ownership tokens

Add only the token value from each service to the Production environment, then redeploy:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`

Expected HTML after deployment:

- `<meta name="google-site-verification" content="…">`
- `<meta name="naver-site-verification" content="…">`

Blank or whitespace-only values intentionally emit no verification tag.

## 2. Verify the canonical domain

Before submission, confirm all of the following on Production:

1. `https://solplanit.com/` returns 200.
2. `https://www.solplanit.com/` redirects to the canonical host or emits the same canonical URL.
3. Page canonical URLs, sitemap URLs, structured-data IDs, and Open Graph URLs use `https://solplanit.com`.
4. `https://solplanit.com/robots.txt` returns text and references the canonical sitemap.
5. `https://solplanit.com/sitemap.xml` returns XML and contains only public canonical routes.
6. Preview deployments remain excluded from indexing.

## 3. Submit

### Google Search Console

1. Add the domain property for `solplanit.com` and complete DNS ownership verification when possible.
2. Keep the HTML meta token as a secondary verification method if needed.
3. Submit `https://solplanit.com/sitemap.xml`.
4. Inspect `/`, `/pro`, `/guides`, and one `/solar/…` route.
5. Request indexing only after the canonical Production deployment is current and healthy.

### Naver Search Advisor

1. Register `https://solplanit.com`.
2. Verify ownership using the emitted Naver meta token.
3. Submit `https://solplanit.com/robots.txt` and `https://solplanit.com/sitemap.xml`.
4. Run the URL inspection tools for the same representative routes.

## 4. Indexing diagnostics

When a page is not indexed, record:

- inspected URL and inspection date
- HTTP status and final redirected URL
- rendered canonical and selected canonical
- robots meta and robots.txt decision
- sitemap presence and last crawl date
- duplicate, soft-404, server-error, or discovered-but-not-indexed reason
- exact Production deployment SHA

Do not repeatedly request indexing while Production serves an older SHA, a blocked route, or conflicting canonical host.
