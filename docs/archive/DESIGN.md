# SolPlanit Design System

## 1. Design objective

SolPlanit must feel like a premium solar-installation decision service, not a crowded calculator directory and not a generic green SaaS template.

The first viewport should communicate one idea immediately:

> SolPlanit makes the full solar-installation journey easier.

Visual formula:

- Apple-style information restraint and whitespace
- Awesomic-style image-led storytelling
- Linear-style precise state transitions
- Wise-style beginner-friendly guided calculation flow

This file is the highest-priority design reference for every UI addition or change.

## 2. First-screen rule

The first viewport contains only:

- Logo and restrained navigation
- Supporting line
- Main headline
- Short description
- One black primary CTA
- One text-link secondary action
- One large real-world solar installation image
- At most one small floating result chip

Do not place calculation forms, result grids, statistics, community feeds, professional dashboards, or multiple promotional cards in the first viewport.

### Approved hero copy

**Supporting line**

> 복잡한 태양광 설치, 더 쉽게

**Headline**

> 태양광 설치,  
> 처음부터 끝까지 한 번에

**Description**

> 주소와 설치 면적만 입력하면 설치 가능한 용량과 예상 수익을 확인하고, 내 조건에 맞는 견적까지 받아볼 수 있어요.

**Primary CTA**

> 무료로 확인하기

**Secondary link**

> 실제 설치 사례 보기 →

## 3. Color system

The interface is predominantly monochrome.

- Canvas: `#FFFFFF`
- Secondary surface: `#F6F7F5`
- Primary text: `#111411`
- Secondary text: `#6F746F`
- Border: `#E4E7E3`
- Primary CTA: `#111111`
- Primary CTA text: `#FFFFFF`
- Functional green: `#16823B`
- Soft green surface: `#EDF7EF`
- Optional sunlight tint: `#FFF8DE`

### Color rules

- Black is the main CTA color.
- Green is reserved for selected states, progress, verified values, charts, and important calculated results.
- Yellow may be used only as a soft result emphasis, never as a dominant page color.
- Do not use multiple decorative accent colors in one viewport.
- Do not create green gradients for generic decoration.

## 4. Typography

Use Korean-first typography.

Recommended:

- `Pretendard Variable`
- fallback: `SUIT Variable`, `Inter`, `system-ui`, sans-serif

Desktop scale:

- Hero headline: 64–72px, weight 650–700, line-height 1.05
- Section headline: 44–52px, weight 650–700
- Card headline: 24–32px, weight 600–700
- Body large: 18–20px, line-height 1.55
- Body: 16px, line-height 1.6
- Caption: 13–14px

Mobile scale:

- Hero headline: 40–48px
- Section headline: 32–38px
- Card headline: 22–26px

Avoid oversized Korean typography that causes awkward line breaks. Headlines should feel carved and deliberate, not inflated.

## 5. Layout and shapes

- Page max width: 1200–1280px
- Hero max width: 1440px
- Section spacing: 96–144px desktop, 64–88px mobile
- Content cards: 20–28px radius
- Inputs: 12–16px radius
- Buttons: full pill or 14–16px radius
- Result cards: 20–24px radius

Use whitespace and subtle surface shifts before shadows.

Shadows:

- Default cards: no shadow or extremely subtle shadow
- Floating result chip: soft shadow allowed
- Do not stack multiple heavy shadows

## 6. Image direction

Images are a core part of the brand.

Use:

- Real houses, commercial buildings, factories, warehouses, and land with solar installations
- Clear daylight and believable Korean architectural context where available
- Wide, calm compositions with room for text
- Large image bands that separate sections
- Image-led installation case cards

Avoid:

- Generic eco stock imagery with hands holding a globe
- Cartoon sun, spinning clouds, or mascot-style panels
- Over-saturated green filters
- Dense text overlays on photography
- Unrealistic futuristic solar cities for ordinary user flows

## 7. Hero composition

Recommended desktop composition:

- Left: text and actions
- Right or full-width lower band: large solar-building image
- Optional floating chip:
  - label: `이 건물의 예상 설치 용량`
  - value: `약 23.4kW`

The chip must remain subordinate to the image and headline.

## 8. Guided calculator

The calculator begins after the hero CTA or the first scroll.

Primary question:

> 우리 건물에는 태양광을 얼마나 설치할 수 있을까?

Steps:

1. 건물 정보
2. 설치 결과
3. 수익·절감 확인
4. 견적받기

Rules:

- One dominant question per step
- Advanced inputs hidden behind optional expansion
- Previous answers summarized compactly
- The next action must be visually obvious
- Forms should not resemble a spreadsheet
- Use plain Korean before technical terminology

## 9. Result cards

Results must be more visually prominent than input cards.

Recommended hierarchy:

1. Recommended installation capacity
2. Annual expected generation
3. Monthly or annual savings/revenue
4. Estimated payback period
5. Estimated panel count

Emphasis methods:

- Larger numeric typography
- One soft green primary result card
- Subtle border contrast
- Sequential entrance motion
- Clear unit labels

Do not rely on color alone. Numbers, labels, spacing, and card hierarchy must remain understandable in grayscale.

## 10. Motion system

Motion guides the journey. It is never decorative wallpaper.

### Entry

- Hero headline: opacity 0→1, translateY 12px→0
- Description and CTA: 80ms stagger
- Hero image: subtle scale 1.02→1
- Optional result chip appears after approximately 700–1000ms

### CTA transition

On `무료로 확인하기`:

- Smooth-scroll to calculator
- Calculator scale 0.98→1 and fade in
- Focus the first meaningful field

### Step transition

- Duration: 180–240ms
- Opacity and 8px vertical motion
- No bounce
- Progress line fills toward the next step

### Calculation result

- Numeric count-up: 600–900ms
- Result card stagger: 60ms
- Primary result card may briefly scale 1.01→1
- Final CTA activates after results settle

### Hover and press

- Hover: translateY(-1px), 140ms
- Press: scale(0.985), 80–100ms

### Scroll reveal

- Opacity and translateY 12px
- Duration: 300–400ms
- Run once

### Accessibility

Respect `prefers-reduced-motion`. Replace animated movement with immediate or short opacity transitions.

## 11. Navigation

General navigation:

- 설치 알아보기
- 설치 사례
- 질문·견적
- 전문가 찾기

Professional entry:

- 전문가용

Keep the navigation visually quiet. The hero CTA remains the dominant action.

## 12. Pro workspace

The `/pro` area may be denser but must share the same visual language.

- White or very light canvas
- Hairline borders
- Compact controls
- Monochrome charts with restrained green highlights
- Clear project summary
- No decorative dashboard clutter

The professional area is a precision workspace, while `/home` is a guided decision journey.

## 13. Prohibited patterns

- Generic green gradient hero
- More than one filled CTA in a viewport
- Multiple competing result cards with equal visual weight
- Excessive badges
- Glassmorphism as a default surface
- Floating cards everywhere
- Continuous decorative animation
- Large icon grids on the first screen
- Dense text over hero photography
- SaaS-template purple/blue gradients
- First-screen dashboard previews that obscure the service promise
