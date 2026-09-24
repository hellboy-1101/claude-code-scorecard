# Claude Code Scorecard verification map

This directory is the maintained source for verifying the user-facing behavior of **Claude Code Type** (claude-code-scorecard). Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-scorecard/scripts/launch.sh` (default `http://127.0.0.1:4310`).
- Run `.cursor/skills/verify-scorecard/scripts/doctor.sh` and require a 200 home page with Claude Code branding and a diagnosis CTA.
- Never drive an instance that was not started by this verification run (do not hijack a user's `:3000` session).
- Prefer a fresh browser context so `sessionStorage` / `localStorage` from prior runs do not leak into proof.
- Chromium via Playwright must be installed (`npx playwright install chromium`).

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- Prefer ARIA roles, accessible names, and exact Japanese button labels over CSS selectors or DOM position.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through Playwright as shown in each feature file, or via `node .cursor/skills/verify-scorecard/scripts/drive-diagnosis.mjs` for the full quiz path.
- Cleanup tears down the Next process only; proof artifacts under `artifacts/` stay.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes screenshots with the app identity visible (`Claude Code Type` header) and, for diagnosis completion, `result-meta.json` from `sessionStorage.diagnosisResult`.
- Mutation proof for diagnosis is the `/result` URL plus a valid `formatVersion: 2` payload.
- Record the feature ID and entry point used with every artifact directory name.
- Report an unreachable path with the attempted selector/URL and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with Playwright` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command/selector and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Home landing](./home-landing.md) covers hero CTAs, type card grid, and navigation into diagnosis or type detail.
- [Diagnosis quiz](./diagnosis-quiz.md) covers the 5-question quiz, type confirmation, interest selection, and skip-to-result path.
- [Env input](./env-input.md) covers pasting bulk environment output versus skipping.
- [Result page](./result-page.md) covers hero, tabs, share/retry actions, and related-type links.
- [Type detail](./type-detail.md) covers `/types/[typeId]` overview tabs and start-diagnosis CTA.
