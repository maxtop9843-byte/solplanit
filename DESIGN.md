# DESIGN.md — SolPlanit

> 도구가 주인공이고, 페이지에서 가장 큰 글자는 헤드라인이 아니라 계산 결과 숫자다.

이 문서는 기존 DESIGN.md를 **완전히 대체**한다. 이전 문서의 어떤 값도 참조하지 않는다.

---

## 0. 전제

이 사이트는 시공사도 중개 플랫폼도 아니다. **주택·소규모 태양광 의사결정 데이터를 무료로 제공하는 개인 운영 정보 사이트**다.

이 전제에서 나오는 세 가지 제약이 모든 디자인 결정을 지배한다.

1. **보여줄 실제 시공 사진이 없다.** → 사진을 쓰지 않는 디자인이어야 한다. 스톡 사진과 AI 생성 이미지는 신뢰를 깎으므로 금지.
2. **팔지 않는다.** → 견적 유도 CTA, 광고, 연락처 수집이 없다. 이게 이 사이트의 차별점이므로 디자인이 이를 드러내야 한다.
3. **계정도 저장도 없다.** → 입력은 브라우저에서만 처리된다. 로그인 UI, 알림 신청, "저장하기"가 존재하지 않는다.

**북극성:** 숫자를 믿게 만드는 것. 아름답게 보이게 하는 것이 아니다.

---

## 1. 원칙

### Do

- 한 화면에 한 가지 일만 시킨다. 홈은 **도구 블록 하나 + 근거 블록 하나**로 끝난다.
- 위계는 **굵기가 아니라 크기**로 만든다.
- 층은 **흰색 톤 차이와 0.5px 헤어라인**으로만 만든다.
- 색이 있는 자리는 페이지 전체에서 **단 한 곳**이다.
- 모든 수치 옆에는 출처나 갱신 시점이 따라붙는다.
- 여백은 장식이 아니라 정보다. 섹션 사이를 아끼지 않는다.

### Don't

- **초록·노랑 계열을 쓰지 않는다.** 태양광 사이트의 클리셰이며 차별화를 0으로 만든다.
- **그림자를 쓰지 않는다.** `box-shadow`는 이 시스템에 존재하지 않는다.
- **font-weight 500 이상을 쓰지 않는다.** 볼드가 등장하는 순간 속삭임 체계가 무너진다.
- **사진·일러스트·아이콘 일러스트를 쓰지 않는다.** 기능적 SVG 아이콘만 허용.
- **히어로 영상, 패럴랙스, 스크롤 스토리텔링을 쓰지 않는다.** 도구는 즉시 쓸 수 있어야 한다.
- **숫자 카운트업 애니메이션을 쓰지 않는다.** 있지도 않은 정밀함을 연출하는 것이라 이 사이트의 취지에 반한다.
- **이모지를 아이콘으로 쓰지 않는다.**

---

## 2. 색

무채색 5개 + 결과 강조 3개. **총 8개가 전부이며 이 목록 밖의 색은 추가하지 않는다.**

### 무채색

| 토큰 | 값 | 역할 |
|---|---|---|
| `--canvas` | `#F2F2F4` | 페이지 배경. 순백이 아닌 미세하게 찬 오프화이트 |
| `--surface` | `#FDFDFD` | 카드, 입력 필드. 캔버스보다 밝아서 그림자 없이 떠 보인다 |
| `--ink` | `#0F1012` | 본문·제목 텍스트, 버튼 배경 |
| `--ink-muted` | `#5E5E5E` | 보조 텍스트, 캡션, 라벨 |
| `--hairline` | `#D8D8DC` | 모든 경계선. 두께는 항상 0.5px |

`--ink-muted`보다 연한 회색은 **만들지 않는다.** 흔히 쓰는 `#77777C`는 캔버스 위에서 3.98:1로 WCAG AA에 미달한다. 보조 텍스트는 `#5E5E5E` 하나로 통일한다.

### 결과 강조

| 토큰 | 값 | 역할 |
|---|---|---|
| `--result-fill` | `#E4EDF7` | 계산 결과 면. **페이지당 정확히 1회** |
| `--result-ink` | `#123A5E` | 결과 면 위 주 텍스트 |
| `--result-ink-muted` | `#3A5F80` | 결과 면 위 보조 텍스트 |

