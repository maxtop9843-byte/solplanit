# SolPlanit Design System

This document replaces every earlier design note in this repository. Where it
disagrees with an older file, comment, or component, this document wins.

## 1. What the design is for

A homeowner putting a multi-thousand-dollar system on their own roof is not
asking "is this pretty". They are asking **"can I trust these people?"**

Every decision below answers that question. Restraint over spectacle. Evidence
over adjectives. The work speaks through real photographs of real
installations and through numbers whose assumptions are published.

## 2. Tokens

All tokens are declared in `src/app/globals.css` under `:root`. **Nothing
downstream may contain a literal hex, rgba, or magic pixel value.** If a
component needs a value that does not exist, add a token — do not inline it.

### Colour

| Token | Value | Use |
|---|---|---|
| `--parchment` | `#fdfdf7` | Page background. Never pure white across a large area. |
| `--sand` | `#f5f2de` | Card and panel surfaces. |
| `--sand-deep` | `#ece7cf` | Pressed / alternate surface. |
| `--paper` | `#ffffff` | Small surfaces only — input fills, toggles. |
| `--ink` | `#000000` | Primary text. |
| `--ink-60` | `#666666` | Secondary text. |
| `--ink-45` | `#8f8f88` | Tertiary text, disclaimers. |
| `--sky` | `#0096f7` | **The only accent.** |
| `--night` | `#0a0e14` | Inverse surfaces: closing block, footer, hero base. |

Semantic aliases (`--surface-page`, `--text-secondary`, `--accent`, …) sit on
top of these primitives. Components reference the semantic layer.

**Sky Blue is reserved for action.** Primary buttons, focus rings, the
selected state of a control, and the calculator progress bar. It is never used
to decorate, to tint a background, or to draw attention to something that is
not clickable. There is no second accent — no green, no amber.

### Type

Three families, loaded through `next/font` and self-hosted:

- `--font-sans` — Noto Sans KR. Display, headings, body, UI.
- `--font-serif` — Noto Serif KR. Reserved for the process and trust
  narratives. Nowhere else.
- `--font-num` — Inter. Numerals only, with real tabular figures so capacity
  and money columns align.

**Hierarchy comes from size and space, never from weight.** Weights stop at
500. Display type is 200. A headline that needs to shout should get bigger and
be given more room around it — it does not get bolder.

Tracking follows optical size. `--tracking-display` is `-0.047em`, which is
the specified −4.5px at 96px.

`word-break: keep-all` is set on `body` and is not optional. Without it the
browser breaks Hangul mid-eojeol and every headline reads as a typo.

### Space, radius, elevation

- Space scale: `--space-3xs` (4px) → `--space-4xl` (120px).
- Section rhythm: `--section-space`, which clamps between 96px and 120px.
- Radius: `--radius-control` 12px (buttons, inputs, cards),
  `--radius-feature` 18px (panels), `--radius-pill` 24px (the hero
  navigation). One radius per role — sections do not each invent their own.
- Elevation: `--shadow-hairline` is `0 0.5px 2px rgba(0,0,0,0.12)`. That is
  the ceiling for most surfaces. `--shadow-raised` adds one very soft ambient
  layer. There is no third step, and nothing glows.

## 3. Layout

Each section of the homepage has its own layout grammar. Repeating a
"heading + three cards" block down the page is the single fastest way to make
a site look generated, so the page never does it:

1. **Hero** — full-bleed media, copy anchored bottom-left.
2. **Trust figures** — typographic strip. Hairline rules, no cards.
3. **Cases** — full-bleed photography running to the screen edges, metadata
   set beneath the frame.
4. **Process** — editorial two-column: sticky serif column, long numbered
   reading column.
5. **Economics** — a working instrument. Reading column plus live calculator.
6. **Voices** — asymmetric editorial spread.
7. **Closing** — inverse surface, left-aligned, flowing into the footer.

## 4. The hero

The sky-to-array transition **completes inside one viewport** and is already
composed at rest. A visitor who never scrolls still sees the whole idea.

- Sky layer: the generated video (`/media/hero-sky.mp4`), blurred so it reads
  as the out-of-focus plane.
- Array layer: a real photograph, filling the lower diagonal.
- The two are joined by a single angled gradient mask, not a clip-path — the
  clip gives the diagonal but leaves a hard edge.
- `HeroStage` exposes `--hero-progress` (0→1) for parallax. Under
  `prefers-reduced-motion` the scroll listener never attaches.

## 5. Motion

Motion exists to explain state, never to announce arrival.

- Permitted: hover and focus transitions, the calculator's progress bar, a
  restrained scroll reveal, hero parallax.
- Not permitted: every element fading up from below on scroll; springy
  overshoot; anything that moves without communicating something.
- `prefers-reduced-motion: reduce` is honoured globally in `globals.css` and
  specifically in `HeroStage`.

## 6. Imagery

| Where | Rule |
|---|---|
| Hero array, case studies, before/after, customer portraits, crews on site | **Real photographs only.** No generated imagery, ever. |
| Diagrams, calculation visualisations, abstract explanatory graphics | Generated or illustrated content is fine. |

The reason is practical: a homeowner judges workmanship from panel alignment,
cable runs and mounting hardware. Generated images get those details subtly
wrong, and the moment a visitor notices, the trust is gone.

Atmosphere is not workmanship. The hero's sky is generated; the roof beneath
it is not.

If a required photograph does not exist, leave an explicit placeholder with
its aspect ratio and art direction recorded, and report it. Do not fill the
gap with stock.

## 7. Copy

- Everyday Korean before industry vocabulary.
- Say what the reader gets, not what the system does.
- Never imply guaranteed savings, revenue, payback, or installation approval.
- Make uncertainty visible without making it frightening. Every calculated
  figure ships with its assumptions and limits.

## 8. Anti-patterns

None of these may appear:

- Purple-to-blue gradient heroes, glassmorphism cards, unmotivated blur or glow.
- Every section built as "heading + three cards".
- Feature grids of circular icon badges with two lines of text under each.
- Uniform fade-up-on-scroll applied to everything.
- Stock illustration, hand-drawn icon sets, decorative 3D blobs.
- Different radii or shadow strengths invented per section.
- Large areas of pure white.
- Bold weight used to create hierarchy.
