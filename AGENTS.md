# AGENTS.md

## Repository purpose

SolPlanit is a Korean-first solar installation planning and expert-connection platform.

## Design truth

The single source of design truth for this repository is `DESIGN.md` in the root. Nothing else.

## Work instructions

Follow `REDESIGN-PROMPT.md` for what to build and in what order.

## Archived documents

Every document under `docs/archive/` is a deprecated earlier direction. Do not read it, do not cite
it, and do not restore anything from it.

## Non-negotiable constraints

- Do not invent color, font, or spacing values that are not in `DESIGN.md`. If a value you need is
  missing, decide with the north star below and record the decision.
- Green and yellow are forbidden colors.

## 작업 방식 (기본값)

- 사용자는 결과만 확인한다. 중간에 질문하지 않는다.
- 판단이 갈리면 멈추지 말고 `DESIGN.md` 의 북극성("숫자를 믿게 만드는 것")을 기준으로
  스스로 결정하고 진행한다. 결정과 근거는 보고에 한 줄로 남긴다.
- 되돌릴 수 있는 일(브랜치 작업, 파일 이동, 커밋)은 확인 없이 실행한다.
- 되돌릴 수 없는 일만 멈춘다: `main` 에 머지, 원격 브랜치 삭제, 파일 영구 삭제,
  배포 승격, 결제·계정 설정 변경.
- 없는 데이터를 지어내지 않는다. 값이 없으면 그 항목을 빼거나 사용자 입력값으로만 채운다.
- 보고는 표 하나와 세 줄 이내. 사용자가 볼 링크가 있으면 맨 위에 둔다.
