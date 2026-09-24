---
name: verify-scorecard
description: "Drive the Claude Code Scorecard (Claude Code Type) Next.js web UI the way a user does — launch, doctor, quiz/result flows via Playwright, capture evidence. Use when verifying scorecard UI behavior, diagnosis quiz, type detail pages, or result rendering."
---

# Verify Claude Code Scorecard

Project-local verification skill for **claude-code-scorecard** (`Claude Code Type`): a Japanese client-side Next.js quiz that diagnoses a "Claude Code" usage type, optionally scores an environment dump, and shows results. All diagnosis state lives in `sessionStorage` (key `diagnosisResult`); nothing is POSTed to a server.

Read `features/README.md` before driving. Prefer a mapped feature file over improvising selectors.

## Interview summary (ground truth)

| Axis | Answer |
|------|--------|
| **Surface** | Primary: web UI at `/`, `/diagnose`, `/result`, `/types/[typeId]`. Secondary: Storybook (`npm run storybook` → `:6006`) and Vitest browser tests via Storybook addon — use those for component isolation, not end-user proof. |
| **Run** | `npm run dev` (or helpers below). Default prod-like port for verification: **4310** on `127.0.0.1`. No env secrets, no auth, no seed DB. Requires Node 20 + `npm ci` (repo has `package-lock.json` and `packageManager: npm`). |
| **Drive** | **Playwright** (already a dependency). Recipe: helpers in `.cursor/skills/verify-scorecard/scripts/`. Prefer button/radio text and ARIA (`radiogroup` names `タイプ選択`, `関心領域の選択`) over CSS. |
| **Observe** | Full-page screenshots, `transcript.txt`, `result-meta.json` (parsed `sessionStorage`), URL path. |
| **Isolate** | Bind a private port (`VERIFY_SCORECARD_PORT`, default 4310). Do **not** drive a shared `:3000` instance you did not start. Browser `sessionStorage` is origin-scoped; concurrent runs need different ports/origins. |

## Launch

From the repo root:

```bash
.cursor/skills/verify-scorecard/scripts/launch.sh
```

- Starts `next dev` on `127.0.0.1:${VERIFY_SCORECARD_PORT:-4310}`.
- Writes `run/dev.pid`, `run/base_url.txt`, `run/port.txt`, and appends logs to `run/dev.log`.
- Ready when `GET $BASE_URL/` returns HTTP 200 (script polls up to ~30s).
- Optional overrides: `VERIFY_SCORECARD_PORT`, `VERIFY_SCORECARD_HOST`.

Manual equivalent:

```bash
PORT=4310 npm run dev -- -p 4310 -H 127.0.0.1
# Ready log: "✓ Ready" / Local: http://127.0.0.1:4310
```

Teardown: see **Cleanup** (never leave the verification `next` process running).

## Doctor

```bash
.cursor/skills/verify-scorecard/scripts/doctor.sh
```

Must pass before any Drive:

- Tracked `run/dev.pid` is alive.
- `GET $BASE_URL/` → 200.
- Home HTML contains `Claude Code` branding and a diagnosis CTA (`無料で診断する` or `診断を始める`).
- `package.json` name is `claude-code-scorecard`.

If doctor fails, stop driving; fix launch or free the port.

## Drive

Harness: **Playwright** (Chromium). Install browsers once if missing: `npx playwright install chromium`.

### One-shot mapped feature (diagnosis quiz → result)

```bash
node .cursor/skills/verify-scorecard/scripts/drive-diagnosis.mjs
```

This script:

1. Opens `$BASE_URL/` (from `run/base_url.txt` or `VERIFY_SCORECARD_BASE_URL`).
2. Clicks **無料で診断する** → `/diagnose`.
3. Answers Q1–Q4 (single-choice buttons by Japanese label), Q5 multi (`CLAUDE.md`, `Plan Mode`) then **N件選択して次へ**.
4. Confirms type with **このタイプで診断する**.
5. Selects interest radio under `radiogroup` **関心領域の選択**, clicks **次へ**.
6. On env step, clicks **スキップして診断へ →**.
7. Asserts `/result`, captures screenshots + `result-meta.json` from `sessionStorage.diagnosisResult`.

