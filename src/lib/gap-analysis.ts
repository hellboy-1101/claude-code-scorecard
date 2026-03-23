import type { DiagnosisResult } from "./quiz-data";
import { getTypeReference } from "./type-references";
import type { TypeRelativeResult } from "./scorer";

// ─── Q6選択肢 → Claude Code機能の対応マップ ───

export const GAP_TO_FEATURE_MAP: Record<string, { label: string; features: string[] }> = {
  "project-init": {
    label: "新プロジェクトの初期設定を自動化したい",
    features: [
      "project-initializer スキル",
      "skill-resolver スキル",
      "CLAUDE.md テンプレート",
    ],
  },
  "test-review-commit": {
    label: "テスト→レビュー→コミットを一連の流れにしたい",
    features: [
      "/user:test コマンド",
      "/user:review コマンド",
      "/user:commit コマンド",
      "test-writer サブエージェント",
      "code-reviewer サブエージェント",
    ],
  },
  "auto-debug": {
    label: "バグが出たとき自動で原因特定→修正したい",
    features: [
      "debugger サブエージェント",
      "/user:debug コマンド",
      "/user:bugfix コマンド",
      "/user:build コマンド（ランタイム検証付き）",
    ],
  },
  "quality-check": {
    label: "環境の品質を定期的にチェックしたい",
    features: [
      "quality-auditor サブエージェント",
      "/user:audit コマンド",
      "adversarial-review スキル",
      "/weekly-eval コマンド（週次自己採点）",
    ],
  },
  "catchup": {
    label: "最新のClaude Code機能を常にキャッチアップしたい",
    features: [
      "Context7 MCP",
      "/weekly-eval コマンド（ベストプラクティス差分チェック）",
      "researcher サブエージェント",
    ],
  },
  "parallel": {
    label: "複数のClaude Codeインスタンスを並列で動かしたい",
    features: [
      "Git Worktree（cawエイリアス）",
      "Agent Teams",
      "claude-peers MCP",
    ],
  },
  "auto-quality": {
    label: "コードの品質を自動で維持したい",
    features: [
      "常駐ルール（rules/）",
      "PostToolUse フック",
      "/user:refactor コマンド",
      "dependency-check スキル",
    ],
  },
};

// ─── Q4機能ID → 表示名/説明マップ ───

export const FEATURE_INFO: Record<string, { name: string; description: string; prompt: string }> = {
  claudemd: {
    name: "CLAUDE.md",
    description: "プロジェクトの方針・ルール・コマンドを記載するグローバル設定ファイル",
    prompt: "~/.claude/CLAUDE.md を作成し、プロジェクトのルール・コマンド・ワークフローを記載してください。100行以内の目次に留め、詳細は docs/ に配置してください。",
  },
  planmode: {
    name: "Plan Mode（計画モード）",
    description: "実装前に計画を立て、承認を得てから実行するモード",
    prompt: "Shift+Tab でPlan Modeに切り替え、実装計画を立ててから作業を開始してください。",
  },
  commands: {
    name: "カスタムスラッシュコマンド",
    description: "~/.claude/commands/ に定義する独自のワークフローショートカット",
    prompt: "~/.claude/commands/ に review.md, test.md, commit.md, debug.md, status.md を作成し、日常の開発サイクルを自動化してください。",
  },
  agents: {
    name: "サブエージェント",
    description: "独立したコンテキストで動作する専門家エージェント",
    prompt: "~/.claude/agents/ に code-reviewer.md, test-writer.md, debugger.md, quality-auditor.md を作成してください。各エージェントにYAML frontmatter（name, description, tools, model）を記載します。",
  },
  skills: {
    name: "スキル（SKILL.md）",
    description: "トリガー条件に合致した時だけ読み込まれるClaude Codeの拡張機能",
    prompt: "~/.claude/skills/ にプロジェクト固有のスキルを作成してください。各スキルにはSKILL.mdファイルを配置し、description にトリガー条件を明記します。",
  },
  mcp: {
    name: "MCP（Model Context Protocol）",
    description: "外部ツールやサービスをClaude Codeに接続するプロトコル",
    prompt: "claude mcp add で Context7（ドキュメント取得）、Playwright（ブラウザ自動化）を追加してください。",
  },
  agentteams: {
    name: "Agent Teams",
    description: "複数のサブエージェントを連携させて大規模タスクを並列処理する機能",
    prompt: "CLAUDE_AGENT_TEAM 環境変数を設定し、Agent Teamsを有効化してください。Builder-Validatorパターンで品質を担保しながら並列実装できます。",
  },
  worktree: {
    name: "Git Worktree（並列開発）",
    description: "同一リポジトリの複数ブランチを同時に作業するための機能",
    prompt: "alias caw='claude --worktree' を ~/.zshrc に追加し、Git Worktreeで並列開発環境を構築してください。",
  },
  hooks: {
    name: "フック（hooks/）",
    description: "セッション開始/終了、ツール実行前後に自動実行されるスクリプト",
    prompt: "~/.claude/settings.json の hooks セクションに SessionStart（環境検証）と PostToolUse（品質チェック）フックを追加してください。",
  },
  featurelist: {
    name: "feature_list.json による進捗管理",
    description: "機能一覧とテスト手順を管理し、完了状態をバイナリで追跡するファイル",
    prompt: "プロジェクトルートに feature_list.json を作成し、各機能にid, name, passes（boolean）, test_steps（配列）を定義してください。/user:next コマンドで自動選定できます。",
  },
};

