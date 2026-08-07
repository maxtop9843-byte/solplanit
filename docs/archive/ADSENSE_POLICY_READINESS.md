# AdSense policy-readiness audit

Reviewed: 2026-07-30

This audit records product and implementation checks for AdSense readiness. It is an engineering control, not a guarantee of approval or legal advice. Google policies can change, so the checklist must be re-run immediately before enabling ads.

## Official references

- Google Publisher Policies: https://support.google.com/adsense/answer/10008391
- AdSense Program policies: https://support.google.com/adsense/answer/48182
- Ad placement policies: https://support.google.com/adsense/answer/1346295
- Ad placement best practices: https://support.google.com/adsense/answer/1282097
- Privacy and messaging: https://support.google.com/adsense/topic/13821018

## Audit result

| Area | Result | Evidence and control |
|---|---|---|
| Substantive publisher content | PASS | The calculator journey, professional workspace, cases, methodology pages, and four reviewed guides provide original utility beyond advertising. Ads are not shown on empty, error-only, or private-communication screens. |
| Navigation and ownership | PASS | Global navigation and footer expose calculators, cases, guides, community, methodology, privacy, terms, contact, and editorial policy. |
| Misleading claims | PASS | Public copy presents capacity, generation, savings, revenue, and payback as estimates and states field-verification limits. Guaranteed profit or approval language is prohibited by `CONTENT.md`. |
| Accidental-click risk | PASS | Ad zones appear only after completed informational sections, contain no buttons or links, use a visible `광고` label, reserve dimensions, and are excluded from forms, results, maps, downloads, quote actions, and primary CTAs. |
| Ad density | PASS | Only two eligible placements exist, and mobile logic allows one eligible zone per page. Publisher content remains dominant. |
| Consent and privacy | CONDITIONAL | Advertising remains fail-closed. A client ID alone cannot activate consent UI, scripts, or requests. Production must satisfy the current regional consent/CMP requirements and privacy disclosure review before setting `NEXT_PUBLIC_ADSENSE_POLICY_APPROVED=confirmed`. |
| User-generated content | PASS WITH MONITORING | No ad placement exists on community list, composer, or post surfaces. Keep ads disabled on community routes until moderation and restricted-content controls are operational. |
| Production verification | REQUIRED | Before approval, verify the canonical domain, privacy/terms/contact pages, ad labels and spacing on desktop/mobile, consent withdrawal, no ad requests after rejection, and no console or layout errors. |

## Enablement checklist

Do not set `NEXT_PUBLIC_ADSENSE_POLICY_APPROVED=confirmed` until all items are true:

1. AdSense publisher identity, ownership, and payment profile are accurate.
2. The canonical domain serves the current privacy, terms, contact, methodology, limitation, and editorial-policy pages.
3. The applicable Google-certified CMP or Google Privacy & Messaging flow is configured for regions where Google requires it.
4. Consent withdrawal works and rejection produces no AdSense script or ad request.
5. Only `home-after-process` and `guides-after-list` slots are configured.
6. Desktop and mobile checks confirm clear separation from navigation, calculator controls, result actions, downloads, and quote CTAs.
7. AdSense Policy Center shows no unresolved enforcement.
8. A reviewer records the review date and exact production deployment SHA.

## Fail-closed implementation

`src/lib/adPolicy.ts` requires both a non-empty `NEXT_PUBLIC_ADSENSE_CLIENT` and the exact approval value `confirmed`. Any missing or approximate value keeps advertising disabled, hides consent controls, withholds the AdSense script, and preserves every core feature.
