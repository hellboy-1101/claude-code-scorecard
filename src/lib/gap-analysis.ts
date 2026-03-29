import type { DiagnosisResult } from "./quiz-data";
import { getTypeReference } from "./type-references";
import type { TypeRelativeResult } from "./scorer";
import type { ParsedInput } from "./types";

// ─── Interest → Feature map (Layer 1) ───

export const INTEREST_TO_FEATURES: Record<string, { label: string; features: string[] }> = {
  "project-init": {
    label: "プロジェクトの初期設定を自動化したい",
    features: [
      "project-initializer スキル",
      "skill-resolver スキル",
      "CLAUDE.md テンプレート",
      "feature_list.json",
    ],
  },
  "workflow": {
    label: "テスト→レビュー→コミットのワークフローを整えたい",
    features: [
      "/user:test + test-writer サブエージェント",
      "/user:review + code-reviewer サブエージェント",
      "/user:commit コマンド",
      "PostToolUse フック",
    ],
  },
  "debug": {
    label: "バグの自動検出・修正を導入したい",
    features: [
      "debugger サブエージェント",
      "/user:debug コマンド",
      "/user:bugfix コマンド",
      "/user:build コマンド",
      "CLAUDE.md 品質検証ルール",
    ],
  },
  "quality": {
    label: "コードの品質を自動で維持したい",
    features: [
      "常駐ルール（rules/）",
      "adversarial-review スキル",
      "quality-auditor + /user:audit コマンド",
      "/user:refactor コマンド",
      "dependency-check スキル",
    ],
  },
  "parallel": {
    label: "複数のAIインスタンスを並列で動かしたい",
    features: [
      "Git Worktree（cawエイリアス）",
      "Agent Teams",
      "claude-peers MCP",
    ],
  },
  "catchup": {
    label: "最新のClaude Code機能や設定を常にキャッチアップしたい",
    features: [
      "Context7 MCP",
      "/weekly-eval コマンド",
      "researcher サブエージェント",
    ],
  },
  "general": {
    label: "全体的に底上げしたい",
    features: [],
  },
};

// ─── Feature info map for knowledge gap descriptions ───

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
  automode: {
    name: "Auto Mode / /effort",
    description: "Shift+Tabで安全な自動操作を有効化。/effortでlow/medium/highの推論レベルを調整",
    prompt: "Shift+Tab で Auto Mode を有効化し、/effort で推論レベルを調整してください。Plan Mode との組み合わせで効率的な作業フローを構築できます。",
  },
  swarm: {
    name: "Agent Teams（Swarm Mode）",
    description: "複数のサブエージェントを公式にチーム編成し、@mentionsで直接通信させる並列開発機能",
    prompt: "Agent TeamsでSwarm Modeを有効化し、チームリードとスペシャリストの役割を定義してください。isolation: worktreeで各エージェントに独立worktreeを割り当てられます。",
  },
  cloudtasks: {
    name: "クラウドスケジュールタスク / /loop",
    description: "/loopで定期実行、クラウドスケジュールタスクでローカルCLI不要の自律実行を実現",
    prompt: "/loop でPR監視やデプロイチェックの定期実行を設定してください。クラウドスケジュールタスクでローカルCLI不要の自律実行も可能です。",
  },
  marketplace: {
    name: "Skills Marketplace",
    description: "コミュニティ製150+スキルを探索・導入できるマーケットプレイス",
    prompt: "Skills Marketplaceでコミュニティ製スキルを探索し、プロジェクトに適したスキルを導入してください。marketplace.jsonでチーム独自のマーケットプレイスも構築できます。",
  },
};

// ─── Suggestion types ───

export interface GapSuggestion {
  type: "interest" | "knowledge" | "environment";
  title: string;
  description: string;
  prompt: string;
  priority: number;
}

// ─── ParsedEnvironment: structured counts from raw ParsedInput ───

interface ParsedEnvironment {
  rules: string[];
  skills: string[];
  agents: string[];
  commands: string[];
  hooks: string[];
  mcp: { name: string; connected: boolean }[];
  plugins: string[];
  claudeMd: string;
  zshrc: string[];
}

