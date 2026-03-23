import type { ParsedInput } from "./types";
import type { ScorecardResult } from "./types";

interface PromptSection {
  title: string;
  items: string[];
}

function hasContent(text: string): boolean {
  return !!text && text !== "none" && text !== "{}";
}

function generateRulesSection(input: ParsedInput): PromptSection | null {
  const existing = hasContent(input.rules)
    ? input.rules.split("\n").filter((l) => l.trim())
    : [];

  const recommended = [
    "coding-standards.md",
    "security-baseline.md",
    "testing-policy.md",
    "context-management.md",
    "planning-and-design.md",
    "git-workflow.md",
  ];

  const missing = recommended.filter(
    (r) => !existing.some((e) => e.includes(r.replace(".md", "")))
  );

  if (missing.length === 0) return null;

  return {
    title: "常駐ルールの作成",
    items: [
      "~/.claude/rules/ に以下のファイルを作成:",
      ...missing.map((m) => `- ${m}`),
    ],
  };
}

function generateAgentsSection(input: ParsedInput): PromptSection | null {
  const existing = hasContent(input.agents)
    ? input.agents.split("\n").filter((l) => l.trim())
    : [];

  const recommended = [
    "code-reviewer.md",
    "debugger.md",
    "test-writer.md",
    "quality-auditor.md",
    "doc-writer.md",
    "researcher.md",
  ];

  const missing = recommended.filter(
    (r) => !existing.some((e) => e.includes(r.replace(".md", "")))
  );

  if (missing.length === 0) return null;

  return {
    title: "サブエージェントの作成",
    items: [
      "~/.claude/agents/ に以下を作成:",
      ...missing.map((m) => `- ${m}`),
    ],
  };
}

function generateCommandsSection(input: ParsedInput): PromptSection | null {
  const existing = hasContent(input.commands)
    ? input.commands.split("\n").filter((l) => l.trim())
    : [];

  const recommended = [
    "status.md",
    "next.md",
    "review.md",
    "test.md",
    "commit.md",
    "debug.md",
    "bugfix.md",
    "audit.md",
    "refactor.md",
  ];

  const missing = recommended.filter(
    (r) => !existing.some((e) => e.includes(r.replace(".md", "")))
  );

  if (missing.length === 0) return null;

  return {
    title: "スラッシュコマンドの作成",
    items: [
      "~/.claude/commands/ に以下を作成:",
      ...missing.map((m) => `- ${m}`),
    ],
  };
}

function generateClaudeMdSection(input: ParsedInput): PromptSection | null {
  if (hasContent(input.claudemd)) return null;

  return {
    title: "CLAUDE.mdの作成",
    items: [
      "~/.claude/CLAUDE.md を作成し、以下を記載:",
      "- プロジェクトの概要と目的",
      "- 使用するコマンド（build, test, lint）",
      "- コーディング規約の要約",
      "- ワークフロー（日常開発サイクル）",
      "- リソース優先順位",
    ],
  };
}

function generateHooksSection(input: ParsedInput): PromptSection | null {
  const existing = hasContent(input.hooks)
    ? input.hooks.split("\n").filter((l) => l.trim())
    : [];

  if (existing.length >= 3) return null;

  return {
    title: "フックの設定",
    items: [
      "settings.json に以下のフックを追加:",
      "- SessionStart: 環境検証とプログレス自動読み込み",
      "- PostToolUse (Write/Edit): 自動フォーマット実行",
      "- SessionEnd: プログレス自動保存",
    ],
  };
}

function generateMcpSection(input: ParsedInput): PromptSection | null {
  const mcp = input.mcp;
  const suggestions: string[] = [];

  if (!mcp || !mcp.includes("playwright")) {
    suggestions.push("- Playwright MCP（ブラウザ自動テスト）");
  }
  if (!mcp || !mcp.includes("context7")) {
    suggestions.push("- Context7 MCP（ライブラリドキュメント取得）");
  }
  if (!mcp || !mcp.includes("claude-peers")) {
    suggestions.push("- claude-peers MCP（マルチインスタンス協調）");
  }

  if (suggestions.length === 0) return null;

  return {
    title: "MCP接続の追加",
    items: [
      "以下のMCPサーバーを接続:",
      ...suggestions,
    ],
  };
}