// ─── 改善提案の型 ───

export interface GapSuggestion {
  type: "knowledge" | "action" | "environment";
  title: string;
  description: string;
  prompt: string;
  priority: number;
}

// ─── 改善提案の生成 ───

export function generateGapSuggestions(
  diagnosis: DiagnosisResult,
  typeRelative: TypeRelativeResult | null,
): GapSuggestion[] {
  const suggestions: GapSuggestion[] = [];
  const ref = getTypeReference(diagnosis.primaryType);
  if (!ref) return suggestions;

  // 1. 知識ギャップ（最優先）
  for (const featureId of diagnosis.unknownFeatures) {
    const info = FEATURE_INFO[featureId];
    if (!info) continue;

    // このタイプで required or recommended な機能のみ提案
    // 機能IDとスコア項目の対応は完全一致しないが、関連性で判定
    const isRelevant = isFeatureRelevantToType(featureId, ref.items);
    if (!isRelevant) continue;

    suggestions.push({
      type: "knowledge",
      title: info.name,
      description: `${ref.typeName}に必要な機能ですが、まだ使ったことがないようです。${info.description}`,
      prompt: info.prompt,
      priority: 100,
    });
  }

  // 2. 行動ギャップ
  for (const gapId of diagnosis.actionGaps) {
    if (gapId === "all-done" || gapId === "not-yet") continue;
    const gapInfo = GAP_TO_FEATURE_MAP[gapId];
    if (!gapInfo) continue;

    // 知っている機能に関連するギャップのみ（知っているが使えていない）
    suggestions.push({
      type: "action",
      title: gapInfo.label,
      description: `以下の機能で実現できます`,
      prompt: gapInfo.features.map((f) => `- ${f}`).join("\n"),
      priority: 80,
    });
  }

  // 3. 環境ギャップ（環境データありの場合のみ）
  if (typeRelative) {
    for (const item of typeRelative.requiredItems) {
      if (item.score < 80) {
        suggestions.push({
          type: "environment",
          title: item.name,
          description: `${ref.typeName}の必須項目ですが、現在 ${item.score}/${item.max} 点です`,
          prompt: getEnvImprovementPrompt(item.name),
          priority: 60 + (80 - item.score),
        });
      }
    }
    for (const item of typeRelative.recommendedItems) {
      if (item.score < 80) {
        suggestions.push({
          type: "environment",
          title: item.name,
          description: `${ref.typeName}の推奨項目です。現在 ${item.score}/${item.max} 点`,
          prompt: getEnvImprovementPrompt(item.name),
          priority: 40 + (80 - item.score),
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.priority - a.priority);
}

// 機能IDがタイプのリファレンスに関連するかを判定
function isFeatureRelevantToType(
  featureId: string,
  items: Record<string, string>,
): boolean {
  const featureToItems: Record<string, string[]> = {
    claudemd: ["CLAUDE.md品質"],
    planmode: ["自動化レベル"],
    commands: ["スラッシュコマンド", "日常開発サイクルの完全性"],
    agents: ["サブエージェント活用"],
    skills: ["スキル数と多様性", "スキルアーキテクチャ"],
    mcp: ["MCP構成"],
    agentteams: ["並列開発"],
    worktree: ["並列開発"],
    hooks: ["フック構成"],
    featurelist: ["プロジェクト初期化フロー", "仕様書駆動開発", "セッション間引き継ぎ"],
  };

  const relatedItems = featureToItems[featureId] ?? [];
  return relatedItems.some(
    (itemName) => items[itemName] === "required" || items[itemName] === "recommended",
  );
}

// 環境改善プロンプト
function getEnvImprovementPrompt(itemName: string): string {
  const prompts: Record<string, string> = {
    "CLAUDE.md品質": "~/.claude/CLAUDE.md を作成し、コマンド・ルール・ワークフロー・リソース優先順位を記載してください。",
    "MCP構成": "claude mcp add で playwright, context7 を追加してください。",
    "フック構成": "settings.json の hooks セクションに SessionStart / PostToolUse フックを追加してください。",
    "PC間同期・環境管理": "~/.zshrc に alias ca='claude --auto' を追加してください。",
    "スキル数と多様性": "~/.claude/skills/ にプロジェクト固有のスキルを作成してください。",
    "スキルアーキテクチャ": "~/.claude/rules/ に coding-standards.md, security.md, testing-policy.md を作成してください。",
    "プラグイン活用": "claude plugin add で frontend-design, plugin-dev 等を追加してください。",
    "サブエージェント活用": "~/.claude/agents/ に code-reviewer.md, test-writer.md, debugger.md を作成してください。",
    "スラッシュコマンド": "~/.claude/commands/ に review.md, test.md, commit.md, debug.md を作成してください。",
    "プロジェクト初期化フロー": "project-initializer スキルを作成し、feature_list.json 生成フローを組み込んでください。",
    "日常開発サイクルの完全性": "next, test, review, commit, debug, refactor の各コマンドを作成してください。",
    "コンテキスト管理": "settings.json に AUTOCOMPACT / MAX_THINKING_TOKENS を設定してください。",
    "テスト・検証戦略": "testing-policy ルール、test-writer エージェント、adversarial-review スキルを追加してください。",
    "セキュリティ": "security ルール、dependency-check スキル、careful スキルを追加してください。",
    "品質自動強制": "PostToolUse フック、quality-enforcement ルール、audit コマンドを追加してください。",
    "デバッグ能力": "~/.claude/agents/debugger.md を作成し、debug / bugfix コマンドを追加してください。",
    "リファクタリング能力": "refactor コマンドと audit コマンドを作成してください。",
    "依存管理・メンテナンス": "dependency-check スキルを作成してください。",
    "セッション間引き継ぎ": "SessionStart フックに progress.md の自動表示を追加してください。",
    "ハーネスエンジニアリング準拠度": "feature_list.json + progress管理 + test/review/debugフローでハーネス5柱に準拠してください。",
    "仕様書駆動開発": "project-initializer スキルを作成し、ARCHITECTURE.md / feature_list.json 生成を組み込んでください。",
    "並列開発": "worktree エイリアス、claude-peers MCP を追加してください。",
    "エコシステム連携": "everything-claude-code をリファレンスに追加し、ecc-dispatcher スキルを作成してください。",
    "自動化レベル": "Auto Mode エイリアス、Plan Mode 設定、skill-resolver を導入してください。",
    "通信・遠隔": "claude-peers MCP を追加してください。",
  };
  return prompts[itemName] ?? `${itemName} の設定を改善してください。`;
}
