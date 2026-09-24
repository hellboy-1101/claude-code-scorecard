# Env input

Env input lets the user paste the output of the on-page bulk shell script so the result page can score their Claude Code environment, or skip to a type-only result.

## Sub-features

- `env-script-visible` shows the bulk script in a monospace block with a copy control.
- `env-paste` accepts text in textarea `#env-textarea` (accessible name **環境データの貼り付け**).
- `env-submit` enables **次へ** only when the textarea is non-empty and navigates to `/result` with `scorecardResult` populated.
- `env-skip` navigates to `/result` with `envInput: null` via **スキップして診断へ →**.

## How to get to it (user POV)

- Complete the quiz, type confirm, and interest steps on `/diagnose` until **環境データを取得** appears.
- There is no deep link; prior steps must have produced in-memory diagnosis state on the diagnose page.

## Driving it with Playwright

Preconditions:

- Reach the env step via the diagnosis-quiz path (interest **次へ** already clicked).
- Heading **環境データを取得** is visible.

- **Skip path.** Click `getByRole('button', { name: /スキップして診断へ/ })`. Expect `/result` and `result-meta` / storage with `envInput` null and no environment tab requirement.
- **Paste path.** Fill `#env-textarea` with a multi-line dump that includes recognizable Claude Code config markers (see `src/lib/bulk-script.ts` / parser expectations). Click **次へ**. Expect `/result` and result tabs including **環境評価**.
- **Copy control.** Click the copy button over the script block; optional — verify clipboard only if the harness grants clipboard permissions.
- **Proof.** For skip: `artifacts/env-input/skipped-result.png` plus storage showing null env. For paste: screenshot of **環境評価** tab and a non-null `scorecardResult` in storage.

## Gotchas

- **次へ** stays disabled while the textarea is empty/whitespace; use skip instead of forcing enablement.
- Invalid paste still navigates; parser may yield sparse scores — assert structure, not a specific grade, unless using a golden fixture.
- Do not treat Storybook EnvInput stories as user-path proof.
