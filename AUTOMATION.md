# SolPlanit Automation Rules

## Mission

최신 `main`을 기준으로 SolPlanit을 **검색 수요 중심의 저관리형 태양광 계산 도구 사이트**로 자동 개발한다.

한 번 실행할 때 `TASK_QUEUE.md`의 가장 앞선 실행 가능한 작업 **하나만** 끝낸다.

---

## Source priority

매 실행 시작 시 다음 순서로 읽는다.

1. `AUTOMATION.md`
2. `DESIGN.md`
3. `TASK_QUEUE.md`
4. `docs/SEARCH_INTENT_PLAN.md`
5. `docs/CALCULATION_SPEC.md`
6. 현재 공통 UI와 테스트

`docs/archive/`의 과거 플랫폼·커뮤니티·견적 중개 방향은 정본이 아니다.

`REDESIGN-PROMPT.md`가 존재하더라도 현재 제품 방향은 위 문서가 우선한다.

---

## Mandatory repository skills

프로젝트에 포함된 스킬은 선택 참고자료가 아니라 해당 작업 유형의 **필수 검수 단계**다.

### UI/UX 작업

사용자에게 보이는 페이지, 폼, 계산기, 내비게이션, 반응형 레이아웃, 상태 UI를 추가·수정할 때는 구현 전에 반드시 다음 파일을 읽는다.

- `.agents/skills/ui-ux-pro-max/SKILL.md`

적용 우선순위는 다음과 같다.

1. 접근성
2. 터치·상호작용
3. 폼과 피드백
4. 모바일·반응형
5. 정보 위계와 탐색
6. 타이포그래피·색
7. 필요한 경우에만 모션

`DESIGN.md`가 SolPlanit의 제품·브랜드·시각 방향에 대한 상위 정본이며, UI UX Pro Max는 구현과 UX 검수 기준으로 사용한다. 둘이 충돌하면 제품 방향은 `DESIGN.md`를 따르되 접근성·사용성 문제는 같은 작업에서 해결한다.

### 한국어 사용자 문구

한국어 제목, 설명, 입력 라벨, 도움말, 버튼, 오류·빈 상태·결과·가이드 문구를 추가하거나 수정하면 배포 전에 다음 순서로 검수한다.

1. `.agents/skills/korean-skills/grammar-checker/SKILL.md`
2. `.agents/skills/korean-skills/style-guide/SKILL.md`
3. `.agents/skills/korean-skills/humanizer/SKILL.md`

문법적으로 맞는 것만으로 완료 처리하지 않는다. 한국어 화자가 실제 서비스에서 읽었을 때 자연스러운지, 같은 개념을 같은 용어로 쓰는지, 번역체·명사 나열·업계 말투가 남지 않았는지 확인한다.

스킬 원본과 버전은 각 `SKILL.md`의 Upstream 섹션에 고정한다. 외부 플러그인이 현재 세션에서 로드되지 않더라도 저장소의 로컬 스킬을 기준으로 작업을 계속한다.

---

## Mandatory GitHub + Vercel gate

상태 판단보다 먼저 연결된 GitHub와 Vercel을 실제 호출한다.

1. GitHub에서 최신 main, 열린 PR, 관련 브랜치, exact-head checks/workflow runs, 변경 파일과 댓글을 확인한다.
2. Vercel에서 SolPlanit project와 PR head Preview 또는 최신 main Production을 확인한다.
3. 첫 실패·빈 결과만으로 `도구 없음`, `권한 없음`, `조회 불가`, `BLOCKED`라고 결론 내리지 않는다.
4. PR 번호, head SHA, Vercel 봇 댓글, deployment URL/ID, project ID, team ID 등 이미 확인된 식별자로 다른 경로를 재시도한다.
5. 브라우저·curl·clone·DNS 실패는 플러그인 호출을 생략할 이유가 아니다.
6. 실제 호출과 합리적인 재시도 후에도 실패한 경우에만 사용 함수·대상·오류·대체 조회 결과를 기록한다.

---

## Product rules

### 일반 사용자에게 아는 값만 묻는다

기본 화면에서 다음과 같은 전문가용 값을 먼저 묻지 않는다.

- 평균 일 발전시간
- 시스템 손실률
- 자가소비율
- 자가소비 전력 가치
- SMP / REC / REC 가중치
- 위도·경도
- 모듈 기술

필요하면 공식 데이터로 계산하거나 상세 조건·정밀 계산·발전사업자 계산기로 분리한다.

### 숫자를 꾸며내지 않는다

- 확인되지 않은 보조금은 `0원`이 아니라 `확인된 정보 없음`이다.
- 전국 평균 설치비를 근거 없이 기본값으로 넣지 않는다.
- 전기요금을 단일 고정 `원/kWh` 값으로 단순화하지 않는다.
- PVGIS 등 외부 데이터를 쓸 때 출처와 버전을 표시한다.

### 한국어 품질