Stable handles used by the script and feature map:

| Step | Handle |
|------|--------|
| Home CTA | `getByRole('button', { name: '無料で診断する' })` |
| Header CTA | `getByRole('button', { name: '診断を始める' })` |
| Quiz choice | `getByRole('button', { name: '<choice text>' })` |
| Multi confirm | `getByRole('button', { name: /件選択して次へ\|スキップして次へ/ })` |
| Type radios | `getByRole('radiogroup', { name: 'タイプ選択' })` + radio `aria-label` like `Explorer（探索者）` |
| Confirm type | `getByRole('button', { name: 'このタイプで診断する' })` |
| Interest | `getByRole('radiogroup', { name: '関心領域の選択' })` |
| Skip env | `getByRole('button', { name: /スキップして診断へ/ })` |
| Env textarea | `#env-textarea` / label `環境データの貼り付け` |
| Type detail | navigate `/types/basic` (ids: `basic`, `specDriven`, `harness`, `multiAgent`, `academic`, `outcome`; display names Explorer/Architect/Engineer/Commander/Scholar/Visionary) |

Ad-hoc Playwright (repo root):

```bash
node -e '
import { chromium } from "playwright";
const b = await chromium.launch({headless:true});
const p = await b.newPage();
await p.goto("http://127.0.0.1:4310/");
console.log(await p.title());
await b.close();
'
```

Storybook is **not** the user path for diagnosis proof. Use it only when verifying a single UI component in isolation (`npm run storybook`).

## Evidence

Proof directory (survives cleanup):

`.cursor/skills/verify-scorecard/artifacts/<feature-id>/`

Standards:

- Exercise the real user path (`/` → `/diagnose` → `/result`), not by stuffing `sessionStorage` unless the feature file explicitly documents a deep-link precondition.
- Capture **action** screenshots (quiz mid-flow) and **result** state (`07-result.png`, `result-meta.json`).
- `result-meta.json` must show `formatVersion: 2`, a `selectedType` / `primaryType`, and `selectedInterest`.
- Side effects: browser-only — verify via `sessionStorage` and URL; no server rows. SocialProof may write `localStorage` diagnosis counts; do not treat that as required proof.
- Mocks: none required for the skip-env path. Env paste proof needs a realistic bulk-script dump string (see `features/env-input.md`).

`drive-diagnosis.mjs` writes at least:

- `01-home.png` … `08-result-data-tab.png`
- `transcript.txt`
- `result-meta.json`

## Cleanup

```bash
.cursor/skills/verify-scorecard/scripts/cleanup.sh
```

- Kills only the PID recorded in `run/dev.pid` and, if needed, the listener still bound to the recorded port for this app.
- Removes `run/dev.pid`, `run/base_url.txt`, `run/port.txt`.
- **Keeps** everything under `artifacts/` and does not delete `dev.log` (optional keep for debugging).
- Never `pkill -f next` globally.

After every failed iteration, run cleanup before re-launching so ports are not stranded.

## Helpers

All under `.cursor/skills/verify-scorecard/scripts/` (executable):

| Script | Invocation | Purpose |
|--------|------------|---------|
| `launch.sh` | `.cursor/skills/verify-scorecard/scripts/launch.sh` | Start isolated Next dev server |
| `doctor.sh` | `.cursor/skills/verify-scorecard/scripts/doctor.sh` | Read-only readiness check |
| `drive-diagnosis.mjs` | `node .cursor/skills/verify-scorecard/scripts/drive-diagnosis.mjs` | Prove diagnosis-quiz → result |
| `cleanup.sh` | `.cursor/skills/verify-scorecard/scripts/cleanup.sh` | Tear down launch PID/port |

## Feature map

See [`features/README.md`](features/README.md).
