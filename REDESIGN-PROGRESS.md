# 리디자인 진행 상태

## 1. 문서 정리   [완료] 2026-08-08

- 브랜치: main → redesign-tool-first
- 아카이브: `docs/archive/` 로 이동 (삭제 아님)
  - `DESIGN.md`
  - `CONTENT.md`
  - `TASK_QUEUE.md`
  - `PRODUCT_SPEC.md`
  - `docs/QA_GENERAL_USER_JOURNEY.md`
  - `docs/ADSENSE_POLICY_READINESS.md`
- 유지:
  - `docs/CALCULATION_SPEC.md` — PRODUCT_SPEC §6 계산식 추출. 코드가 구현 중인 살아있는 계약
  - `docs/OPEN_OPS_ITEMS.md` — TASK_QUEUE 의 미완 OPS-001·LAUNCH-001 발췌. 운영 항목이 묻히면 안 됨
  - `AGENTS.md` — 전면 교체. 디자인 진실은 루트 DESIGN.md 하나
  - `README.md` — 디자인 방향 절 제거, DESIGN.md 참조로 대체
  - `AUTOMATION.md` — source priority·task selection 갱신. 브랜치·검증·PR 절차는 유지
  - `docs/QA-002-PVGIS-5.3-VALIDATION.md`, `docs/SEARCH_ENGINE_SUBMISSION.md`,
    `docs/PRODUCTION_RECOVERY.md`, `docs/PRODUCTION_REVERIFY_2026-07-31.md`, `reports/ops/`
    — 계산·배포·운영 절차 문서이므로 무조건 유지
- 커밋:
  - `2605c6b` chore: 아카이브 이동
  - `38d06ef` chore: 문서 분리
  - `f0a8bf6` chore: 진입 규약 갱신
  - `75083f7` fix: 링크

## 2. 레퍼런스 분석  [대기]

## 3. 감사와 삭제    [대기]

## 4. 토큰 구현      [대기]

## 5. 홈 재구축      [대기]

## 6. 한국어 카피    [대기]

## 7. 검수          [대기]

---

## 사용자 확인이 필요한 사항

- 새 `DESIGN.md` 와 `REDESIGN-PROMPT.md` 가 아직 저장소 루트에 없다. 현재 `C:\Users\coms\solplanit\`
  (저장소 상위 폴더)에 있다. `AGENTS.md` 와 `AUTOMATION.md` 가 이미 두 파일을 가리키고 있으므로
  루트에 넣어야 참조가 유효해진다.
- `redesign/visual-refresh-2026-08` 브랜치는 지시대로 삭제하지 않고 그대로 두었다. 원격에도 남아 있다.
- 광고 코드(`src/lib/adPolicy.ts`, 광고 존 컴포넌트)는 아직 저장소에 남아 있다. 이번 작업은 문서만
  다뤘으므로 코드 제거는 3단계(감사와 삭제) 대상이다.