이 파랑은 태양광 패널 자체의 짙은 남색에서 나왔다. 친환경 이미지 연출이 아니라 소재의 색이다.

**중요:** 파란색은 **면(fill)으로만** 쓴다. 텍스트 색이나 테두리 색으로 쓰지 않는다. 파스텔은 채도가 낮아 흰 배경 위 테두리로 쓰면 1.77:1로 UI 최소 기준 3:1에 미달한다.

### 링크

링크에 색을 쓰지 않는다. `--ink` 색에 hover 시 밑줄, 또는 뒤에 화살표(→)를 붙여 어포던스를 만든다. 색을 하나 아낄수록 결과 면이 강해진다.

### 실측 대비

| 조합 | 대비 | 판정 |
|---|---|---|
| `--ink` on `--canvas` | 17.03:1 | AAA |
| `--ink-muted` on `--canvas` | 5.80:1 | AA |
| `--result-ink` on `--result-fill` | 9.91:1 | AAA |
| `--result-ink-muted` on `--result-fill` | 5.68:1 | AA |
| `--surface` on `--ink` (버튼) | 18.71:1 | AAA |

---

## 3. 타이포그래피

### 폰트

| 토큰 | 값 | 역할 |
|---|---|---|
| `--font-kr` | `'Pretendard Variable'` | 한글·영문·UI 전체 |
| `--font-num` | `'Geist Mono'` | **숫자 전용** |

```css
--font-kr: 'Pretendard Variable', Pretendard, -apple-system,
           BlinkMacSystemFont, system-ui, sans-serif;
--font-num: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;
```

Pretendard를 쓰는 이유는 **가변 폰트라 350 같은 중간 웨이트를 실제로 지정할 수 있기 때문**이다. 대부분의 한글 폰트는 100 단위 고정이라 이 시스템이 성립하지 않는다.

**금지:** Noto Sans KR(라이트 웨이트가 Windows에서 깨짐), 나눔 계열, 한글 명조·세리프 디스플레이(큰 크기에서 획 대비가 심해 무거워진다).

### 한글 보정 — 가장 중요한 절

라틴 기준 타이포 값을 한글에 그대로 쓰면 좋은 폰트를 써도 망가진다. 원인은 세 가지다.

1. **한글은 같은 em 안에 획이 훨씬 많아 같은 웨이트에서 더 굵고 어둡게 보인다.**
2. **한글은 이미 정사각 모듈이라 음수 자간을 주면 글자끼리 달라붙는다.**
3. **받침 때문에 글자 높이가 커서 라틴보다 넓은 행간이 필요하다.**

따라서 다음 규칙을 적용한다. **제목은 얇게, 본문은 오히려 한 단계 올린다.** 라틴 감각과 반대지만 한글에서는 이게 맞다.

| 역할 | 크기 | 웨이트 | 행간 | 자간 |
|---|---|---|---|---|
| display | 32px | 300 | 1.30 | -0.01em |
| heading | 24px | 350 | 1.35 | -0.008em |
| subhead | 19px | 350 | 1.45 | -0.005em |
| body | 16px | 400 | 1.70 | -0.005em |
| caption | 13px | 450 | 1.60 | 0 |

숫자에만 별도 규칙을 적용한다. 숫자는 한글 글리프가 없으므로 라틴 값을 그대로 써도 된다.

| 역할 | 크기 | 웨이트 | 자간 |
|---|---|---|---|
| number-result | 48px | 400 | -0.02em |
| number-row | 20px | 400 | -0.02em |

**페이지에서 가장 큰 글자는 `number-result`다.** display(32px)보다 크다. 이 역전이 이 디자인의 시그니처다.

### 필수 전역 규칙

```css
html {
  word-break: keep-all;        /* 없으면 단어 중간에서 줄바꿈 — 즉시 망가짐 */
  overflow-wrap: break-word;   /* 긴 URL 등 예외 처리 */
  -webkit-font-smoothing: antialiased;
}

.num {
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
}
```

`tabular-nums`는 선택이 아니다. 계산 결과가 바뀔 때 자릿수가 흔들리지 않는 것만으로 도구의 신뢰감이 크게 달라진다.

### 본문 폭

한글 본문의 `max-width`는 **640px**을 넘지 않는다. 한 줄에 35~45자가 읽기 좋은 범위다.

