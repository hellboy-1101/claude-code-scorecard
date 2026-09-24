# Result page

The result page presents the diagnosed Claude Code type, tabbed explanations and suggestions, optional environment scoring, and actions to share or retry.

## Sub-features

- `result-hero` shows the primary type English name (e.g. `Explorer`) on a colored hero with avatar.
- `result-tabs` switches **タイプ解説**, **改善提案**, optional **環境評価**, and **詳細データ**.
- `result-share` copies a summary via **結果を共有** (clipboard).
- `result-retry` returns to `/diagnose` via **もう一度診断**.
- `result-related` links to other types under **関連タイプ**.
- `result-guard` redirects to `/diagnose` when `sessionStorage.diagnosisResult` is missing or not `formatVersion: 2`.

## How to get to it (user POV)

- Finish the diagnosis flow (skip or submit env) so the app navigates to `/result`.
- Refresh `/result` only while the same tab still has valid `sessionStorage`.

## Driving it with Playwright

Preconditions:

- Complete diagnosis-quiz through env skip (or run `drive-diagnosis.mjs`).
- URL is `/result` with valid storage.

- **Hero visible.** Expect primary type name text such as `Explorer` / `Architect` / … and Japanese name nearby.
- **Open 詳細データ.** Click `getByRole('tab', { name: '詳細データ' })`. Expect heading **スコア分布** and per-type point rows.
- **Open タイプ解説.** Click tab **タイプ解説**. Expect type description content.
- **Related type.** Click a related-type button (e.g. name matching `Architect`) under **関連タイプ**. URL becomes `/types/<id>`.
- **Retry.** Click **もう一度診断**. URL becomes `/diagnose`.
- **Proof.** `artifacts/diagnosis-quiz/07-result.png` (or `artifacts/result-page/hero.png`) plus `result-meta.json` with `formatVersion: 2`, `selectedType`, and `scores`.

## Gotchas

- Opening `/result` cold without storage is not a bug — it redirects to diagnose.
- **環境評価** tab exists only when env data was submitted.
- Share uses `navigator.clipboard`; headless may need clipboard permissions — do not fail the whole feature if share is blocked, but report it.
- Hero uses entrance animations; wait ~1s or for stable text before screenshots.
