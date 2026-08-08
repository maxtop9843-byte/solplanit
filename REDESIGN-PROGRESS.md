# 리디자인 진행 상태

## 1. 문서 정리              [완료] 2026-08-08

- 브랜치: main → redesign-tool-first
- 아카이브: `docs/archive/` 로 이동 (삭제 아님)
  - `DESIGN.md`, `CONTENT.md`, `TASK_QUEUE.md`, `PRODUCT_SPEC.md`
  - `docs/QA_GENERAL_USER_JOURNEY.md`, `docs/ADSENSE_POLICY_READINESS.md`
- 유지:
  - `docs/CALCULATION_SPEC.md` — PRODUCT_SPEC §6 계산식 추출. 코드가 구현 중인 살아있는 계약
  - `docs/OPEN_OPS_ITEMS.md` — TASK_QUEUE 의 미완 OPS-001·LAUNCH-001 발췌
  - `AGENTS.md` 전면 교체, `README.md` 디자인 절 교체, `AUTOMATION.md` source priority 갱신
  - PVGIS 검증·검색엔진 제출·배포 기록 문서는 전부 유지
- 커밋: `2605c6b`, `38d06ef`, `f0a8bf6`, `75083f7`, `0013514`, `6c03f2e`

## 2. 레퍼런스 분석          [완료] 2026-08-08

- Augen Pro / Steep DESIGN.md 전문을 WebFetch로 직접 확인
- Augen Pro: 웨이트 350 단일 체계, 위계는 크기로만, 볼드·세미볼드 금지. 그림자 없이
  `#fdfdfd on #f2f2f4` 톤 차이 + 0.5px 헤어라인으로만 층 생성. 액센트 `#0071e3` 는
  링크·태그 테두리로만 쓰고 면으로 절대 채우지 않음. 텍스트가 콘텐츠의 약 95%
- Steep: 스탯 카드는 축·격자선 없이 큰 수치 + 변화 한 줄. peach `#fbe1d1` 면은
  페이지당 최대 1회. 전체 97% 무채색
- 치환 결정: Augen 히어로의 3D 렌더 자리에 계산기 입력 카드, 라운드 54px→16px,
  액센트 `#0071e3` 폐기(캔버스 위 4.20:1 AA 미달), Steep 90px 세리프와 peach 폐기,
  PP Neue Montreal/Signifier → Pretendard Variable + Geist Mono
- 미해결: 스킬 `frontend-design` 는 이 환경에 설치돼 있지 않아 로드하지 못했다.
  `design-taste-frontend` 만 로드했다

## 3. 감사와 삭제            [완료] 2026-08-08

- 삭제(홈): 히어로 이미지와 용량 칩, 시공 사례 섹션(Unsplash 스톡을 실제 시공으로 표기),
  광고 블록, 진행 과정 4단계, 커뮤니티 유도 섹션, 중복 SEO 섹션과 브레드크럼,
  견적 CTA
- 삭제(전역): 광고 시스템 전부(`AdZone`, `AdConsentProvider`, `adPolicy` + CSS + 테스트),
  `/quote` 라우트와 `lib/quotes` 전부(이름·휴대전화·주소를 수집하던 유일한 폼),
  `.env.example` 의 ADSENSE 변수 4개, `next.config.ts` 의 `images` 블록(next/image 사용처 0건),
  죽은 CSS 규칙
- 내비게이션: 홈·`/solar/*`·`/trust`·`/account` 에서 `/cases`·`/community` 링크 제거
- 남김: trust 8개 페이지, 스킵 링크, PVGIS 계산 로직 전부
- 검증: lint 통과, typecheck 통과, 테스트 88/88 통과, 프로덕션 빌드 통과,
  dev 서버 렌더링 확인(콘솔 에러 0건, `/quote` 라우트 트리에서 사라짐)
- 미해결:
  - `/cases` 3개 페이지가 여전히 Unsplash 스톡 사진을 실제 시공 사례로 표기한다.
    지시서는 홈 섹션과 내비게이션만 제거 대상으로 적었으므로 라우트는 남겼다.
    사이트의 정직함과 정면으로 충돌하므로 아래 확인 사항 참조
  - `/community`, `/cases` 라우트가 sitemap 과 `PUBLIC_ROUTES` 에 그대로 남아 색인 대상이다
  - `ResultSummary` 의 "계산 결과로 질문하기"(→`/community`), "내 작업 보기"(→`/account`)
    버튼은 남아 있다. 홈 재구축(5단계) 범위로 판단해 건드리지 않았다
  - `docs/OPEN_OPS_ITEMS.md` 의 LAUNCH-001 검증 계약 중 광고 관련 항목은 광고 제거로
    무효가 되었다. 재작성 필요

