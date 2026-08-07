# AGENTS.md

## Repository purpose

SolPlanit is a Korean-first solar installation planning and expert-connection platform.

## Mandatory reading

Before modifying code or documentation, read:

1. `AUTOMATION.md`
2. `TASK_QUEUE.md`
3. `DESIGN.md`
4. `PRODUCT_SPEC.md`
5. `CONTENT.md`

## Non-negotiable constraints

- Do not turn the homepage into a crowded dashboard.
- Keep the first viewport image-led and minimal.
- Sky Blue (`--accent`) is the only accent colour, and it is reserved for
  action. Never decorate with it.
- Hierarchy comes from size and space, never from font weight.
- Every colour, type step, space step and radius resolves through a token in
  `globals.css`. No literal hex or magic px in components.
- Real photographs only for installations, sites and customers. See `DESIGN.md`.
- General-user and professional flows remain separated by URL.
- Use approved copy from `CONTENT.md`.
- Every calculation must expose assumptions, units, and limitations.
- Do not imply guaranteed savings, revenue, installation approval, or payback.
- Complete exactly one queue task per automation run.