---

## 4. 간격과 형태

기준 단위 4px.

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128
```

| 용도 | 값 |
|---|---|
| 콘텐츠 최대 폭 | 1120px |
| 도구·본문 폭 | 640px |
| 섹션 간격 (데스크톱) | 96px |
| 섹션 간격 (모바일) | 56px |
| 카드 안쪽 여백 | 32px (모바일 24px) |
| 요소 간격 | 8px |

### 라운드

| 토큰 | 값 | 적용 |
|---|---|---|
| `--radius-input` | 12px | 입력 필드, 셀렉트 |
| `--radius-card` | 16px | 모든 카드, 결과 면 |
| `--radius-pill` | 9999px | 버튼, 태그 |

이 셋 외의 라운드 값은 쓰지 않는다.

### 층과 경계

그림자가 없으므로 층은 두 가지 수단으로만 만든다.

1. **톤 차이** — `--surface`(#FDFDFD)를 `--canvas`(#F2F2F4) 위에 올린다
2. **헤어라인** — `0.5px solid var(--hairline)`

```css
.card {
  background: var(--surface);
  border: 0.5px solid var(--hairline);
  border-radius: var(--radius-card);
  box-shadow: none;  /* 이 시스템에 그림자는 없다 */
}
```

---

## 5. 그리드

12컬럼, gutter 24px, 최대 폭 1120px 중앙 정렬.

브레이크포인트: `375 / 768 / 1024 / 1440`

도구 블록은 그리드와 무관하게 **640px 중앙 고정**이다. 전체 폭으로 늘리지 않는다.

---

## 6. 컴포넌트 규칙

코드는 명세하지 않는다. 아래 규칙만 지키면 구현 방식은 자유다.

### 입력 필드

- 배경 `--surface`, 테두리 0.5px `--hairline`, 라운드 12px
- **라벨은 항상 노출한다.** placeholder만으로 라벨을 대신하지 않는다
- 높이 최소 48px (터치 타깃)
- 포커스: `outline: 2px solid var(--ink); outline-offset: 2px`
- 검증은 blur 시점에 실행한다. 타이핑 중에는 하지 않는다
- 오류 메시지는 해당 필드 바로 아래에 둔다

### 버튼

- 주 동작: 배경 `--ink`, 글자 `--surface`, 라운드 pill, 높이 48px
- 보조 동작: 배경 투명, 테두리 0.5px `--ink`, 글자 `--ink`, 같은 pill 형태
- 페이지당 주 동작 버튼은 **하나**
- 라벨은 결과를 말한다. "제출"이 아니라 "계산하기"

### 결과 행 (중간값)

레이블 좌측 정렬 `--ink-muted` caption, 값 우측 정렬 `.num` number-row `--ink`. 배경 없음, 행 사이 0.5px 헤어라인.

### 결과 면 (최종값)

- 배경 `--result-fill`, 라운드 16px, 테두리 없음, 그림자 없음
- 안쪽 여백 32px
- 레이블: caption, `--result-ink-muted`
- 값: `.num` number-result(48px), `--result-ink`
- **페이지 전체에서 이 컴포넌트는 하나만 존재한다**

### 출처 표기

모든 수치 블록 하단에 caption 크기로 붙인다.

```
PVGIS 5.3 · 2026-08-07 기준 · 계산 방법 보기 →
```

### 중립성 배너

푸터 위에 카드 하나. 배경 `--surface`, 본문 크기, 좌측 정렬.

> 솔플래닛은 시공사가 아닙니다.
> 어떤 업체로부터도 수수료나 광고비를 받지 않습니다.
> 계산 결과를 팔지 않고, 연락처도 받지 않습니다.

---

## 7. 홈 화면 구조

블록 두 개로 끝난다. 이보다 늘리지 않는다.

```
┌─ 상단바 ─────────────────────────────────────┐
│ SolPlanit                 방법론   이 사이트 │   투명 배경, 헤어라인 없음
└──────────────────────────────────────────────┘
                     96px