## 4. 토큰 구현              [완료] 2026-08-08

- `DESIGN.md` 10절 CSS 변수 블록을 `globals.css` 에 그대로 반영. 모바일 오버라이드 포함
- 한글 전역 규칙 적용: `word-break: keep-all`, `overflow-wrap: break-word`,
  `-webkit-font-smoothing: antialiased`, `.num` 유틸리티
- 하드코딩 값 치환: CSS 11개 파일 전부. 남은 색상 리터럴은 `globals.css` 의 토큰 정의와
  `ResultDownloads.tsx` 의 내보내기용 상수뿐이다(페이지 밖에서 열려 CSS 변수를 못 씀)
- 초록·노랑 제거: `--functional-green`, `--soft-green`, `#fff8de`, maplibre 마커 `#16823B`,
  차트 내보내기 색까지 전부. 마커는 런타임에 `--ink` 를 읽는다
- `--result-fill` 은 `ResultSummary` 의 최종 결과 카드 한 곳에만 남겼다
- 숫자 카운트업 애니메이션(`AnimatedNumber`) 삭제. `DESIGN.md` 금지 항목이다
- Geist Mono 를 `next/font/google` 로 self-host, `display: swap`. 새 의존성 0개
- 검증(실측): `box-shadow` 0건, `font-weight` 500 이상 0건, 초록·노랑 0건,
  `<img>` 0건, 375/768/1024/1440 가로 스크롤 없음, 모바일에서 토큰이 56px·26px·36px 로 전환,
  lint·typecheck·테스트 88/88·프로덕션 빌드 통과
- 미해결:
  - **Pretendard Variable 이 아직 로드되지 않는다.** Google Fonts 에 없어서 `next/font` 로
    self-host 하려면 저장소에 폰트 파일이 있어야 한다. 지금은 폰트 스택에 이름만 있고
    실제로는 시스템 서체로 대체된다. `DESIGN.md` 3절이 요구하는 웨이트 300/350/450 이
    가변 폰트 없이는 정확히 나오지 않는다. 아래 확인 사항 1번
  - Tailwind `@theme` 블록(`DESIGN.md` 11절)은 반영하지 않았다. 아래 확인 사항 2번
  - 0.5px 헤어라인은 선언값 기준으로 전부 0.5px 이지만 비레티나(DPR 1)에서는 브라우저가
    1px 로 스냅한다. 레티나 실측은 남아 있다

## 5. 홈 재구축              [완료] 2026-08-08

- 구조: 상단바 → 블록1(도구) → 블록2(근거) → 중립성 배너 → 푸터. 블록은 정확히 두 개다
- 4단계 위저드(건물유형 → 면적 → 지도 → 목적)를 입력 카드 하나로 접었다.
  건물 유형·지붕 면적·단위가 한 화면에 있고 `계산하기` 하나로 같은 화면에 결과가 나온다
- 지도 단계 삭제. 좌표는 일반 계산에 쓰이지 않는 입력이었다.
  지도 기반 면적 자동 산출은 착수하지 않았다
- 결과: 중간값 3줄 전부 무채색 + 행 사이 0.5px 헤어라인,
  최종값 `설치 가능 용량` 하나만 `--result-fill` 면 위 48px Geist Mono
- 페이지에서 가장 큰 글자가 결과 숫자(48px)다. h1 은 32px. 실측으로 확인
- 스킵 링크 `본문으로 건너뛰기` 를 새로 넣었다. 저장소에 원래 없었다
- 중립성 배너를 푸터 위 전역에 배치. 푸터는 운영 주체·문의·갱신일 표기로 교체
- 삭제: `GuidedCalculator`, `ResultSummary`, `MapLocationPicker` 와 각 CSS·테스트
- 완료 조건 "유지 확인" 8항목 실측 대조: 섹션 간격 96/56px, 카드 여백 32/24px,
  도구 폭 640px, 경계선 0.5px 선언, 타입 스케일 5단계 행간·자간 유지,
  제목 300/350·본문 400, Geist Mono 유지, `keep-all`·`tabular-nums` 유지. 전부 통과
- 발견해서 고친 것: `<button>` 의 UA 기본 테두리 2px outset 이 주 버튼에 보이던 문제,
  모바일에서 내비·푸터 링크가 48px 미만이던 문제