function extractLines(text: string): string[] {
  if (!text || text === "none" || text === "{}") return [];
  return text.split("\n").filter((l) => l.trim().length > 0);
}

function parsedInputToEnv(input: ParsedInput): ParsedEnvironment {
  const mcpLines = extractLines(input.mcp);
  const mcp = mcpLines.map((line) => ({
    name: line.trim(),
    connected: /connected/i.test(line),
  }));

  return {
    rules: extractLines(input.rules),
    skills: extractLines(input.skills),
    agents: extractLines(input.agents),
    commands: extractLines(input.commands),
    hooks: extractLines(input.hooks),
    mcp,
    plugins: extractLines(input.plugins),
    claudeMd: input.claudemd || "",
    zshrc: extractLines(input.zshrc),
  };
}

// ─── inferActualType: v3 spec scoring ───

export type Confidence = "high" | "medium" | "low";

export interface InferredType {
  actualType: string;
  confidence: Confidence;
  evidence: string[];
}

function hasText(text: string, ...patterns: string[]): boolean {
  const lower = text.toLowerCase();
  return patterns.some((p) => lower.includes(p.toLowerCase()));
}

function hasItem(items: string[], ...patterns: string[]): boolean {
  return items.some((item) => {
    const lower = item.toLowerCase();
    return patterns.some((p) => lower.includes(p.toLowerCase()));
  });
}