┌─ 블록 1 · 도구 ──────────────────── 640px ───┐
│                                              │
│  우리 집에 태양광, 실제로 얼마 드나요        │   display 32px / w300
│  주소만 넣으면 지역 보조금까지 반영합니다    │   body / --ink-muted
│                            24px              │
│  ┌────────────────────────────────────────┐  │
│  │ 주소                                   │  │   입력 카드
│  │ [                                    ] │  │   --surface + 헤어라인
│  │                                        │  │
│  │ 지붕 면적            건물 유형          │  │
│  │ [        ] ㎡        [ 주택      ▾ ]   │  │
│  │                                        │  │
│  │              [  계산하기  ]            │  │   pill / --ink
│  └────────────────────────────────────────┘  │
│                            24px              │
│  설치 가능 용량                     6.2 kW   │   결과 행
│  ─────────────────────────────────────────   │   0.5px 헤어라인
│  연간 예상 발전량               8,100 kWh    │
│  ─────────────────────────────────────────   │
│  지역 보조금                    −480 만원    │
│                            16px              │
│  ┌────────────────────────────────────────┐  │
│  │ 내 부담금                              │  │   --result-fill
│  │ 1,240 만원                             │  │   48px / Geist Mono
│  └────────────────────────────────────────┘  │
│                                              │
│  PVGIS 5.3 · 2026-08-07 기준 · 계산 방법 →   │   caption
└──────────────────────────────────────────────┘
                     96px

┌─ 블록 2 · 근거 ──────────────────── 640px ───┐
│                                              │
│  이 숫자가 어디서 왔는지                     │   heading 24px / w350
│                                              │
│  발전량   유럽집행위 PVGIS 5.3 공개 일사량   │
│  보조금   한국에너지공단·지자체 공고         │
│  갱신일   2026-08-07                         │
│  한계     현장 조건에 따라 달라집니다  →     │
│                            32px              │
│  ┌────────────────────────────────────────┐  │
│  │ 솔플래닛은 시공사가 아닙니다.          │  │   중립성 배너
│  │ 수수료도 광고비도 받지 않습니다.       │  │
│  │ 결과를 팔지 않고 연락처도 받지 않습니다│  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
                     96px

┌─ 푸터 ───────────────────────────────────────┐
│ 개인이 운영하는 정보 사이트                  │   caption / --ink-muted
│ 운영자 · 이메일 · 최종 갱신일                │
└──────────────────────────────────────────────┘
```

### 홈에서 제거되는 것

기존 홈의 다음 섹션은 **전부 삭제**한다.

- 히어로 영상과 배경 사진
- 신뢰 지표 4칸 (3건 / 4단계 / PVGIS / 전 항목)
- 시공 사례 섹션 — 스톡 사진이므로 즉시 제거
- 광고 블록
- 진행 과정 4단계
- 커뮤니티 유도 섹션
- 중복 SEO 섹션과 홈에 잘못 렌더링된 브레드크럼
- 무료 견적 CTA 전부

내용이 채워져 있지 않은 `/cases`, `/community`는 내비게이션에서 내린다. 지키지 못할 약속을 걸어두는 것이 이 사이트의 유일한 자산인 정직함을 가장 빠르게 깎는다.

---

## 8. 모션

| 대상 | 값 |
|---|---|
| 상태 전환 (hover, focus) | 150ms `ease-out` |
| 결과 등장 | 200ms, `translateY(8px) → 0` + opacity |
| 그 외 | 없음 |

페이지 로드 애니메이션을 넣지 않는다. 도구는 즉시 쓸 수 있어야 한다.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. 배포 전 체크리스트

- [ ] 대비: 본문 4.5:1, UI 요소 3:1 이상 (2절 실측표 준수)
- [ ] 포커스 링이 키보드 탐색 시 모든 요소에서 보인다
- [ ] 터치 타깃 최소 48px, 간격 8px 이상
- [ ] `word-break: keep-all` 적용, 단어 중간 줄바꿈 없음
- [ ] 숫자에 `tabular-nums` 적용, 값 변경 시 자릿수 흔들림 없음
- [ ] `prefers-reduced-motion` 존중
- [ ] 375 / 768 / 1024 / 1440에서 가로 스크롤 없음
- [ ] `box-shadow` 사용처 0건
- [ ] `font-weight` 500 이상 사용처 0건
- [ ] 초록·노랑 계열 색상 0건
- [ ] 이미지 태그 0건 (로고 SVG 제외)
- [ ] 이모지 아이콘 0건
- [ ] `--result-fill` 사용처가 페이지당 정확히 1곳
- [ ] 견적·연락처 수집 폼 0건
- [ ] 푸터에 운영 주체와 갱신일 표기

---

## 10. CSS 변수

```css
:root {
  /* 색 — 무채색 */
  --canvas:            #F2F2F4;
  --surface:           #FDFDFD;
  --ink:               #0F1012;
  --ink-muted:         #5E5E5E;
  --hairline:          #D8D8DC;

  /* 색 — 결과 강조 (페이지당 1회) */
  --result-fill:       #E4EDF7;
  --result-ink:        #123A5E;
  --result-ink-muted:  #3A5F80;

  /* 폰트 */
  --font-kr:  'Pretendard Variable', Pretendard, -apple-system,
              BlinkMacSystemFont, system-ui, sans-serif;
  --font-num: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;

  /* 타입 스케일 — 한글 */
  --text-display:   32px;  --lh-display:  1.30;  --ls-display:  -0.01em;   --fw-display:  300;
  --text-heading:   24px;  --lh-heading:  1.35;  --ls-heading:  -0.008em;  --fw-heading:  350;
  --text-subhead:   19px;  --lh-subhead:  1.45;  --ls-subhead:  -0.005em;  --fw-subhead:  350;
  --text-body:      16px;  --lh-body:     1.70;  --ls-body:     -0.005em;  --fw-body:     400;
  --text-caption:   13px;  --lh-caption:  1.60;  --ls-caption:  0;         --fw-caption:  450;

  /* 타입 스케일 — 숫자 */
  --text-num-result: 48px; --ls-num: -0.02em;
  --text-num-row:    20px;

  /* 간격 */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-6: 24px;  --space-8: 32px;  --space-12: 48px; --space-16: 64px;
  --space-24: 96px; --space-32: 128px;

  /* 레이아웃 */
  --width-content: 1120px;
  --width-tool:    640px;
  --gutter:        24px;
  --section-gap:   96px;

  /* 형태 */
  --radius-input: 12px;
  --radius-card:  16px;
  --radius-pill:  9999px;
  --border-hairline: 0.5px solid var(--hairline);

  /* 모션 */
  --ease:     cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 150ms;
  --dur-base: 200ms;
}

