---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Searchable local database with 84 styles, 192 color palettes, 74 font pairings, 192 product types, 98 UX guidelines, 104 icon entries, 16 GSAP motion presets, and 25 chart types across 22 stacks (React, Next.js, Vue, Nuxt, Svelte, Astro, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, Jetpack Compose, Angular, Laravel, JavaFX, WPF, WinUI, Avalonia, Uno Platform, UWP, Three.js, and HTML/CSS). Use when designing, building, or reviewing UI: pages, components, color schemes, typography, layout, accessibility, animation, or data visualization."
---

# UI/UX Pro Max - Design Intelligence

Searchable database of UI/UX design rules with priority-based recommendations: 84 styles, 192 color palettes, 74 font pairings, 192 product types with reasoning rules, 98 UX guidelines, 104 icon entries, 16 GSAP motion presets, and 25 chart types across 22 technology stacks.

## When to Apply

Use this Skill when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**: designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency, implementing navigation/animation/responsive behavior, or improving perceived quality and usability.

Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts — unless the task changes how something **looks, feels, moves, or is interacted with**.

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks | Anti-Patterns |
|---|---|---|---|---|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, alt text, keyboard nav, aria-labels | Removing focus rings, unlabeled icon-only buttons |
| 2 | Touch & Interaction | CRITICAL | Min 44×44px, 8px+ spacing, loading feedback | Hover-only interactions, no state feedback |
| 3 | Performance | HIGH | Image optimization, lazy loading, CLS < 0.1 | Layout thrashing, layout shift |
| 4 | Style Selection | HIGH | Match product type, consistency, SVG icons | Mixed visual languages, emoji as icons |
| 5 | Layout & Responsive | HIGH | Mobile-first, predictable breakpoints, no horizontal scroll | Fixed-width layouts, disabled zoom |
| 6 | Typography & Color | MEDIUM | 16px base, 1.5+ line height, semantic tokens | Tiny body text, gray-on-gray |
| 7 | Animation | MEDIUM | 150–300ms, motion conveys meaning, reduced-motion | Decorative-only motion, width/height animation |
| 8 | Forms & Feedback | MEDIUM | Visible labels, errors near fields, helper text, progressive disclosure | Placeholder-only labels, overwhelming forms |
| 9 | Navigation | HIGH | Predictable back, deep links, restrained nav | Overloaded nav, broken state |
| 10 | Charts & Data | LOW | Legends, tooltips, accessible colors | Color-only meaning |

## SolPlanit local mode

This repository vendors the core skill instructions, not the full upstream searchable dataset. For SolPlanit work:

1. Treat `DESIGN.md` as the product-specific source of truth.
2. Apply this skill before any user-visible UI change.
3. Prioritize accessibility, form usability, responsive behavior, and progressive disclosure before decorative styling.
4. Because SolPlanit is Next.js, use Next.js/React implementation best practices.
5. If full upstream search data is available in the execution environment, use it. If it is not available, do not fabricate database results; use the priority rules in this file.
6. For new pages, explicitly define product type, target user, task, information hierarchy, mobile behavior, states, and anti-patterns before implementation.
7. Before delivery, verify keyboard/focus, 375px mobile, 768px tablet, 1024px/1440px desktop, loading/error/empty/result states, and reduced motion.

## SolPlanit form rules

- Ask only for information the target user can reasonably know.
- Move technical parameters behind `상세 설정` unless they are essential to the primary task.
- Every visible input must affect the result.
- Use persistent labels and concise helper text.
- Validate after interaction, not aggressively on every keystroke.
- Put errors next to the field and provide a recovery path.
- Make the primary result answer the page title directly.
- Distinguish `0`, `계산 불가`, and `정보 없음`.
- Keep one primary action per step.

## SolPlanit copy/UI integration

Whenever Korean user-facing copy changes, run the repository Korean skills after the UI/UX pass:
- `.agents/skills/korean-skills/grammar-checker/SKILL.md`
- `.agents/skills/korean-skills/style-guide/SKILL.md`
- `.agents/skills/korean-skills/humanizer/SKILL.md`

## Upstream

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Pinned upstream commit when vendored: `abb7f2fd5a083fa1ff55c326a963ff0d95c33f99`
- License: MIT
- Original project supports a full searchable dataset and CLI. This local copy intentionally keeps the core skill rules needed for repository-native agent use while avoiding runtime dependence on a globally installed plugin.
