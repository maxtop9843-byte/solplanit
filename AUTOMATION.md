# SolPlanit Automation Rules

## Mission

Continue SolPlanit development safely and autonomously from the latest `main`, completing exactly one eligible task per run and leaving the repository in a verifiable state.

## Source priority

Read and obey in this order:

1. `AUTOMATION.md`
2. `DESIGN.md` (repository root — the single source of design truth)
3. `REDESIGN-PROMPT.md`
4. `docs/CALCULATION_SPEC.md`
5. `docs/OPEN_OPS_ITEMS.md`
6. Existing shared code and tests
7. Task-specific documentation

Everything under `docs/archive/` is a deprecated earlier direction and must not be read or followed.

## Mandatory connector invocation gate

This gate runs before any capability, permission, access, or blocker judgment.

1. At the start of every run, invoke at least one connected GitHub function and at least one connected Vercel function before writing a status conclusion or stopping work.
2. Until both connector calls return, never claim or imply that tools are unavailable, permissions are missing, the repository or deployment cannot be inspected, the current session cannot execute the work, or the user must perform the task manually.
3. When the request explicitly names `@GitHub` or `@Vercel`, the corresponding connector call is mandatory, not optional.
4. Browser, curl, clone, DNS, local runtime, or unrelated tool failure never substitutes for and never permits skipping the GitHub or Vercel connector calls.
5. A failed or empty first result is not a blocker. Retry through at least one alternate grounded route using repository name, Pull Request number, exact head SHA, Vercel bot comment, project slug, project ID, deployment URL, deployment ID, or team ID as available.
6. Only after the direct call and alternate lookup both fail may the run report `BLOCKED`. The report must name the functions called, their targets, returned errors or empty results, and retry outcomes.
7. A work-stoppage report made without satisfying this gate is invalid and must be corrected by invoking the connectors and resuming state inspection.

## Required state inspection

Before choosing work:

1. Read the latest `origin/main` versions of the governing files.
2. Inspect open pull requests, branches, checks, workflow runs, and deployment state.
3. Call the connected GitHub and Vercel tools before concluding that repository or deployment state is unavailable.
4. If normal browser, curl, clone, DNS, or Preview access fails, do not skip connector checks.
5. Determine the effective status of any in-progress task before starting new work.

## Task selection

- Finish or repair an existing open task/PR before selecting a new task.
- Otherwise select the first eligible `OPEN` task whose dependencies are complete.
- Perform exactly one task per run.
- Never create duplicate branches or duplicate pull requests for the same task.
- Do not silently skip ahead in the queue.

## Worktree and branch discipline

- Start from a clean, fresh worktree based on current `origin/main`.
- Branch naming: `task/<task-id>-<short-slug>`.
- Keep unrelated changes out of the branch.
- Do not work directly on `main` except for repository bootstrap where no branch can yet exist.

## Implementation principles

- Follow `DESIGN.md` for every visual change.
- Follow `CONTENT.md` for approved public copy.
- Follow `PRODUCT_SPEC.md` for user journeys and calculations.
- Use Korean-first plain language on general-user surfaces.
- Keep general and professional experiences separated by URL.
- Do not claim exact results where only estimates are possible.
- Make formulas, assumptions, units, and limitations testable and explicit.
- Use animation only to explain state or guide the next action.
- Respect `prefers-reduced-motion`.

## Required validation

For every implementation task:

1. Run formatting and linting.
2. Run relevant unit and integration tests.
3. Run the production build.
4. Check the representative desktop flow.
5. Check the representative mobile flow.
6. Verify the user can find the feature from a real entry point.
7. Verify inputs, results, next actions, and error states.
8. Inspect Preview deployment when available.

For calculation tasks, add tests for:

- Units
- Boundary values
- Rounding
- Missing inputs
- Invalid inputs
- Assumption changes
- Monthly and annual consistency

## Failure handling

- Repair recoverable failures within the same run.
- If blocked by credentials, permissions, missing external configuration, or a non-recoverable platform failure, stop and document the exact blocker only after satisfying the mandatory connector invocation gate.
- Do not mark a task complete when validation is incomplete.
- Do not replace real checks with optimistic statements.

## Pull request protocol

A task branch should produce one pull request containing:

- Task ID and purpose
- Summary of changes
- Validation performed
- Screenshots or Preview notes for UI work
- Known limitations
- Queue update

Keep the PR as draft until implementation and local validation are complete. Mark ready only after checks and Preview verification are satisfactory.

## Merge policy

Merge only when:

- Required checks pass
- No unresolved review threads remain
- Preview is healthy or the deployment blocker is explicitly resolved
- The task meets its definition of done
- The branch is up to date enough to merge safely

### Preview-unavailable fallback

- Preview access is preferred but is not an absolute merge requirement.
- If the exact PR head passes all required GitHub checks, lint, typecheck, tests, production build, and diff review, and no security, calculation, routing, data-loss, or critical UX defect is found, an unavailable Preview caused only by Vercel limits, protection, DNS, timeout, connection reset, browser restrictions, or execution-environment limits must not stall the queue.
- In that case, record the failed Preview tools, errors, and retries, then squash merge according to the normal auto-merge policy.
- Immediately after merge, wait for the matching Production deployment, verify it is `READY`, and inspect the canonical web domain and changed route directly on the web.
- If Production reveals a real defect, stop new work and repair or roll back the same task before continuing.
- Never apply this fallback when the Preview or Production build failed because of application code.

Prefer squash merge for task branches.

## Queue maintenance

When a task is completed:

- Change its status to `DONE`.
- Record any newly discovered work as separate tasks.
- Do not bundle newly discovered work into the current task unless required for correctness or safety.

## Product priority

Core flow → accuracy → professional workspace → community/quotes → SEO → AdSense.

Security, data accuracy, critical failures, and unusable UX override this order.