export function inferActualType(input: ParsedInput): InferredType {
  const env = parsedInputToEnv(input);
  const evidence: string[] = [];

  const scores: Record<string, number> = {
    basic: 0, specDriven: 0, harness: 0,
    multiAgent: 0, academic: 0, outcome: 0,
  };

  // === 基盤要素 ===
  const ruleCount = env.rules.length;
  const skillCount = env.skills.length;
  const agentCount = env.agents.length;
  const commandCount = env.commands.length;
  const hookCount = env.hooks.length;
  const mcpConnected = env.mcp.filter((m) => m.connected).length;

  // === CLAUDE.md の質的分析 ===
  const claudeMd = env.claudeMd;
  const hasWorkflow = hasText(claudeMd, "ワークフロー", "workflow");
  const hasQualityRules = hasText(claudeMd, "品質検証", "quality");
  const hasFivePillars = hasText(claudeMd, "5つの柱", "ハーネス", "harness");
  const hasResourcePriority = hasText(claudeMd, "リソース優先", "priority");

  // === 特定スキル・エージェントの存在 ===
  const hasProjectInitializer = hasItem(env.skills, "project-initializer");
  const hasSkillResolver = hasItem(env.skills, "skill-resolver");
  const hasDebugger = hasItem(env.agents, "debugger");
  const hasAdversarialReview = hasItem(env.skills, "adversarial");
  const hasDependencyCheck = hasItem(env.skills, "dependency");
  const hasResearcher = hasItem(env.agents, "researcher");
  const hasEccDispatcher = hasItem(env.skills, "ecc-dispatcher");

  // === 並列・チーム機能 ===
  const hasWorktree = hasItem(env.zshrc, "worktree", "caw");
  const hasAgentTeams = hasItem(env.zshrc, "AGENT_TEAMS");

  // === Type 1: Basic ===
  if (ruleCount <= 2 && skillCount <= 2 && agentCount <= 1 && commandCount <= 3) {
    scores.basic += 10;
    evidence.push("基本構成のみ（ルール少数、スキル少数）");
  }
  if (!hasWorkflow && !hasQualityRules) {
    scores.basic += 3;
  }

  // === Type 2: Spec-Driven ===
  if (hasProjectInitializer) {
    scores.specDriven += 4;
    evidence.push("project-initializer スキルあり");
  }
  if (commandCount >= 3 && commandCount < 10) {
    scores.specDriven += 3;
  }
  if (ruleCount >= 3 && ruleCount < 7) {
    scores.specDriven += 3;
  }

  // === Type 3: Harness ===
  if (ruleCount >= 5) {
    scores.harness += 3;
    evidence.push(`常駐ルール ${ruleCount} 件`);
  }
  if (skillCount >= 8) {
    scores.harness += 3;
    evidence.push(`スキル ${skillCount} 件`);
  }
  if (agentCount >= 5) {
    scores.harness += 3;
    evidence.push(`エージェント ${agentCount} 件`);
  }
  if (commandCount >= 10) {
    scores.harness += 3;
    evidence.push(`コマンド ${commandCount} 件`);
  }
  if (hookCount >= 4) {
    scores.harness += 3;
    evidence.push(`フック ${hookCount} 件`);
  }
  if (hasFivePillars) {
    scores.harness += 3;
    evidence.push("ハーネスエンジニアリング5つの柱への言及あり");
  }
  if (hasQualityRules) scores.harness += 2;
  if (hasWorkflow) scores.harness += 2;
  if (hasResourcePriority) scores.harness += 2;
  if (hasProjectInitializer && hasSkillResolver) {
    scores.harness += 3;
    evidence.push("project-initializer + skill-resolver の組み合わせ");
  }
  if (hasDebugger && hasAdversarialReview && hasDependencyCheck) {
    scores.harness += 3;
    evidence.push("debugger + adversarial-review + dependency-check の品質三点セット");
  }
  if (hasEccDispatcher) {
    scores.harness += 2;
    evidence.push("ecc-dispatcher スキルあり");
  }

  // === Type 4: Multi-Agent ===
  if (agentCount >= 3) {
    scores.multiAgent += 3;
  }
  if (hasItem(env.skills, "swarm", "agent-team")) {
    scores.multiAgent += 3;
    evidence.push("Swarm Mode / Agent Teams スキルあり");
  }
  if (hasText(claudeMd, "isolation", "--channels", "remote-control")) {
    scores.multiAgent += 3;
    evidence.push("並列・遠隔制御の設定あり");
  }
  if (hasAgentTeams) {
    scores.multiAgent += 5;
    evidence.push("Agent Teams 環境変数あり");
  }
  if (hasWorktree) {
    scores.multiAgent += 4;
    evidence.push("Worktree エイリアスあり");
  }
  if (mcpConnected >= 3) {
    scores.multiAgent += 2;
  }

  // === Type 5: Academic ===
  if (hasResearcher) {
    scores.academic += 5;
    evidence.push("researcher エージェントあり");
  }

  // === Type 6: Outcome ===
  if (hasAgentTeams && agentCount >= 5 && commandCount >= 10) {
    scores.outcome += 5;
  }
  if (hasWorktree && hookCount >= 4) {
    scores.outcome += 3;
  }
  if (hasWorkflow && hasQualityRules) {
    scores.outcome += 3;
  }
  if (hasText(claudeMd, "kpi", "KPI", "成果指標", "メトリクス")) {
    scores.outcome += 4;
    evidence.push("KPI/成果指標への言及あり");
  }
  if (hasText(claudeMd, "cloud schedule", "cron", "/loop")) {
    scores.outcome += 3;
    evidence.push("クラウドスケジュール/自律実行の設定あり");
  }

  // 最もスコアが高いタイプを選択
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topType = sorted[0][0];
  const topScore = sorted[0][1];
  const secondScore = sorted[1][1];

  // 確信度判定
  let confidence: Confidence;
  if (topScore >= 15 && topScore - secondScore >= 5) confidence = "high";
  else if (topScore >= 8) confidence = "medium";
  else confidence = "low";

  return { actualType: topType, confidence, evidence };
}

// ─── compareTypes: AlignmentPattern ───

export type AlignmentPattern = "aligned" | "aspiring" | "underutilized";

export interface TypeComparison {
  pattern: AlignmentPattern;
  evaluationType: string;
  message: string;
}

const TYPE_NAMES: Record<string, string> = {
  basic: "Explorer",
  specDriven: "Architect",
  harness: "Engineer",
  multiAgent: "Commander",
  academic: "Scholar",
  outcome: "Visionary",
};

function typeName(id: string): string {
  return TYPE_NAMES[id] || id;
}