export function generateTuningPrompt(
  input: ParsedInput | null,
  primaryType: string,
  _scorecardResult: ScorecardResult | null
): string {
  if (!input) {
    return generateTypeOnlyPrompt(primaryType);
  }

  const sections: PromptSection[] = [];

  const claudeMd = generateClaudeMdSection(input);
  if (claudeMd) sections.push(claudeMd);

  const rules = generateRulesSection(input);
  if (rules) sections.push(rules);

  const agents = generateAgentsSection(input);
  if (agents) sections.push(agents);

  const commands = generateCommandsSection(input);
  if (commands) sections.push(commands);

  const hooks = generateHooksSection(input);
  if (hooks) sections.push(hooks);

  const mcp = generateMcpSection(input);
  if (mcp) sections.push(mcp);

  if (sections.length === 0) {
    return "環境は十分に最適化されています。現在の設定を維持してください。";
  }

  let prompt =
    "以下の改善を順番に実行してください。各ステップ完了後に結果を報告してください。\n\n";

  sections.forEach((section, i) => {
    prompt += `## ${i + 1}. ${section.title}\n`;
    prompt += section.items.join("\n") + "\n\n";
  });

  prompt += "## 検証\n";
  prompt += "ls ~/.claude/rules/ ~/.claude/agents/ ~/.claude/commands/\n";

  return prompt;
}

function generateTypeOnlyPrompt(primaryType: string): string {
  const typePrompts: Record<string, string> = {
    explorer: `以下の改善を順番に実行してください。各ステップ完了後に結果を報告してください。

## 1. CLAUDE.mdの作成
~/.claude/CLAUDE.md を作成し、以下を記載:
- プロジェクトの概要と目的
- 使用するコマンド（build, test, lint）
- 基本的なコーディング規約

## 2. 最初のルールファイル
~/.claude/rules/ に以下を作成:
- coding-standards.md（基本的なコーディング規約）

## 検証
cat ~/.claude/CLAUDE.md && ls ~/.claude/rules/`,

    architect: `以下の改善を順番に実行してください。各ステップ完了後に結果を報告してください。

## 1. 常駐ルールの作成
~/.claude/rules/ に以下のファイルを作成:
- coding-standards.md（コーディング規約）
- security-baseline.md（セキュリティ基準）
- testing-policy.md（テスト方針）

## 2. 基本コマンドの作成
~/.claude/commands/ に以下を作成:
- review.md（コードレビュー）
- test.md（テスト実行）

## 検証
ls ~/.claude/rules/ ~/.claude/commands/`,

    engineer: `以下の改善を順番に実行してください。各ステップ完了後に結果を報告してください。

## 1. サブエージェントの作成
~/.claude/agents/ に以下を作成:
- code-reviewer.md
- debugger.md
- test-writer.md
- quality-auditor.md

## 2. ワークフローコマンド
~/.claude/commands/ に以下を作成:
- status.md, next.md, commit.md
- audit.md, refactor.md

## 3. フック設定
settings.json に SessionStart / PostToolUse / SessionEnd フックを追加

## 検証
ls ~/.claude/agents/ ~/.claude/commands/`,

    commander: `以下の改善を順番に実行してください。各ステップ完了後に結果を報告してください。

## 1. Agent Teams環境の構築
- settings.json に CLAUDE_AGENT_TEAM 環境変数を設定
- Worktreeエイリアスを ~/.zshrc に追加

## 2. claude-peers MCPの接続
claude mcp add claude-peers -- npx @anthropic-ai/claude-peers

## 3. 並列開発ワークフロー
~/.claude/commands/ に以下を作成:
- sprint.md（並列スプリント実行）

## 検証
claude mcp list && ls ~/.claude/commands/`,

    scholar: `以下の改善を順番に実行してください。各ステップ完了後に結果を報告してください。

## 1. 品質ゲートの構築
~/.claude/rules/ に以下を作成:
- testing-policy.md（再現性重視のテスト方針）
- quality-enforcement.md（品質強制ルール）

## 2. 検証エージェント
~/.claude/agents/ に以下を作成:
- researcher.md（文献調査・既存実装調査）
- quality-auditor.md（品質監査）

## 3. adversarial-reviewスキルの導入
敵対的レビューで品質の上限を引き上げる

## 検証
ls ~/.claude/rules/ ~/.claude/agents/`,

    visionary: `以下の改善を順番に実行してください。各ステップ完了後に結果を報告してください。

## 1. 成果指標の定義
CLAUDE.md に成果指標（KPI）セクションを追加:
- エージェントの実行時間
- タスク完了率
- コード品質スコアの推移

## 2. 自律エージェント環境
- Agent Teams + Worktree の有効化
- claude-peers MCPの接続

## 3. Engineer基盤の導入
品質管理の安定性のため、常駐ルールとサブエージェントを整備

## 検証
claude mcp list && ls ~/.claude/rules/ ~/.claude/agents/`,
  };

  return typePrompts[primaryType] || typePrompts.explorer;
}