- 검증: lint, typecheck, 테스트 77/77, 프로덕션 빌드 통과.
  8개 라우트 200, 잔여 `/cases`·`/community`·`/quote` 링크 0건
- **갈린 지점 (중요)**: `DESIGN.md` 7절 ASCII 목업은 결과를
  `설치 가능 용량 / 연간 예상 발전량 / 지역 보조금` → `내 부담금` 으로 그린다.
  이 저장소에는 지역 보조금 데이터도, kW당 설치비 기본값도, 지역별 일사량 표도 없다.
  세 값을 지어내면 근거 없는 금액을 사용자에게 보여주게 되고, 이는
  `DESIGN.md` 0절의 북극성("숫자를 믿게 만드는 것")과 1절("모든 수치 옆에는 출처가
  따라붙는다")을 정면으로 어긴다. 기존 코드도 같은 이유로 시장 단가를 넣지 않는다.
  그래서 **구조는 목업 그대로 두고 값만 정직하게 채웠다.**
  중간값은 배치 가능 면적·예상 패널 수·패널 한 장 출력, 최종값은 설치 가능 용량이다.
  발전량과 수익은 사용자가 직접 넣은 가정값으로만 계산하며 도구 블록 안의
  접힌 영역에 둔다. 주소 입력란도 넣지 않았다. 아무것도 바꾸지 않는 입력이기 때문이다.
  보조금·설치비 데이터를 확보하면 목업 그대로 복원할 수 있다
- 미해결: 푸터 공개 이메일이 비어 있다. 아래 확인 사항 참조

## 6. 한국어 카피            [완료] 2026-08-08

지시서 순서대로 `design:ux-copy` → `grammar-checker` → `humanizer` → `style-guide` 를 실행했다.

- ux-copy: 버튼 라벨은 결과를 말한다(`계산하기`). 오류 메시지를 "무엇이 잘못됐고
  어떻게 고치는지" 형식으로 다시 썼다. 예: "설치 면적은 5m² 이상 입력해주세요"
  → "패널 한 장도 놓기 어려운 면적입니다. 5m² 이상 넣어주세요"
- grammar-checker: `대략의 면적`→`대략적인 면적`, `장당 차지 면적`→`한 장이 차지하는 면적`,
  `감안해`→`고려해`, `넓이`→`면적`
- humanizer: 긴 문장을 끊고 피동을 능동으로 바꿨다.
  `현장에서만 확인됩니다`→`현장에서 봐야 압니다`,
  `들어 있지 않습니다`→`빼고 계산합니다. 실제로는 이보다 길어집니다`.
  쉼표 5개짜리 문장을 두 문장으로 분리
- style-guide: 실제 불일치 3건을 고쳤다.
  (1) `넣다`/`입력하다` 혼용 → `넣다` 로 통일
  (2) 해요체/합니다체 혼용 → 합니다체로 통일
  (3) 단위 띄어쓰기 `9.5 kW` 와 `5m²` 혼용 → 붙여쓰기로 통일
- 제거된 기능을 가리키던 카피 정리: `trustContent` 의 커뮤니티·견적 중개 문단,
  `searchIntentPages` 의 견적 요청 단계, 사이트 설명과 OG 제목의 "견적까지"
- 중립성 배너와 푸터는 지시서 문구를 그대로 넣었다
- 톤 유지: "맞지 않으면 맞지 않다고 말씀드립니다", "무리한 용량은 권하지 않습니다"
  를 홈에 살렸다. 과장·감탄사·이모지 없음
- 검증: lint, typecheck, 테스트 77/77 통과

## 7. 검수                   [완료] 2026-08-08

`design:accessibility-review` → `ponytail:ponytail-review` → `design:design-critique` 순서로 실행했다.

### 접근성 (WCAG 2.1 AA)

- 대비 실측: 검사한 14개 전경·배경 조합 전부 통과. `--result-fill` 위 결과 면은
  라벨 5.68:1, 값 9.91:1 로 `DESIGN.md` 2절 실측표와 정확히 일치
- 포커스: 실제 키보드 Tab 으로 확인. `:focus-visible` 에 2px `--ink` 링이 보인다.
  스킵 링크가 첫 번째 초점이며 포커스 시 화면 안으로 들어온다(48px 높이)
- 랜드마크: header/nav/main/aside/footer 모두 이름이 붙어 있다
- 폼: 라벨 없는 입력 0건, 도움말은 `aria-describedby`, 오류는 `role="alert"`,
  결과는 `aria-live="polite"`
- 터치 타깃: 독립 탐색 링크를 전부 48px 로 올렸다. 문장 속 인라인 링크는 예외로 둔다

### 과잉 구현 제거

- 죽은 클래스 `.proLink` 삭제, 정의가 사라진 `panelButton` 클래스 참조 삭제
- 전체 CSS 클래스를 JSX 와 대조해 미사용 0건 확인

### 비평에서 나온 수정

- **근거 블록이 홈 계산에 쓰지 않는 PVGIS 를 발전량 출처로 적고 있었다.**
  홈은 패널 배치 방식으로 용량을 계산하고, 발전량은 사용자가 넣은 값만 쓴다.
  PVGIS 는 전문가용 화면에서만 조회한다. 이 사이트의 기준으로 가장 심각한
  결함이라 근거 블록을 실제 계산 방식대로 다시 썼다

### 완료 조건 대조

| 항목 | 결과 |
|---|---|
| `box-shadow` 0건 | 통과 (실측) |
| `font-weight` 500 이상 0건 | 통과 (실측) |
| 초록·노랑 0건 | 통과 |
| `DESIGN.md` 에 없는 색상값 0건 | 통과. 남아 있던 입력 기본색 `#000` 을 `--ink` 로 교체 |
| `<img>` / `next/image` 0건 | 통과 |
| 이모지 아이콘 0건 | 통과 |
| `--result-fill` 페이지당 1곳 | 통과 (자동 테스트로 고정) |
| 견적·연락처 수집 폼 0건 | 통과 |
| `word-break: keep-all` 전역 | 통과 |
| 모든 숫자에 `tabular-nums` | 통과. 본문 숫자까지 덮도록 `html` 에 적용 |
| 포커스 링 | 통과 (키보드 실측) |
| 터치 타깃 48px | 통과 |
| `prefers-reduced-motion` 존중 | 통과 |
| 375/768/1024/1440 가로 스크롤 없음 | 통과 (네 폭 모두 실측) |
| 새 의존성 0개 | 통과. `main` 대비 `package.json`·lock 변경 0줄 |
| 빌드 통과, 콘솔 에러 0건 | 빌드 통과. 콘솔 에러는 dev 서버 HMR 웹소켓뿐이고 앱 코드 아님 |
| Lighthouse 접근성 95점 이상 | **미확인.** 아래 미해결 참조 |

### 유지 확인 8항목 (빼지 않았는지)

섹션 간격 96/56px, 경계선 0.5px 선언, Geist Mono 유지, 타입 스케일 5단계 행간·자간
개별 유지, 제목 300/350·본문 400, `--result-fill` 카드의 48px 숫자가 페이지 최대 글자,
도구 폭 640px·카드 여백 32/24px, `keep-all`·`tabular-nums` 유지. **8항목 전부 통과.**

- 프리뷰에서 확인할 항목:
  - Lighthouse 접근성 점수. 로컬에서 실행할 수단이 없어 Vercel 프리뷰에서 측정한다.
    WCAG 2.1 AA 항목은 브라우저에서 직접 실측했고 위반 0건이다
  - 0.5px 헤어라인의 실기기 렌더링. 코드상 선언값은 전부 0.5px 로 확인했다
    (`--border-hairline` 70곳). `pro.css` 의 탭 밑줄 1px 한 곳을 0.5px 로 고쳤다.
    내려받는 PDF 보고서만 1px 을 유지한다. 인쇄에서 0.5px 은 사라질 수 있기 때문이다

---

## 사용자 확인이 필요한 사항

없음. 남은 항목은 프리뷰에서 눈으로 볼 것들뿐이다.

### 해결됨

0. **푸터 공개 연락처** — 개인 메일 대신 공개 저장소 링크를 투명성 채널로 넣었다.
   계산 코드가 열려 있다는 사실 자체가 이 사이트의 신뢰 근거다.

1. **Pretendard Variable** — 허가받아 공식 배포처에서 내려받아 `public/fonts/` 에 넣고
   `next/font/local` 로 self-host 했다. weight `45 920`, display swap, CDN 미사용.
2. **Tailwind** — 도입하지 않는다. `DESIGN.md` 11절은 앞으로도 무시한다.
   10절 CSS 변수만으로 구현한다.
3. **`/cases`** — 라우트째 제거했다.
4. **`/community`** — 라우트째 제거했다.
5. **`frontend-design` 스킬 부재** — `design-taste-frontend` 로 진행한다.
   `.claude/launch.json` 은 유지한다.