export function compareTypes(
  selectedType: string,
  actualType: string,
  confidence: Confidence,
): TypeComparison {
  const typeLevel: Record<string, number> = {
    basic: 1, specDriven: 2, harness: 3,
    multiAgent: 3, academic: 2, outcome: 4,
  };

  if (confidence === "low") {
    return {
      pattern: "aligned",
      evaluationType: selectedType,
      message: "環境データが少ないため、志向タイプを基準に評価します",
    };
  }

  if (selectedType === actualType) {
    return {
      pattern: "aligned",
      evaluationType: selectedType,
      message: `あなたの志向と環境が一致しています（${typeName(selectedType)}）`,
    };
  }

  if (typeLevel[selectedType] > typeLevel[actualType]) {
    return {
      pattern: "aspiring",
      evaluationType: selectedType,
      message: `あなたは${typeName(selectedType)}を志向していますが、環境は現在${typeName(actualType)}です。ステップアップの提案をします`,
    };
  }

  return {
    pattern: "underutilized",
    evaluationType: actualType,
    message: `あなたの環境は${typeName(actualType)}レベルですが、${typeName(selectedType)}の使い方をしています。現在の環境をもっと活かせます`,
  };
}

// ─── 3-layer suggestion generation ───

export function generateGapSuggestions(
  diagnosis: DiagnosisResult,
  typeRelative: TypeRelativeResult | null,
  selectedInterest?: string,
  evaluationType?: string,
): GapSuggestion[] {
  const suggestions: GapSuggestion[] = [];
  const evalType = evaluationType || diagnosis.selectedType || diagnosis.primaryType;
  const ref = getTypeReference(evalType);

  // Layer 1: Interest-based suggestions
  if (selectedInterest && selectedInterest !== "general") {
    const interestInfo = INTEREST_TO_FEATURES[selectedInterest];
    if (interestInfo && interestInfo.features.length > 0) {
      for (const feature of interestInfo.features) {
        suggestions.push({
          type: "interest",
          title: feature,
          description: `「${interestInfo.label}」に必要な機能`,
          prompt: getFeatureSetupPrompt(feature),
          priority: 100,
        });
      }
    }
  }

  // Layer 2: Knowledge gap (Q5 unknownFeatures relevant to evaluationType)
  if (ref) {
    for (const featureId of diagnosis.unknownFeatures) {
      const info = FEATURE_INFO[featureId];
      if (!info) continue;

      const isRelevant = isFeatureRelevantToType(featureId, ref.items);
      if (!isRelevant) continue;

      suggestions.push({
        type: "knowledge",
        title: info.name,
        description: `${ref.typeName}に必要な機能ですが、まだ使ったことがないようです。${info.description}`,
        prompt: info.prompt,
        priority: 80,
      });
    }
  }

  // Layer 3: Environment gap (items scoring below 80)
  if (typeRelative && ref) {
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

// ─── Helpers ───

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
    automode: ["自動化レベル"],
    swarm: ["並列開発", "サブエージェント活用"],
    cloudtasks: ["自動化レベル", "通信・遠隔"],
    marketplace: ["スキル数と多様性", "プラグイン活用"],
  };

  const relatedItems = featureToItems[featureId] ?? [];
  return relatedItems.some(
    (itemName) => items[itemName] === "required" || items[itemName] === "recommended",
  );
}

