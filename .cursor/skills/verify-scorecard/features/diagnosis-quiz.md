# Diagnosis quiz

Diagnosis quiz walks the user through five questions, a type confirmation, an interest choice, and an optional env paste, then stores `diagnosisResult` in `sessionStorage` and opens `/result`.

## Sub-features

- `quiz-q1-q4` answers four single-select questions by clicking a choice button.
- `quiz-q5-multi` toggles feature checkboxes and confirms with **N件選択して次へ** or **スキップして次へ**.
- `quiz-back` returns to the previous question or home via **← 戻る**.
- `type-confirm` shows inferred type under **あなたの志向タイプ** and confirms with **このタイプで診断する**.
- `interest-select` chooses one option in radiogroup **関心領域の選択** and continues with **次へ**.
- `env-skip` reaches result without env data via **スキップして診断へ →**.
- `progress` shows `ProgressBar` / header counter advancing toward `8` total steps.

## How to get to it (user POV)

- From home, choose **無料で診断する** or **診断を始める**.
- Open `/diagnose` directly.
- From `/result` with missing/invalid storage, the app redirects here.
- From result header, choose **もう一度診断**.

## Driving it with Playwright

Preconditions:

- App is healthy at the launched base URL.
- Doctor passed.
- Prefer the shipped helper for the full path: `node .cursor/skills/verify-scorecard/scripts/drive-diagnosis.mjs`.

- **Enter quiz.** From `/`, click **無料で診断する**. Expect `/diagnose` and `Q1. Claude Codeで最も実現したいことは？`.
- **Answer Q1–Q4.** Click choice buttons by exact Japanese text, e.g. Q1 `個人プロジェクトを効率的に作りたい`. After each click, wait for the next `Qn.` heading (animation ~350ms).
- **Answer Q5.** Click `CLAUDE.md` and `Plan Mode`, then `getByRole('button', { name: /件選択して次へ/ })`.
- **Confirm type.** Wait for radiogroup **タイプ選択**. Click **このタイプで診断する** (or first select another radio with `aria-label` like `Architect（設計者）`).
- **Select interest.** In radiogroup **関心領域の選択**, click radio matching `プロジェクトの初期設定を自動化したい`, then **次へ**.
- **Skip env.** On heading **環境データを取得**, click **スキップして診断へ →**.
- **Land on result.** URL is `/result`. `sessionStorage.diagnosisResult` parses with `formatVersion === 2`.
- **Proof.** Use artifacts from the helper under `artifacts/diagnosis-quiz/` (`07-result.png`, `result-meta.json`, `transcript.txt`). `result-meta.json` must include `selectedType` and `selectedInterest`.

## Gotchas

- Single-select advances automatically after a short delay; do not double-click.
- Q5 confirm label changes with selection count (`スキップして次へ` when empty).
- `/result` without valid `sessionStorage` immediately redirects back to `/diagnose` — that is not a quiz failure.
- Type ids in storage are English keys (`basic`, `specDriven`, …); UI shows names like `Explorer`.
- Framer Motion transitions can race strict `networkidle` waits; prefer role/text waits.
