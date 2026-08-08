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

## 5. 홈 재구축              [대기]
## 6. 한국어 카피            [대기]
## 7. 검수                   [대기]

---

## 사용자 확인이 필요한 사항

1. **Pretendard Variable 폰트 파일이 필요하다.** Google Fonts 에 없어서 `next/font` 로
   self-host 하려면 `.woff2` 파일이 저장소에 있어야 한다. 공식 배포처(jsDelivr)에서
   내려받아 `public/fonts/` 에 넣으면 되는데, 파일 다운로드는 확인 없이 하지 않는다.
   내려받아도 되는지, 아니면 다른 방법을 쓸지 알려달라. 그 전까지는 시스템 서체로 대체되고
   `DESIGN.md` 3절의 웨이트 300/350/450 이 정확히 재현되지 않는다.
2. **Tailwind `@theme` 블록(`DESIGN.md` 11절)은 반영하지 않았다.** 이 저장소에는 Tailwind 가
   설치돼 있지 않다(`package.json` 의존성은 maplibre-gl, next, react, react-dom 뿐).
   추가하면 `REDESIGN-PROMPT.md` 9절의 "의존성 추가 금지"와 7절의 "새로 추가된 의존성 0개"를
   어기게 되어, 10절 CSS 변수만 구현했다. Tailwind 를 실제로 도입할지 결정이 필요하다.
3. **`/cases` 라우트를 어떻게 할지.** 스톡 사진 3장을 "경기 화성 48.6kW" 같은 실제
   시공 사례로 표기하고 있다. 지시서 3절은 "최우선 제거" 라고 했지만 대상으로 적은 것은
   홈 섹션과 내비게이션 링크였다. 라우트 자체를 지울지, 사진 없는 정직한 형태로
   다시 쓸지 결정이 필요하다. 지금은 링크만 내려간 상태로 살아 있다.
4. **`/community` 라우트를 어떻게 할지.** 같은 상황이다. 내비게이션에서는 내렸지만
   라우트와 sitemap 항목은 남아 있다.
5. **`.claude/launch.json` 을 새로 만들었다.** dev 서버를 띄워 렌더링을 검증하기 위한
   설정 파일이다. 필요 없으면 지워도 된다.