function getFeatureSetupPrompt(feature: string): string {
  const prompts: Record<string, string> = {
    "project-initializer スキル": "~/.claude/skills/project-initializer/SKILL.md を作成し、CLAUDE.md・ARCHITECTURE.md・feature_list.json・init.sh を対話的に生成するスキルを定義してください。",
    "skill-resolver スキル": "~/.claude/skills/skill-resolver/SKILL.md を作成し、仕様書に基づいて最適なスキル構成を判定するスキルを定義してください。",
    "CLAUDE.md テンプレート": "~/.claude/CLAUDE.md をテンプレートとして整備し、新プロジェクトのルール・コマンド・ワークフローの雛形を作成してください。",
    "feature_list.json": "プロジェクトルートに feature_list.json を作成し、各機能にid, name, passes, test_stepsを定義してください。",
    "/user:test + test-writer サブエージェント": "~/.claude/commands/test.md と ~/.claude/agents/test-writer.md を作成し、テスト実行→失敗修正→再実行のループを自動化してください。",
    "/user:review + code-reviewer サブエージェント": "~/.claude/commands/review.md と ~/.claude/agents/code-reviewer.md を作成し、セキュリティ・品質・テストの観点でレビューを自動化してください。",
    "/user:commit コマンド": "~/.claude/commands/commit.md を作成し、lint→テスト→コミット→進捗更新の品質チェック付きコミットフローを定義してください。",
    "PostToolUse フック": "settings.json の hooks セクションに PostToolUse フックを追加し、Write/Edit後に自動フォーマットを実行してください。",
    "debugger サブエージェント": "~/.claude/agents/debugger.md を作成してください。エラーメッセージ・スタックトレース・失敗テストを分析し、根本原因を特定して修正する専門エージェントです。",
    "/user:debug コマンド": "~/.claude/commands/debug.md を作成し、debuggerサブエージェントで原因特定→修正を実行するコマンドを定義してください。",
    "/user:bugfix コマンド": "~/.claude/commands/bugfix.md を作成し、バグ報告からdebuggerサブエージェントで原因調査→修正→テストを実行するコマンドを定義してください。",
    "/user:build コマンド": "~/.claude/commands/build.md を作成し、ビルド→ランタイム検証→デバッグを一括実行する品質検証コマンドを定義してください。",
    "CLAUDE.md 品質検証ルール": "CLAUDE.md に品質検証セクションを追加し、ビルド検証→ランタイム検証→テスト実行→バグ自動修正ループのルールを記載してください。",
    "常駐ルール（rules/）": "~/.claude/rules/ に coding-standards.md, security-baseline.md, testing-policy.md を作成してください。",
    "adversarial-review スキル": "~/.claude/skills/adversarial-review/SKILL.md を作成し、敵対的コードレビューを実行するスキルを定義してください。",
    "quality-auditor + /user:audit コマンド": "~/.claude/agents/quality-auditor.md と ~/.claude/commands/audit.md を作成し、コードベース全体の品質監査を実行してください。",
    "/user:refactor コマンド": "~/.claude/commands/refactor.md を作成し、quality-auditorの監査結果に基づきリファクタリングを実行するコマンドを定義してください。",
    "dependency-check スキル": "~/.claude/skills/dependency-check/SKILL.md を作成し、依存パッケージの脆弱性・更新状況チェックを自動化してください。",
    "Git Worktree（cawエイリアス）": "~/.zshrc に alias caw='claude --worktree' を追加してください。",
    "Agent Teams": "CLAUDE_AGENT_TEAM 環境変数を設定し、Agent Teamsを有効化してください。",
    "claude-peers MCP": "claude mcp add claude-peers -- npx @anthropic-ai/claude-peers を実行してください。",
    "Context7 MCP": "claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp を実行してください。",
    "/weekly-eval コマンド": "~/.claude/commands/weekly-eval.md を作成し、週次環境自己採点を自動化してください。",
    "researcher サブエージェント": "~/.claude/agents/researcher.md を作成し、技術調査を独立して行うエージェントを定義してください。",
  };
  return prompts[feature] || `${feature} をセットアップしてください。`;
}

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
    "並列開発": "Agent Teams/Swarm Modeを有効化し、isolation: worktreeで並列PRパイプラインを構築してください。",
    "エコシステム連携": "everything-claude-code をリファレンスに追加し、ecc-dispatcher スキルを作成してください。",
    "自動化レベル": "Auto Mode、/effort、Auto Memory、/loop、Remote Controlを導入してください。",
    "通信・遠隔": "claude-peers MCP、--channelsパーミッションリレー、Remote Controlを追加してください。",
    "モデル戦略": "スキル/エージェントごとにmodel:フロントマターを設定し、Haiku/Sonnet/Opusを使い分けてください。",
    "安全設計": "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1を設定し、careful/freezeスキルを導入してください。",
  };
  return prompts[itemName] ?? `${itemName} の設定を改善してください。`;
}
