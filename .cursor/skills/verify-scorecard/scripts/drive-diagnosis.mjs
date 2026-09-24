#!/usr/bin/env node
/**
 * Drive the diagnosis-quiz feature end-to-end with Playwright.
 * Usage (from repo root):
 *   node .cursor/skills/verify-scorecard/scripts/drive-diagnosis.mjs
 * Env:
 *   VERIFY_SCORECARD_BASE_URL  (default: contents of run/base_url.txt or http://127.0.0.1:4310)
 *   VERIFY_SCORECARD_ARTIFACT_DIR (default: .cursor/skills/verify-scorecard/artifacts/diagnosis-quiz)
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, "..");
const RUN_DIR = path.join(SKILL_DIR, "run");

function resolveBaseUrl() {
  if (process.env.VERIFY_SCORECARD_BASE_URL) return process.env.VERIFY_SCORECARD_BASE_URL;
  const f = path.join(RUN_DIR, "base_url.txt");
  if (fs.existsSync(f)) return fs.readFileSync(f, "utf8").trim();
  return "http://127.0.0.1:4310";
}

const BASE_URL = resolveBaseUrl();
const ARTIFACT_DIR =
  process.env.VERIFY_SCORECARD_ARTIFACT_DIR ||
  path.join(SKILL_DIR, "artifacts", "diagnosis-quiz");

fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const transcript = [];
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  transcript.push(line);
  console.log(line);
}

async function clickChoiceByText(page, text) {
  // Quiz choices are plain buttons whose visible text includes the choice label.
  const btn = page.getByRole("button", { name: text });
  await btn.first().waitFor({ state: "visible", timeout: 15000 });
  await btn.first().click();
}

async function main() {
  log(`baseUrl=${BASE_URL}`);
  log(`artifactDir=${ARTIFACT_DIR}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: "ja-JP",
  });
  const page = await context.newPage();

  try {
    // --- Home ---
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /Claude Code Type/ }).first().waitFor();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "01-home.png"), fullPage: true });
    log("home loaded; screenshot 01-home.png");

    // Prefer the hero CTA
    const startCta = page.getByRole("button", { name: "無料で診断する" });
    await startCta.waitFor({ state: "visible" });
    await startCta.click();
    await page.waitForURL("**/diagnose");
    log("navigated to /diagnose via 無料で診断する");

    // --- Q1 single ---
    await page.getByText("Q1.").waitFor({ timeout: 15000 });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "02-q1.png"), fullPage: true });
    await clickChoiceByText(page, "個人プロジェクトを効率的に作りたい");
    log("answered Q1: Explorer-leaning choice");

    // --- Q2 ---
    await page.getByText("Q2.").waitFor({ timeout: 15000 });
    await clickChoiceByText(
      page,
      "何から始めればいいかわからない。設計が曖昧なまま作り始めてしまう",
    );
    log("answered Q2");

    // --- Q3 ---
    await page.getByText("Q3.").waitFor({ timeout: 15000 });
    await clickChoiceByText(page, "1人で小さなツール・スクリプトを作る");
    log("answered Q3");

    // --- Q4 ---
    await page.getByText("Q4.").waitFor({ timeout: 15000 });
    await clickChoiceByText(page, "最小限でいい。すぐコードを書き始めたい");
    log("answered Q4");

    // --- Q5 multi ---
    await page.getByText("Q5.").waitFor({ timeout: 15000 });
    await page.getByRole("button", { name: "CLAUDE.md" }).click();
    await page.getByRole("button", { name: "Plan Mode" }).click();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "03-q5-multi.png"), fullPage: true });
    await page.getByRole("button", { name: /件選択して次へ/ }).click();
    log("answered Q5 multi and confirmed");

    // --- Type selector ---
    await page.getByText("あなたの志向タイプ").or(page.getByText("選択したタイプ")).waitFor({
      timeout: 20000,
    });
    await page.getByRole("radiogroup", { name: "タイプ選択" }).waitFor();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "04-type-selector.png"), fullPage: true });
    // Accept inferred type
    await page.getByRole("button", { name: "このタイプで診断する" }).click();
    log("confirmed type selection");

    // --- Interest ---
    await page.getByRole("radiogroup", { name: "関心領域の選択" }).waitFor({ timeout: 15000 });
    await page
      .getByRole("radio", { name: /プロジェクトの初期設定を自動化したい/ })
      .click();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "05-interest.png"), fullPage: true });
    await page.getByRole("button", { name: "次へ" }).click();
    log("selected interest and continued");

    // --- Env input: skip ---
    await page.getByRole("heading", { name: "環境データを取得" }).waitFor({ timeout: 15000 });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "06-env-input.png"), fullPage: true });
    await page.getByRole("button", { name: /スキップして診断へ/ }).click();
    log("skipped env input");

    // --- Result ---
    await page.waitForURL("**/result", { timeout: 20000 });
    // Wait for hero type name (one of the known English type names)
    await page
      .getByText(/Explorer|Architect|Engineer|Orchestrator|Scholar|Optimizer/)
      .first()
      .waitFor({ timeout: 20000 });
    // Allow hero animation settle
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "07-result.png"), fullPage: true });

    const stored = await page.evaluate(() => sessionStorage.getItem("diagnosisResult"));
    if (!stored) throw new Error("sessionStorage.diagnosisResult missing on result page");
    const parsed = JSON.parse(stored);
    if (parsed.formatVersion !== 2 || !parsed.diagnosis) {
      throw new Error("diagnosisResult payload invalid");
    }

    const resultMeta = {
      url: page.url(),
      primaryType: parsed.diagnosis.primaryType,
      selectedType: parsed.diagnosis.selectedType || parsed.diagnosis.primaryType,
      selectedInterest: parsed.selectedInterest,
      scores: parsed.diagnosis.scores,
      knownFeatures: parsed.diagnosis.knownFeatures,
      formatVersion: parsed.formatVersion,
    };
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, "result-meta.json"),
      JSON.stringify(resultMeta, null, 2),
    );
    log(`result ready: selectedType=${resultMeta.selectedType} interest=${resultMeta.selectedInterest}`);

    // Tab: 詳細データ visible
    await page.getByRole("tab", { name: "詳細データ" }).click();
    await page.getByText("スコア分布").waitFor();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "08-result-data-tab.png"), fullPage: true });
    log("opened 詳細データ tab");

    fs.writeFileSync(path.join(ARTIFACT_DIR, "transcript.txt"), transcript.join("\n") + "\n");
    log("PROOF OK — diagnosis-quiz driven end-to-end");
  } catch (err) {
    const failShot = path.join(ARTIFACT_DIR, "FAIL.png");
    try {
      await page.screenshot({ path: failShot, fullPage: true });
    } catch {}
    transcript.push(`ERROR: ${err?.stack || err}`);
    fs.writeFileSync(path.join(ARTIFACT_DIR, "transcript.txt"), transcript.join("\n") + "\n");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
