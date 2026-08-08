# Repository Agent Skills

SolPlanit은 UI/UX와 한국어 품질을 세션별 플러그인 연결 상태에 맡기지 않고 저장소 안의 로컬 스킬로 고정한다.

## Installed skills

### UI UX Pro Max

- Local: `.agents/skills/ui-ux-pro-max/SKILL.md`
- Upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Pinned upstream commit: `abb7f2fd5a083fa1ff55c326a963ff0d95c33f99`
- License: MIT
- Use: 사용자에게 보이는 UI 구조, 폼, 계산기, 반응형, 접근성, 상태, 인터랙션 설계·검수

### Korean Skills

- Upstream: https://github.com/DaleSeo/korean-skills
- Pinned upstream commit: `ae12ba27982ebeff03b46dc738365aaa34260d9a`
- License: MIT
- Original author: DaleSeo

Installed locally:

- `korean-skills/grammar-checker/SKILL.md`
- `korean-skills/style-guide/SKILL.md`
- `korean-skills/humanizer/SKILL.md`

Use: 한국어 UI 카피의 문법 → 용어·스타일 일관성 → 자연스러움 순서 검수.

## Priority

`DESIGN.md` is the SolPlanit product and visual source of truth. Repository skills are implementation and quality-control layers. A generic style recommendation must not silently override a deliberate SolPlanit product decision. Accessibility, broken interaction, confusing forms, and unnatural Korean still require correction.

## Automation

`AUTOMATION.md` requires these skills for relevant tasks. If a ChatGPT/Claude/Codex plugin is unavailable in a session, agents must use these repository-local files instead of skipping the quality pass.

## Updating

Do not silently track upstream `main`. Review upstream changes first, then update the pinned commit recorded here and in each skill file. This prevents an automated development run from changing behavior because an external repository changed unexpectedly.

## License note

Both upstream projects declare the MIT License. These local copies preserve source, upstream commit, license, and author attribution where applicable. See the upstream repositories for the full license text and complete skill datasets.
