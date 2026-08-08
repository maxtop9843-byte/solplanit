---
name: grammar-checker
description: "표준 한국어 규칙에 기반해 사용자에게 노출되는 한국어의 맞춤법, 띄어쓰기, 문법, 구두점을 검사하고 교정합니다. SolPlanit UI 카피, 도움말, 오류 메시지, 가이드 문구를 배포하기 전에 사용합니다."
license: MIT
metadata:
  author: DaleSeo
  upstream_version: "1.0.1"
---

# grammar-checker: 한국어 문법 검사기

## 목적

사용자에게 노출되는 한국어가 맞춤법, 띄어쓰기, 문법, 구두점 면에서 자연스럽고 정확한지 검사한다.

## 우선순위

1. 맞춤법·철자 오류
   - 되/돼, 안/않, 던/든, 어미 오류 등 명백한 오류를 먼저 고친다.
2. 띄어쓰기
   - 의존명사, 보조용언, 단위 표현을 문맥에 맞게 검사한다.
3. 문법 구조
   - 조사, 시제, 어미, 주술 호응을 확인한다.
4. 구두점
   - 영어식 쉼표 남용, 느낌표 남용, 가운뎃점 오남용을 피한다.

## SolPlanit 적용 규칙

- 코드, 단위 기호, 공식, API 이름은 문법 교정 대상으로 오인하지 않는다.
- `kW`, `kWh`, `m²`, `PVGIS`, `SMP`, `REC` 같은 기술 표기는 유지한다.
- 버튼과 필드 라벨은 짧고 명확하게 유지하며 문장으로 억지로 늘리지 않는다.
- 오류 메시지는 무엇이 문제인지와 어떻게 고칠지 함께 알려 준다.
- 전문 용어 자체가 틀린 것은 아니지만, 일반 사용자가 이해하기 어렵다면 쉬운 설명을 우선한다.
- 문법적으로 맞더라도 한국어 화자가 실제 서비스에서 잘 쓰지 않는 표현이면 style-guide와 humanizer 검수를 이어서 수행한다.

## 최종 확인

- 맞춤법 오류가 없는가?
- 띄어쓰기가 문맥에 맞는가?
- 조사와 어미가 자연스러운가?
- 단위와 숫자 표기가 일관적인가?
- 번역체 때문에 문법적으로 어색한 부분은 없는가?

## Upstream

- Source: https://github.com/DaleSeo/korean-skills/tree/main/skills/grammar-checker
- Pinned upstream commit: `ae12ba27982ebeff03b46dc738365aaa34260d9a`
- License: MIT
- Original author: DaleSeo