@media (max-width: 767px) {
  :root {
    --section-gap:     56px;
    --text-display:    26px;
    --text-num-result: 36px;
  }
}
```

## 11. Tailwind v4

```css
@theme {
  --color-canvas:           #F2F2F4;
  --color-surface:          #FDFDFD;
  --color-ink:              #0F1012;
  --color-ink-muted:        #5E5E5E;
  --color-hairline:         #D8D8DC;
  --color-result-fill:      #E4EDF7;
  --color-result-ink:       #123A5E;
  --color-result-ink-muted: #3A5F80;

  --font-kr:  'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif;
  --font-num: 'Geist Mono', ui-monospace, monospace;

  --text-caption:    13px;
  --text-body:       16px;
  --text-subhead:    19px;
  --text-heading:    24px;
  --text-display:    32px;
  --text-num-row:    20px;
  --text-num-result: 48px;

  --radius-input: 12px;
  --radius-card:  16px;
  --radius-pill:  9999px;

  --spacing-section: 96px;
}
```

---

## 12. 출처

이 시스템은 세 개의 레퍼런스를 합성했으며, 어느 하나를 그대로 복제하지 않는다.

| 층 | 출처 | 가져온 것 |
|---|---|---|
| 시각 언어 | Augen Pro (refero) | 오프화이트 캔버스, 350 이하 단일 웨이트, 그림자 없는 층, 색 배급 |
| 숫자 표현 | Steep (refero) | 축·격자선 없는 결과 표시, 페이지당 1회 강조 면 |
| 그리드·규율 | Swiss Modernism 2.0 (ui-ux-pro-max) | 12컬럼 모듈, 수학적 간격, 단일 액센트 |

의도적으로 **버린 것**: Augen의 54px 카드 라운드(도구에 과함), Augen의 `#0071E3` 파랑(캔버스 위 4.20:1로 AA 미달), Steep의 90px 세리프 디스플레이(한글에서 무거워짐), Steep의 peach 계열(태양광 클리셰), ui-ux-pro-max가 추천한 그린+솔라골드 팔레트와 font-weight 900(같은 이유).