모든 신규·수정 UI 카피는 repository Korean Skills 3단계를 거친다.

- 번역체 어순 금지
- 행정 문구처럼 명사를 길게 이어 붙이지 않기
- 전문용어를 첫 화면에 그대로 노출하지 않기
- 같은 뜻 반복 금지
- 버튼은 실제 동작을 설명하기
- 과장된 광고 슬로건보다 질문과 답 중심으로 쓰기

어색한 문장을 발견하면 같은 작업에서 고친다.

---

## Task selection

1. 열린 PR이나 진행 중 작업이 있으면 새 작업보다 먼저 검증·수정·완료한다.
2. 없다면 `TASK_QUEUE.md`의 가장 앞선 `OPEN` 작업 하나를 선택한다.
3. 선행 데이터 작업이 필요한 계산기는 데이터 작업보다 먼저 구현하지 않는다.
4. 한 실행에서 여러 계산기를 묶지 않는다.
5. 보안, 계산 오류, 치명적 UX 오류는 큐보다 우선한다.

---

## Branch and PR

- 최신 main에서 새 작업 브랜치를 만든다.
- 브랜치: `task/<task-id>-<short-slug>`
- 한 작업 = 한 PR을 원칙으로 한다.
- unrelated 변경을 섞지 않는다.
- 구현과 검증이 끝나기 전에는 draft PR을 사용해도 된다.

PR 본문에는 다음을 적는다.

- 작업 ID와 목적
- 무엇을 바꿨는지
- 사용자가 어떻게 달라지는지
- 계산·데이터 출처 또는 한계
- 적용한 repository skill과 주요 검수 결과
- 테스트 결과
- Preview 상태

---

## UI/UX validation

UI 작업은 코드만 보고 끝내지 않는다.

1. `.agents/skills/ui-ux-pro-max/SKILL.md`를 읽고 해당 페이지의 핵심 사용자 작업을 먼저 정의한다.
2. 실제 진입점에서 기능을 찾을 수 있는지 확인한다.
3. 데스크톱 대표 흐름을 처음부터 결과까지 확인한다.
4. 모바일 375px 흐름을 확인한다.
5. 입력 label, 오류, 빈 상태, 로딩, 결과, 다음 행동을 확인한다.
6. 결과 숫자가 질문에 직접 답하는지 확인한다.
7. 일반 사용자에게 모르는 값을 요구하지 않는지 확인한다.
8. 한국어 문구는 Korean Skills 3단계로 다시 읽는다.
9. Preview가 가능하면 실제 화면을 확인한다.

현재 승인된 시각 언어는 `DESIGN.md`를 따른다.

---

## Required checks

모든 구현 PR은 가능한 범위에서 다음을 통과해야 한다.

- lint
- typecheck
- unit/integration tests
- production build
- exact-head GitHub checks
- Vercel Preview 또는 Preview 불가 사유 확인

계산 작업은 추가로 다음을 테스트한다.

- 단위
- 경계값
- 반올림
- 누락 입력
- 잘못된 입력
- 데이터 없음과 0의 구분
- 가정 변경
- 월간/연간 일관성

UI 작업은 추가로 다음을 확인한다.

- 키보드 포커스와 label
- 375 / 768 / 1024 / 1440 반응형
- 터치 타깃
- 로딩 / 오류 / 데이터 없음 / 결과 상태
- reduced motion
- 사용자에게 불필요한 전문 변수의 progressive disclosure

---

## Merge policy

다음 조건이면 squash merge를 기본으로 한다.

- 필수 GitHub checks 성공
- 미해결 review thread 없음
- 계산 정확성·라우팅·데이터 손실·보안 문제 없음
- Definition of Done 충족

Preview가 Vercel 한도·보호·권한·DNS·브라우저 환경 문제로만 보이지 않는 경우에도 exact-head CI와 diff 검토가 모두 깨끗하면 작업을 무기한 멈추지 않는다.

이때 실패한 Preview 조회 경로와 재시도를 기록하고 병합한 뒤 Production을 다시 확인한다.

애플리케이션 코드 때문에 Preview build가 실패한 경우에는 병합하지 않는다.

---

## Queue maintenance

작업을 끝내면 해당 항목을 `DONE`으로 바꾸고 새로 발견한 일은 별도 `OPEN` 작업으로 적는다.

Search Console 데이터가 충분히 쌓이면 추측보다 실제 검색어·노출·CTR을 우선해 큐를 재정렬한다.

---

## Permanent scope guard

명시적인 새 결정이 있기 전에는 다음을 개발하지 않는다.

- 커뮤니티
- 견적 중개
- 시공사·전문가 매칭
- 전화번호·이메일 리드 수집
- 회원 기능
- CRM
- 프로젝트 관리 SaaS
- 실시간 상담

핵심은 기능 수가 아니라 **검색자가 이해하고 바로 쓸 수 있는 정확한 계산기**다.
